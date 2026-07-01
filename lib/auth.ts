import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import prisma from "@/lib/prisma";
import { ac, adminRole, superAdminRole, userRole } from "./auth-permissions";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mysql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    admin({
      ac: ac,
      roles: {
        admin: adminRole,
        super_admin: superAdminRole,
        user: userRole,
      },
      adminRoles: ["admin", "super_admin"],
    }),
  ],
});
