import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAdminPermissions } from "../hooks/useAdminPermissions";

interface LayoutProps {
  children: React.ReactNode;
  showAdminAccess?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, showAdminAccess = false }) => {
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const location = useLocation();
  const { permissions } = useAdminPermissions();

  const isAdminRoute = location.pathname.startsWith('/admin');
  const shouldShowAdminAccess = showAdminAccess && permissions.isAdmin;

  return (
    <div className="min-h-screen relative">
      {/* Botón de acceso rápido al admin (solo si showAdminAccess está habilitado y tiene permisos) */}
      {shouldShowAdminAccess && !isAdminRoute && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setShowAdminMenu(!showAdminMenu)}
            className="p-2 bg-blue-600/80 text-white rounded-full shadow-lg hover:bg-blue-700/80 transition-all"
            title="Herramientas de administración"
          >
            ⚙️
          </button>
          
          {showAdminMenu && (
            <div className="absolute top-12 right-0 bg-white rounded-lg shadow-xl border border-gray-200 min-w-48 overflow-hidden">
              <div className="p-2 bg-gray-50 border-b">
                <h3 className="text-sm font-medium text-gray-700">Administración</h3>
              </div>
              <div className="p-1">
                <Link
                  to="/admin/presentations"
                  className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded transition-colors"
                  onClick={() => setShowAdminMenu(false)}
                >
                  📊 Gestionar Presentaciones
                </Link>
                <Link
                  to="/"
                  className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded transition-colors"
                  onClick={() => setShowAdminMenu(false)}
                >
                  🏠 Volver al Inicio
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Breadcrumb para rutas administrativas */}
      {isAdminRoute && (
        <div className="bg-gray-100 border-b">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <nav className="flex items-center space-x-2 text-sm">
              <Link to="/" className="text-blue-600 hover:text-blue-800">
                🏠 Inicio
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">Administración</span>
              {location.pathname.includes('/presentations') && (
                <>
                  <span className="text-gray-400">/</span>
                  <span className="text-gray-800">Presentaciones</span>
                </>
              )}
            </nav>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      {children}

      {/* Overlay para cerrar el menú admin al hacer clic fuera */}
      {showAdminMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowAdminMenu(false)}
        />
      )}
    </div>
  );
};
