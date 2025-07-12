import { AdminAuth } from "../components/Admin/AdminAuth";
import { PresentationAdmin } from "../components/Presentation/PresentationAdmin";

export default function PresentationAdminPage() {
  return (
    <AdminAuth>
      <PresentationAdmin />
    </AdminAuth>
  );
}
