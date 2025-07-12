import { useState } from 'react';
import { useAdminPermissions } from '../../hooks/useAdminPermissions';

interface AdminAuthProps {
  onAuthenticated?: () => void;
  children: React.ReactNode;
}

export const AdminAuth: React.FC<AdminAuthProps> = ({ onAuthenticated, children }) => {
  const { permissions, enableAdminMode, disableAdminMode } = useAdminPermissions();
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = enableAdminMode(password);
    
    if (success) {
      setShowLogin(false);
      setPassword('');
      setError('');
      onAuthenticated?.();
    } else {
      setError('Contraseña incorrecta');
    }
  };

  const handleLogout = () => {
    disableAdminMode();
  };

  // Si ya está autenticado, mostrar contenido con opción de logout
  if (permissions.isAdmin) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-green-600">🔓</span>
            <span className="text-sm text-green-700 font-medium">Modo Administrador Activo</span>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full">
        {!showLogin ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                🔒
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Acceso Restringido</h2>
              <p className="text-gray-600 mt-2">
                Esta área requiere permisos de administrador
              </p>
            </div>
            
            <button
              onClick={() => setShowLogin(true)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Iniciar Sesión de Administrador
            </button>
            
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
              <p><strong>Modo de desarrollo:</strong></p>
              <p>Contraseña: <code className="bg-yellow-100 px-1 rounded">admin123</code></p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Autenticación de Administrador</h2>
            </div>
            
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña de Administrador
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ingresa la contraseña"
                  required
                />
                {error && (
                  <p className="mt-1 text-sm text-red-600">{error}</p>
                )}
              </div>
              
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Acceder
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowLogin(false);
                    setPassword('');
                    setError('');
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
