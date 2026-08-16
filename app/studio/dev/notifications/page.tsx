import { AdminGate } from "@/components/admin/AdminGate";
import { DevNotifications } from "@/components/admin/DevNotifications";

export default function DevNotificationsPage() {
  return (
    <AdminGate>
      <DevNotifications />
    </AdminGate>
  );
}
