import { createAuthClient } from "better-auth/react";
import { adminClient, usernameClient } from "better-auth/client/plugins";
import { ac, adminRole, superAdminRole, userRole } from "./auth-permissions";

export const authClient = createAuthClient({
  plugins: [
    adminClient({
      ac: ac,
      roles: {
        admin: adminRole,
        super_admin: superAdminRole,
        user: userRole,
      },
    }),
    usernameClient()
  ],
});

export const { signIn, signUp, signOut, useSession } = authClient;
