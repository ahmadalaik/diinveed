import { authIsRequired } from "@/features/auth/utils/middleware";
import { DashboardOverview } from "@/features/customer/dashboard/components/dashboard-overview";
import { getDashboardSummary } from "@/features/customer/dashboard/lib/get-dashboard-summary";

export default async function UserDashboardPage() {
  const user = await authIsRequired();
  const summary = await getDashboardSummary(user.id);

  return <DashboardOverview user={user.name} summary={summary} />;
}
