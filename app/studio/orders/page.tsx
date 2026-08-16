import { AdminGate } from "@/components/admin/AdminGate";
import { AdminOrders } from "@/components/admin/AdminOrders";

export default function AdminOrdersPage() {
  return (
    <AdminGate>
      <AdminOrders />
    </AdminGate>
  );
}
