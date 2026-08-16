import { AdminGate } from "@/components/admin/AdminGate";
import { AdminOrderDetail } from "@/components/admin/AdminOrderDetail";

export default function AdminOrderDetailPage({ params }: { params: { orderNumber: string } }) {
  return (
    <AdminGate>
      <AdminOrderDetail orderNumber={params.orderNumber} />
    </AdminGate>
  );
}
