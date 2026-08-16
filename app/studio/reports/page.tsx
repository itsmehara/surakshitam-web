import { AdminGate } from "@/components/admin/AdminGate";
import { AdminReports } from "@/components/admin/AdminReports";

export default function AdminReportsPage() {
  return (
    <AdminGate>
      <AdminReports />
    </AdminGate>
  );
}
