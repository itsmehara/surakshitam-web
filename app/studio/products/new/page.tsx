import { AdminGate } from "@/components/admin/AdminGate";
import { AdminProductForm } from "@/components/admin/AdminProductForm";

export default function NewProductPage() {
  return (
    <AdminGate>
      <AdminProductForm />
    </AdminGate>
  );
}
