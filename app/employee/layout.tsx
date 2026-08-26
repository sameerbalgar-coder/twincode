import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/server-auth";
import { EmployeeLayout } from "@/components/employee/EmployeeLayout";

export default async function EmployeeRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect("/auth/login?redirect=/employee/dashboard");
  }

  if (session.user.role !== "employee") {
    redirect("/unauthorized");
  }

  return <EmployeeLayout>{children}</EmployeeLayout>;
}