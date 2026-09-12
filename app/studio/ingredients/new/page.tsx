import { AdminGate } from "@/components/admin/AdminGate";
import { AdminIngredientForm } from "@/components/admin/AdminIngredientForm";

export default function NewIngredientPage() {
  return (
    <AdminGate>
      <AdminIngredientForm />
    </AdminGate>
  );
}
