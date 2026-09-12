import { AdminGate } from "@/components/admin/AdminGate";
import { AdminIngredientForm } from "@/components/admin/AdminIngredientForm";

export default function EditIngredientPage({ params }: { params: { slug: string } }) {
  return (
    <AdminGate>
      <AdminIngredientForm slug={params.slug} />
    </AdminGate>
  );
}
