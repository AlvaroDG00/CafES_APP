import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';
import { ChevronLeft } from 'lucide-react'; // Añadido ChevronLeft

export default function AjustesAdmin() {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  const rowClass = "w-full p-5 flex justify-between items-center row-ajustes transition-colors duration-300 first:rounded-t-xl last:border-none";

  return (
    <div className="p-6">
      {/* CABECERA CON FLECHA */}
      <div className="flex items-center mb-8 mt-4 relative">
        <button 
          onClick={() => navigate('/admin')}
          className={cn(
            "p-2 rounded-full shadow-sm transition-all active:scale-95 absolute left-0",
            isDark ? "bg-[#2C221C] text-[#F5EBDC]" : "bg-white text-cafe-text"
          )}
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-3xl font-bold text-center text-cafe-text flex-1">
          Configuración
        </h1>
      </div>

      <div className="rounded-xl shadow-sm overflow-hidden isolate">
        
        {/* 1. Modo Oscuro */}
        <div className={rowClass}>
          <span className="font-bold text-base text-cafe-text">Modo Oscuro</span>
          
          <button 
            onClick={toggleTheme}
            className={cn(
              "w-14 h-8 rounded-full transition-colors relative focus:outline-none",
              isDark ? "bg-[#6F4E37] dark:bg-[#F5EBDC]" : "bg-gray-300"
            )}
          >
            <span className={cn(
              "absolute top-1 left-1 bg-white dark:bg-[#1E1611] w-6 h-6 rounded-full shadow-md transition-transform duration-300",
              isDark ? "translate-x-6" : "translate-x-0"
            )} />
          </button>
        </div>

        {/* 2. Cerrar Sesión */}
        <button 
            onClick={handleLogout}
            className="w-full p-5 flex justify-center items-center bg-[#DBCBB6] dark:bg-[#4E342E] border-t border-white/10 text-white dark:text-[#F5EBDC] font-bold text-lg hover:brightness-110 transition-all rounded-b-xl"
        >
          Cerrar sesión
        </button>

      </div>
    </div>
  );
}