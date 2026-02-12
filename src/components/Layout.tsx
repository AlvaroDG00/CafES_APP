import { Outlet, Link, useLocation } from 'react-router-dom';
import { Utensils, ShoppingCart, Settings } from 'lucide-react';
import { cn } from '../lib/utils';
import { useCarrito } from '../context/CarritoContext';
import { useTheme } from '../context/ThemeContext';

export default function Layout() {
  const location = useLocation();
  const { cantidad } = useCarrito();
  const { isDark } = useTheme();

  const darkBg = "#1E1611"; 
  const creamColor = "#F5EBDC";

  const btnClass = (path: string) => {
    const isActive = location.pathname === path;
    
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
    // 1. AÑADIDO: 'max-w-[600px] mx-auto' para centrar la app en pantallas grandes
    // 'shadow-2xl' opcional para darle un toque de relieve si el fondo de fuera es distinto
    <div className="min-h-screen bg-cafe-bg pb-24 transition-colors duration-300 w-full max-w-[600px] mx-auto relative shadow-2xl shadow-black/5 dark:shadow-black/20">
      
      <Outlet />

      {/* BARRA DE NAVEGACIÓN */}
      <nav 
        // 2. MODIFICADO: Cambiamos 'left-0 right-0' por 'left-1/2 -translate-x-1/2'
        // Esto fuerza a la barra fija a centrarse matemáticamente en la pantalla
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] py-4 px-8 flex justify-between items-center z-50 transition-all duration-300"
        style={{
           backgroundColor: isDark ? darkBg : '#FFFFFF',
           borderTop: isDark ? 'none' : '1px solid #F3F4F6',
           boxShadow: isDark ? 'none' : '0 -4px 6px -1px rgba(0,0,0,0.05)'
        }}
      >
        <Link to="/menu" className={btnClass('/menu')}>
          <Utensils size={26} strokeWidth={2.5} />
        </Link>

        <Link to="/carrito" className={cn(btnClass('/carrito'), "relative")}>
          <ShoppingCart size={26} strokeWidth={2.5} />
          {cantidad > 0 && (
            <span 
              className={cn(
                "absolute top-0 right-0 text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-in zoom-in border-2",
                isDark 
                  ? "bg-red-500 text-white border-[#1E1611]" 
                  : "bg-red-500 text-white border-white"
              )}
            >
              {cantidad}
            </span>
          )}
        </Link>

        <Link to="/ajustes" className={btnClass('/ajustes')}> 
          <Settings size={26} strokeWidth={2.5} />
        </Link>

      </nav>
    </div>
  );
}