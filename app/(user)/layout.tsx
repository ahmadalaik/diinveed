import { authIsRequired } from "@/features/auth/utils/middleware";
import { Navbar } from "@/components/layout/navbar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { CustomerSidebar } from "@/features/customer/dashboard/components/customer-sidebar";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await authIsRequired();

  return (
    <SidebarProvider>
      <CustomerSidebar />
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <Navbar user={user} />
        </header>
        <div className="flex-1 p-6 bg-[#fafafa]">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
