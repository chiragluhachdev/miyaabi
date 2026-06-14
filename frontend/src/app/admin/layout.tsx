import { AdminAuthProvider } from "@/context/AdminAuthContext";
import AdminShell from "@/components/admin/AdminShell";

export const metadata = {
  title: "Admin — miyaabi",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminShell>{children}</AdminShell>
    </AdminAuthProvider>
  );
}
