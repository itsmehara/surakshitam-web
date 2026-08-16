import { AdminGate } from "@/components/admin/AdminGate";
import { AdminProductForm } from "@/components/admin/AdminProductForm";

export default function EditProductPage({ params }: { params: { id: string } }) {
  return (
    <AdminGate>
      <AdminProductForm productId={params.id} />
    </AdminGate>
  );
}
