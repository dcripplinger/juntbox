#!/bin/bash -i
# We need the -i so this script inherits the environment from the user's .bashrc and can locate nvm

####################################################
# setup.sh                                         #
# FOR LOCALDEV SETUP ONLY                          #
####################################################

YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Some commands in this script may require you to enter your password for sudo access. However, you should not run the whole script with sudo, since that may make some file permissions annoying.${NC}"
echo ""
echo -e "${YELLOW}Always run this script from the project root.${NC}"
echo ""

echo "loading environment variables..."
. .env

echo "checking node installation with nvm..."
command -v nvm > /dev/null

if [[ $? != 0 ]]; then
    echo "nvm is not installed"
    echo "installing..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
    command -v nvm > /dev/null
    if [[ $? != 0 ]]; then
        echo "nvm installation failed - exiting"
        exit
    fi
fi

get_node_version () {
    OUTPUT=`nvm version`
    if [[ $? != 0 ]]; then
        echo "nvm command failed - exiting"
        exit
    fi
}

get_node_version

if [[ $OUTPUT != "v$NODE_VERSION" ]]; then
    echo "nvm is not using the correct version of node"
    echo "installing correct node version..."
    nvm install $NODE_VERSION
    if [[ $? != 0 ]]; then
        echo "nvm command to install node failed - exiting"
        exit
    fi
    echo "selecting correct node version for use..."
    nvm use $NODE_VERSION
    if [[ $? != 0 ]]; then
        echo "nvm command to use the node version failed - exiting"
        exit
    fi
    get_node_version
    if [[ $OUTPUT != "v$NODE_VERSION" ]]; then
        echo "nvm is still not using the correct node version - exiting"
        exit
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
        exit
    fi
    yarn --version
    if [[ $? != 0 ]]; then
        echo "yarn is still not installed - exiting"
        exit
    fi
fi

echo "updating node packages..."
yarn
if [[ $? != 0 ]]; then
    echo "something went wrong updating the node packages - exiting"
    exit
fi

echo "Setup complete"

echo ""
echo -e "${YELLOW}To use the correct version of node:${NC}"
echo "    nvm use $NODE_VERSION"
echo ""
echo -e "${YELLOW}To have the correct version of node persist for new terminals, also do this:${NC}"
echo "    nvm alias default $NODE_VERSION"
echo ""
