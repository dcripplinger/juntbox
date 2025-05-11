import { EntityType, type Prisma, type RoleType } from "@prisma/client";
import bcrypt from "bcrypt";
import { z } from "zod";

const checkPassword = async (
  trx: Prisma.TransactionClient,
  userId: string,
  password: string,
) => {
  const user = await trx.user.findFirst({ where: { id: userId } });
  const isValid = user?.passwordHash
    ? await bcrypt.compare(password, user.passwordHash)
    : false;
  return isValid;
};

const setPassword = async (
  trx: Prisma.TransactionClient,
  userId: string,
  password: string,
) => {
  await trx.user.findFirstOrThrow({ where: { id: userId } });
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);
  await trx.user.update({
    where: { id: userId },
    data: { passwordHash },
  });
};

const ensureEntityExists = async (
  trx: Prisma.TransactionClient,
  entityId: string,
  entityType: EntityType,
) => {
  if (entityType === "system") {
    if (entityId === "system") return;
    throw Error(
      "entityType is set to 'system', but entityId is not set to 'system'",
    );
  } else if (entityType === "user") {
    await trx.user.findFirstOrThrow({ where: { id: entityId } });
  }
};

const addRole = async (
  trx: Prisma.TransactionClient,
  userId: string,
  roleType: RoleType,
  entityId: string,
  entityType: EntityType,
) => {
  await trx.user.findFirstOrThrow({ where: { id: userId } });
  await ensureEntityExists(trx, entityId, entityType);
  await trx.role.create({
    data: {
      userId,
      roleType,
      entityId,
      entityType,
    },
  });
  return null;
};

const permissionSchema = z.enum([
  "sysadmin", // Has sysadmin privileges. Can refine based on actions if it becomes necessary.
  "user", // For viewing and editing stuff directly about a user.
  "budget", // For viewing and editing anything in a budget.
  "budget.delete", // For deleting a budget.
]);
type TPermission = z.infer<typeof permissionSchema>;

const hasPermissionSchema = z.object({
  permission: permissionSchema,
  entityType: z.nativeEnum(EntityType),
  entityId: z.literal("system").or(z.string().cuid()),
});

const permissionsByRole: Record<RoleType, Record<EntityType, TPermission[]>> = {
  admin: {
    system: ["sysadmin", "user"],
    user: ["user"],
  },
  editor: {
    system: [],
    user: [],
  },
  viewer: {
    system: [],
    user: [],
  },
};

type Entity = {
  entityType: EntityType;
  entityId: string;
};

const getParentEntityFromChild = async (
  trx: Prisma.TransactionClient,
  childId: string,
  childType: EntityType,
): Promise<Entity | null> => {
  const system: Entity = {
    entityType: "system",
    entityId: "system",
  };

  switch (childType) {
    case "system":
      return null;
    case "user":
      return system;
  }
};

const listPermissionsOnEntity = async (
  trx: Prisma.TransactionClient,
  userId: string,
  entityId: string,
  entityType: EntityType,
) => {
  console.log("inside listPermissionsOnEntity");
  const user = await trx.user.findFirstOrThrow({
    where: { id: userId },
    include: { roles: true },
  });
  console.log("grabbed user");
  await ensureEntityExists(trx, entityId, entityType);
  const permissions = new Set<TPermission>();
  let nextEntity: Entity | null = {
    entityId,
    entityType,
  };
  // let role: Role | undefined;
  while (nextEntity) {
    // Find the first (and only, due to unique constraint) role for this entity and user,
    // if one is found at all.
    const role = user.roles.find(
      (r) =>
        r.entityId === nextEntity?.entityId &&
        r.entityType === nextEntity.entityType,
    );
    // If a role is found, add all the permissions for that roleType and entityType to the set
    if (role) {
      permissionsByRole[role.roleType][nextEntity.entityType].forEach(
        (permission) => {
          permissions.add(permission);
        },
      );
    }
    nextEntity = await getParentEntityFromChild(
      trx,
      nextEntity.entityId,
      nextEntity.entityType,
    );
  }
  return Array.from(permissions).sort();
};

const hasPermission = async (
  trx: Prisma.TransactionClient,
  userId: string,
  permission: TPermission,
  entityId: string,
  entityType: EntityType,
) => {
  if (!userId) {
    return false;
  }
  const permissions = await listPermissionsOnEntity(
    trx,
    userId,
    entityId,
    entityType,
  );
  return permissions.includes(permission);
};

export {
  addRole,
  checkPassword,
  hasPermission,
  hasPermissionSchema,
  setPassword,
};
