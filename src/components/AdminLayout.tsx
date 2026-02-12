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
    </div>
  );
}