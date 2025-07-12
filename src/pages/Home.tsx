import { Link } from "react-router-dom";
import { useAdminPermissions } from "../hooks/useAdminPermissions";
import Footer from "../components/Footer";

export default function Home() {
  const { permissions } = useAdminPermissions();

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-br from-pink-800 to-yellow-700 text-white p-10">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-4xl font-bold">🎓 Plataforma Educativa de Fracciones</h1>
        <p className="text-lg">Selecciona una actividad:</p>

        <div className="flex flex-col gap-4">
          <Link
            to="/pizza"
            className="px-6 py-3 bg-white/20 rounded-lg hover:bg-white/30 transition"
          >
            🍕 Simulador de Fracciones
          </Link>
          <Link
            to="/fracciones"
            className="px-6 py-3 bg-white/20 rounded-lg hover:bg-white/30 transition"
          >
            📘 Aprende Fracciones Paso a Paso
          </Link>
          <Link
              to="/escalera"
              className="px-6 py-3 bg-white/20 rounded-lg hover:bg-white/30 transition"
            >
              🪜 Ir a la Escalera de Fracciones
            </Link>
          <Link
            to="/don-fraccion"
            className="px-6 py-3 bg-white/20 rounded-lg hover:bg-white/30 transition"
          >
            🛍️ Ir a Don Fracción
          </Link>

          {/* Separador visual para herramientas administrativas - solo si tiene permisos */}
          {permissions.isAdmin && (
            <div className="border-t border-white/20 pt-4 mt-4">
              <p className="text-sm text-white/80 mb-3 text-center">🔧 Herramientas Administrativas</p>
              <Link
                to="/admin/presentations"
                className="px-6 py-3 bg-blue-500/30 rounded-lg hover:bg-blue-500/40 transition border border-blue-300/50"
              >
                ⚙️ Administrar Presentaciones
              </Link>
            </div>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
}
