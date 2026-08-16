import { AdminGate } from "@/components/admin/AdminGate";
import { AdminActivity } from "@/components/admin/AdminActivity";

export default function AdminActivityPage() {
  return (
    <AdminGate>
      <AdminActivity />
    </AdminGate>
  );
}
