import { Outlet, Link, useLocation } from 'react-router-dom';
import { Users, Utensils, Settings } from 'lucide-react'; // Iconos nuevos
import { cn } from '../lib/utils';
import { useTheme } from '../context/ThemeContext';

export default function AdminLayout() {
  const location = useLocation();
  const { isDark } = useTheme();

  const darkBg = "#1E1611"; 
  const creamColor = "#F5EBDC";

  // Función de estilo de botones (reutilizada para mantener coherencia)
  const btnClass = (path: string) => {
    // Verificamos si la ruta actual EMPIEZA con el path (para sub-rutas)
    const isActive = location.pathname === path || (path !== '/admin' && location.pathname.startsWith(path));
    
    if (isDark) {
      return cn(
        "flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300",
        isActive 
          ? "text-[#F5EBDC] scale-110" 
          : "text-[#F5EBDC] opacity-40" 
      );
    }

    return cn(
      "flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300",
      isActive 
        ? "text-cafe-primary bg-cafe-primary/10 scale-110" 
        : "text-gray-400 hover:text-cafe-primary"
    );
  };

  return (
    <div className="min-h-screen bg-cafe-bg pb-24 transition-colors duration-300 w-full max-w-[600px] mx-auto relative shadow-2xl shadow-black/5 dark:shadow-black/20">
      
      <Outlet />

      {/* BARRA DE NAVEGACIÓN ADMIN */}
      <nav 
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] py-4 px-8 flex justify-between items-center z-50 transition-all duration-300"
        style={{
           backgroundColor: isDark ? darkBg : '#FFFFFF',
           borderTop: isDark ? 'none' : '1px solid #F3F4F6',
           boxShadow: isDark ? 'none' : '0 -4px 6px -1px rgba(0,0,0,0.05)'
        }}
      >
        
        {/* 1. Gestión de Personal (Icono de Grupo) */}
        <Link to="/admin" className={btnClass('/admin')}>
          <Users size={26} strokeWidth={2.5} />
        </Link>

        {/* 2. Gestión de Menú (Cubiertos cruzados) */}
        <Link to="/admin/menu-gestion" className={btnClass('/admin/menu-gestion')}>
          <Utensils size={26} strokeWidth={2.5} />
        </Link>

        {/* 3. Ajustes (Ahora apunta a /admin/ajustes) */}
        <Link to="/admin/ajustes" className={btnClass('/admin/ajustes')}> 
          <Settings size={26} strokeWidth={2.5} />
        </Link>

      </nav>
    </div>
  );
}