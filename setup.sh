#!/bin/bash -i
# We need the -i so this script inherits the environment from the user's .bashrc and can locate nvm

####################################################
# setup.sh                                         #
# FOR LOCALDEV SETUP ONLY                          #
####################################################

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Escape a string for use inside a PostgreSQL single-quoted literal.
pg_sql_escape_literal () {
    printf '%s' "$1" | sed "s/'/''/g"
}

# Debian/Ubuntu layout; pg_createcluster needs this once the server package is installed.
postgres_initdb_path () {
    printf '/usr/lib/postgresql/%s/bin/initdb' "${LOCAL_PG_VERSION}"
}

suggest_postgresql_apt_install () {
    echo -e "${YELLOW}Install the PostgreSQL ${LOCAL_PG_VERSION} server package (provides initdb), e.g. on Debian/Ubuntu:${NC}"
    echo "    sudo apt update && sudo apt install postgresql-${LOCAL_PG_VERSION}"
    echo "Then run ./setup.sh again."
}

postgres_bindir () {
    dirname "$(postgres_initdb_path)"
}

postgres_data_dir () {
    printf '/var/lib/postgresql/%s/%s' "${LOCAL_PG_VERSION}" "${LOCAL_PG_CLUSTER_NAME}"
}

postgres_log_file () {
    printf '/var/log/postgresql/postgresql-%s-%s.log' "${LOCAL_PG_VERSION}" "${LOCAL_PG_CLUSTER_NAME}"
}

postgres_systemd_unit () {
    printf 'postgresql@%s-%s.service' "${LOCAL_PG_VERSION}" "${LOCAL_PG_CLUSTER_NAME}"
}

diagnose_postgres_cluster_start_failure () {
    echo ""
    echo -e "${YELLOW}PostgreSQL did not start.${NC} The systemd unit often fails on WSL (notify timeout, cgroup, or policy-rc.d)."
    echo "Inspect the cluster log and journal:"
    echo "    sudo tail -n 100 $(postgres_log_file)"
    echo "    sudo journalctl -xeu $(postgres_systemd_unit) --no-pager | tail -80"
    echo "    sudo systemctl status $(postgres_systemd_unit)"
    echo ""
    echo "If you see a real Postgres error in the log, fix that first. Otherwise try starting without systemd:"
    echo "    sudo -u postgres $(postgres_bindir)/pg_ctl -D $(postgres_data_dir) -l $(postgres_log_file) -w start"
    echo "Then run ./setup.sh again (later steps are idempotent)."
}

start_postgres_cluster () {
    if sudo pg_ctlcluster "$LOCAL_PG_VERSION" "$LOCAL_PG_CLUSTER_NAME" start; then
        return 0
    fi
    echo ""
    echo -e "${YELLOW}pg_ctlcluster start failed; trying pg_ctl (often works when systemd does not).${NC}"
    if sudo -u postgres "$(postgres_bindir)/pg_ctl" -D "$(postgres_data_dir)" -l "$(postgres_log_file)" -w start; then
        echo "PostgreSQL started with pg_ctl."
        return 0
    fi
    diagnose_postgres_cluster_start_failure
    exit 1
}

echo -e "${YELLOW}Some commands in this script may require you to enter your password for sudo access. However, you should not run the whole script with sudo, since that may make some file permissions annoying.${NC}"
echo ""
echo -e "${YELLOW}Run this script from anywhere; it loads .env from the project root (${SCRIPT_DIR}).${NC}"
echo ""

echo "loading environment variables..."
# shellcheck source=/dev/null
. "${SCRIPT_DIR}/.env"

require_local_pg_vars () {
    local missing=()
    [[ -z "${LOCAL_PG_VERSION:-}" ]] && missing+=(LOCAL_PG_VERSION)
    [[ -z "${LOCAL_PG_PORT:-}" ]] && missing+=(LOCAL_PG_PORT)
    [[ -z "${LOCAL_PG_DATABASE:-}" ]] && missing+=(LOCAL_PG_DATABASE)
    [[ -z "${LOCAL_PG_USER:-}" ]] && missing+=(LOCAL_PG_USER)
    [[ -z "${LOCAL_PG_PASSWORD:-}" ]] && missing+=(LOCAL_PG_PASSWORD)
    if [[ ${#missing[@]} -gt 0 ]]; then
        echo -e "${YELLOW}LOCAL_PG_CLUSTER_NAME is set but the following are required:${NC} ${missing[*]}"
        exit 1
    fi
}

pg_cluster_line () {
    pg_lsclusters 2>/dev/null | awk -v ver="$LOCAL_PG_VERSION" -v cname="$LOCAL_PG_CLUSTER_NAME" 'NR>1 && $1==ver && $2==cname {print; exit}'
}

refresh_cluster_state () {
    local line
    line=$(pg_cluster_line)
    LOCAL_PG_CURRENT_PORT=""
    LOCAL_PG_CURRENT_STATUS=""
    if [[ -n "$line" ]]; then
        # Port and status are always fields 3 and 4 (datadir may contain spaces).
        read -r LOCAL_PG_CURRENT_PORT LOCAL_PG_CURRENT_STATUS <<<"$(awk '{print $3, $4}' <<< "$line")"
    fi
}

# Fail fast if another Debian/Ubuntu cluster (or a non-Postgres process) already uses LOCAL_PG_PORT.
assert_local_pg_port_available () {
    local other ours_online
    other=$(pg_lsclusters 2>/dev/null | awk -v p="$LOCAL_PG_PORT" -v mv="$LOCAL_PG_VERSION" -v mn="$LOCAL_PG_CLUSTER_NAME" '
        NR > 1 && $3 == p && !($1 == mv && $2 == mn) { print $1 "/" $2; exit }
    ')
    if [[ -n "$other" ]]; then
        echo -e "${YELLOW}Port ${LOCAL_PG_PORT} is already used by another PostgreSQL cluster: ${other}${NC}"
        echo "Free the port (for example: \`sudo pg_ctlcluster <ver> <name> stop\` then \`sudo pg_dropcluster <ver> <name> --remove\`),"
        echo "or set LOCAL_PG_PORT in .env to a free port. Run \`pg_lsclusters\` to list clusters."
        exit 1
    fi

    if command -v ss &> /dev/null; then
        if ss -ltn 2>/dev/null | grep -qE ":${LOCAL_PG_PORT}\\b"; then
            ours_online=$(pg_lsclusters 2>/dev/null | awk -v p="$LOCAL_PG_PORT" -v mv="$LOCAL_PG_VERSION" -v mn="$LOCAL_PG_CLUSTER_NAME" '
                NR > 1 && $3 == p && $1 == mv && $2 == mn && tolower($4) == "online" { print 1; exit }
            ')
            if [[ -z "$ours_online" ]]; then
                echo -e "${YELLOW}TCP port ${LOCAL_PG_PORT} is already in use, but pg_lsclusters does not show this project cluster online on that port.${NC}"
                echo "Something else may be listening (see ss below). Free the port or pick a different LOCAL_PG_PORT."
                ss -ltnp 2>/dev/null | grep -E ":${LOCAL_PG_PORT}\\b" || ss -ltn 2>/dev/null | grep -E ":${LOCAL_PG_PORT}\\b" || true
                exit 1
            fi
        fi
    fi
}

append_hba_rule_if_missing () {
    local hba_file line
    hba_file="/etc/postgresql/${LOCAL_PG_VERSION}/${LOCAL_PG_CLUSTER_NAME}/pg_hba.conf"
    line="host    ${LOCAL_PG_DATABASE}    ${LOCAL_PG_USER}    127.0.0.1/32    scram-sha-256"
    if sudo test -f "$hba_file"; then
        if ! sudo grep -qxF "$line" "$hba_file" 2>/dev/null; then
            printf '%s\n' "$line" | sudo tee -a "$hba_file" > /dev/null
            sudo pg_ctlcluster "$LOCAL_PG_VERSION" "$LOCAL_PG_CLUSTER_NAME" reload
        fi
    fi
}

ensure_psql_login () {
    local pw_esc
    pw_esc=$(pg_sql_escape_literal "$LOCAL_PG_PASSWORD")
    if PGPASSWORD="$LOCAL_PG_PASSWORD" psql -h 127.0.0.1 -p "$LOCAL_PG_PORT" -U "$LOCAL_PG_USER" -d "$LOCAL_PG_DATABASE" -c "SELECT 1" &> /dev/null; then
        return 0
    fi
    echo "db user ${LOCAL_PG_USER} cannot connect to database ${LOCAL_PG_DATABASE}; fixing password and pg_hba..."
    sudo -u postgres psql --cluster "${LOCAL_PG_VERSION}/${LOCAL_PG_CLUSTER_NAME}" -v ON_ERROR_STOP=1 -c \
        "ALTER USER \"${LOCAL_PG_USER}\" WITH PASSWORD '${pw_esc}';" 2> /dev/null \
        || {
            echo "ALTER USER failed. Exiting."
            exit 1
        }
    append_hba_rule_if_missing
    PGPASSWORD="$LOCAL_PG_PASSWORD" psql -h 127.0.0.1 -p "$LOCAL_PG_PORT" -U "$LOCAL_PG_USER" -d "$LOCAL_PG_DATABASE" -c "SELECT 1" &> /dev/null \
        || {
            echo "db user still cannot connect after pg_hba update. Exiting."
            exit 1
        }
}

setup_native_postgres () {
    echo ""
    echo "=== Native PostgreSQL (Debian/Ubuntu postgresql-common) ==="
    require_local_pg_vars

    if ! command -v pg_createcluster &> /dev/null; then
        echo -e "${YELLOW}pg_createcluster not found.${NC} Install PostgreSQL tooling, e.g. on Debian/Ubuntu:"
        echo "    sudo apt update && sudo apt install postgresql-common postgresql-${LOCAL_PG_VERSION}"
        echo "Then run ./setup.sh again."
        exit 1
    fi

    if ! [[ -x "$(postgres_initdb_path)" ]]; then
        echo -e "${YELLOW}PostgreSQL ${LOCAL_PG_VERSION} server is not installed.${NC}"
        echo "postgresql-common is present, but there is no initdb for this version (typical when only the client or an older server is installed)."
        suggest_postgresql_apt_install
        exit 1
    fi

    assert_local_pg_port_available

    refresh_cluster_state

    if [[ -z "${LOCAL_PG_CURRENT_STATUS:-}" ]]; then
        echo "PostgreSQL cluster ${LOCAL_PG_VERSION}/${LOCAL_PG_CLUSTER_NAME} does not exist; creating..."
        sudo pg_createcluster "$LOCAL_PG_VERSION" "$LOCAL_PG_CLUSTER_NAME" -p "$LOCAL_PG_PORT" || {
            echo "pg_createcluster failed. Exiting."
            if ! [[ -x "$(postgres_initdb_path)" ]]; then
                suggest_postgresql_apt_install
            fi
            exit 1
        }
        refresh_cluster_state
    fi

    if [[ -n "${LOCAL_PG_CURRENT_PORT:-}" && "$LOCAL_PG_CURRENT_PORT" != "$LOCAL_PG_PORT" ]]; then
        echo "Cluster is on port ${LOCAL_PG_CURRENT_PORT}; setting port to ${LOCAL_PG_PORT} via conf.d snippet..."
        local conf_snippet
        conf_snippet="/etc/postgresql/${LOCAL_PG_VERSION}/${LOCAL_PG_CLUSTER_NAME}/conf.d/99-juntbox-port.conf"
        printf 'port = %s\n' "$LOCAL_PG_PORT" | sudo tee "$conf_snippet" > /dev/null || {
            echo "Failed to write port config. Exiting."
            exit 1
        }
        sudo pg_ctlcluster "$LOCAL_PG_VERSION" "$LOCAL_PG_CLUSTER_NAME" restart || {
            echo "pg_ctlcluster restart failed. Exiting."
            diagnose_postgres_cluster_start_failure
            exit 1
        }
        refresh_cluster_state
        if [[ "$LOCAL_PG_CURRENT_PORT" != "$LOCAL_PG_PORT" ]]; then
            echo "Cluster is still not on port ${LOCAL_PG_PORT}. Exiting."
            exit 1
        fi
    fi

    local st
    st="${LOCAL_PG_CURRENT_STATUS,,}"
    if [[ "$st" != "online" ]]; then
        echo "Starting cluster ${LOCAL_PG_VERSION}/${LOCAL_PG_CLUSTER_NAME} (status was: ${LOCAL_PG_CURRENT_STATUS:-unknown})..."
        start_postgres_cluster
        refresh_cluster_state
    fi

    local dbexists
    dbexists=$(sudo -u postgres psql --cluster "${LOCAL_PG_VERSION}/${LOCAL_PG_CLUSTER_NAME}" -tAc \
        "SELECT 1 FROM pg_database WHERE datname='${LOCAL_PG_DATABASE}'" 2>/dev/null) || {
        echo "psql (database listing) failed. Exiting."
        exit 1
    }

    if [[ -z "${dbexists// /}" ]]; then
        echo "Creating database ${LOCAL_PG_DATABASE}..."
        sudo -u postgres psql --cluster "${LOCAL_PG_VERSION}/${LOCAL_PG_CLUSTER_NAME}" -v ON_ERROR_STOP=1 -c \
            "CREATE DATABASE \"${LOCAL_PG_DATABASE}\";" || {
            echo "CREATE DATABASE failed. Exiting."
            exit 1
        }
    fi

    local roleexists
    roleexists=$(sudo -u postgres psql --cluster "${LOCAL_PG_VERSION}/${LOCAL_PG_CLUSTER_NAME}" -tAc \
        "SELECT 1 FROM pg_roles WHERE rolname='${LOCAL_PG_USER}'" 2>/dev/null) || {
        echo "psql (role listing) failed. Exiting."
        exit 1
    }

    if [[ -z "${roleexists// /}" ]]; then
        echo "Creating role ${LOCAL_PG_USER}..."
        local pw_esc
        pw_esc=$(pg_sql_escape_literal "$LOCAL_PG_PASSWORD")
        sudo -u postgres psql --cluster "${LOCAL_PG_VERSION}/${LOCAL_PG_CLUSTER_NAME}" -v ON_ERROR_STOP=1 -c \
            "CREATE USER \"${LOCAL_PG_USER}\" WITH ENCRYPTED PASSWORD '${pw_esc}';" || {
            echo "CREATE USER failed. Exiting."
            exit 1
        }
    fi

    append_hba_rule_if_missing

    ensure_psql_login

    echo "Granting database ownership to ${LOCAL_PG_USER}..."
    sudo -u postgres psql --cluster "${LOCAL_PG_VERSION}/${LOCAL_PG_CLUSTER_NAME}" -v ON_ERROR_STOP=1 -c \
        "ALTER DATABASE \"${LOCAL_PG_DATABASE}\" OWNER TO \"${LOCAL_PG_USER}\";" || {
        echo "ALTER DATABASE OWNER failed. Exiting."
        exit 1
    }

    echo -e "${GREEN}Native PostgreSQL is ready.${NC}"
    echo ""
    echo -e "${YELLOW}Prisma: set DATABASE_URL and DIRECT_URL in .env to the same value for local Postgres (no pooler), e.g.:${NC}"
    echo "    postgresql://${LOCAL_PG_USER}:<URL-ENCODED-PASSWORD>@127.0.0.1:${LOCAL_PG_PORT}/${LOCAL_PG_DATABASE}?sslmode=disable"
    echo "(If the password has special characters, URL-encode it; @ # / etc. must be encoded for a valid connection URL.)"
    echo ""
}

if [[ -n "${LOCAL_PG_CLUSTER_NAME:-}" ]]; then
    setup_native_postgres
else
    echo -e "${YELLOW}Skipping native PostgreSQL (set LOCAL_PG_CLUSTER_NAME in .env to enable).${NC}"
    echo ""
fi

echo "checking node installation with nvm..."
command -v nvm > /dev/null

if [[ $? != 0 ]]; then
    echo "nvm is not installed"
    echo "installing..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
    command -v nvm > /dev/null
    if [[ $? != 0 ]]; then
        echo "nvm installation failed - exiting"
        exit 1
    fi
fi

get_node_version () {
    local output
    output=$(nvm version) || {
        echo "nvm command failed - exiting"
        exit 1
    }
    echo "$output"
}

OUTPUT=$(get_node_version)

if [[ $OUTPUT != "v$NODE_VERSION" ]]; then
    echo "nvm is not using the correct version of node"
    echo "installing correct node version..."
    nvm install $NODE_VERSION
    if [[ $? != 0 ]]; then
        echo "nvm command to install node failed - exiting"
        exit 1
    fi
    echo "selecting correct node version for use..."
    nvm use $NODE_VERSION
    if [[ $? != 0 ]]; then
        echo "nvm command to use the node version failed - exiting"
        exit 1
    fi
    OUTPUT=$(get_node_version)
    if [[ $OUTPUT != "v$NODE_VERSION" ]]; then
        echo "nvm is still not using the correct node version - exiting"
        exit 1
    fi
fi

echo "checking yarn installation..."
yarn --version

if [[ $? != 0 ]]; then
    echo "yarn is not installed"
    echo "installing..."
    npm install --global yarn
    if [[ $? != 0 ]]; then
        echo "yarn installation failed - exiting"
        exit 1
    fi
    yarn --version
    if [[ $? != 0 ]]; then
        echo "yarn is still not installed - exiting"
        exit 1
    fi
fi

echo "updating node packages..."
(cd "$SCRIPT_DIR" && yarn)
if [[ $? != 0 ]]; then
    echo "something went wrong updating the node packages - exiting"
    exit 1
fi

echo "Setup complete"

echo ""
echo -e "${YELLOW}To use the correct version of node:${NC}"
echo "    nvm use $NODE_VERSION"
echo ""
echo -e "${YELLOW}To have the correct version of node persist for new terminals, also do this:${NC}"
echo "    nvm alias default $NODE_VERSION"
echo ""
