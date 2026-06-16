import LoginForm from "@/features/auth/components/login-form";
import { authIsNotRequired } from "@/features/auth/utils/middleware";

export default async function LoginPage() {
  await authIsNotRequired();

  return <LoginForm />;
}
