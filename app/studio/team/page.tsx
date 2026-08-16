import { AdminGate } from "@/components/admin/AdminGate";
import { AdminTeam } from "@/components/admin/AdminTeam";

export default function AdminTeamPage() {
  return (
    <AdminGate>
      <AdminTeam />
    </AdminGate>
  );
}
