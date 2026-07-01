import { createAccessControl } from "better-auth/plugins/access";
import {
  defaultStatements,
  defaultRoles,
  adminAc,
} from "better-auth/plugins/admin/access";

const userStatements: string[] = [...defaultStatements.user];
const sessionStatements: string[] = [...defaultStatements.session];

export const ac = createAccessControl({
  user: userStatements,
  session: sessionStatements,
});

export const userRole = defaultRoles.user;
export const adminRole = adminAc;

export const superAdminRole = ac.newRole({
  user: userStatements,
  session: sessionStatements,
});
