import { AdminGate } from "@/components/admin/AdminGate";
import { AdminProducts } from "@/components/admin/AdminProducts";

export default function AdminProductsPage() {
  return (
    <AdminGate>
      <AdminProducts />
    </AdminGate>
  );
}
