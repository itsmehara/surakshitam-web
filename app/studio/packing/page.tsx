import { AdminGate } from "@/components/admin/AdminGate";
import { AdminPacking } from "@/components/admin/AdminPacking";

export default function AdminPackingPage() {
  return (
    <AdminGate>
      <AdminPacking />
    </AdminGate>
  );
}
