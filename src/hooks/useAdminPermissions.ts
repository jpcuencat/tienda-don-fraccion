import { useState, useEffect } from 'react';

interface AdminPermissions {
  canManagePresentations: boolean;
  canViewAnalytics: boolean;
  canExportData: boolean;
  isAdmin: boolean;
}

// Simulación simple de permisos de administrador
// En una implementación real, esto vendría de un sistema de autenticación
export const useAdminPermissions = () => {
  const [permissions, setPermissions] = useState<AdminPermissions>({
    canManagePresentations: false,
    canViewAnalytics: false,
    canExportData: false,
    isAdmin: false,
  });

  const [isAdminMode, setIsAdminMode] = useState(false);

  useEffect(() => {
    // Verificar si hay una sesión de admin almacenada
    const adminSession = localStorage.getItem('admin_session');
    const adminMode = localStorage.getItem('admin_mode') === 'true';
    
    if (adminSession === 'active' || adminMode) {
      setPermissions({
        canManagePresentations: true,
        canViewAnalytics: true,
        canExportData: true,
        isAdmin: true,
      });
      setIsAdminMode(true);
    }
  }, []);

  // Función para activar modo administrador (simulado)
  const enableAdminMode = (password: string = '') => {
    // En desarrollo, cualquier password funciona
    // En producción, esto debería validar contra un backend seguro
    const isDevelopment = import.meta.env.MODE === 'development';
    if (password === 'admin123' || isDevelopment) {
      const newPermissions = {
        canManagePresentations: true,
        canViewAnalytics: true,
        canExportData: true,
        isAdmin: true,
      };
      
      setPermissions(newPermissions);
      setIsAdminMode(true);
      localStorage.setItem('admin_session', 'active');
      localStorage.setItem('admin_mode', 'true');
      
      return true;
    }
    return false;
  };

  // Función para desactivar modo administrador
  const disableAdminMode = () => {
    setPermissions({
      canManagePresentations: false,
      canViewAnalytics: false,
      canExportData: false,
      isAdmin: false,
    });
    setIsAdminMode(false);
    localStorage.removeItem('admin_session');
    localStorage.removeItem('admin_mode');
  };

  // Función para verificar una ruta administrativa
  const canAccessAdminRoute = (route: string): boolean => {
    if (!permissions.isAdmin) return false;
    
    switch (route) {
      case '/admin/presentations':
        return permissions.canManagePresentations;
      case '/admin/analytics':
        return permissions.canViewAnalytics;
      default:
        return permissions.isAdmin;
    }
  };

  return {
    permissions,
    isAdminMode,
    enableAdminMode,
    disableAdminMode,
    canAccessAdminRoute,
  };
};
