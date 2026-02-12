import { ChevronLeft, Moon, Sun, LogOut, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';

export default function ConfiguracionEmpleado() {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Aquí iría tu lógica de limpieza de tokens si la tienes
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-cafe-bg p-6 transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link 
          to="/empleado" 
          className={cn(
            "p-2 rounded-full transition-all active:scale-95",
            isDark ? "bg-[#2C221C] text-[#F5EBDC]" : "bg-white shadow-sm text-cafe-text"
          )}
        >
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold text-cafe-text">Configuración</h1>
      </div>

      <div className="space-y-4">
        {/* Perfil del Empleado */}
        <div 
          style={{ backgroundColor: isDark ? '#2C221C' : '#FFFFFF' }}
          className="p-6 rounded-3xl border border-white/5 flex items-center gap-4"
        >
          <div className="bg-cafe-primary/20 p-3 rounded-full text-cafe-primary">
            <User size={32} />
          </div>
          <div>
            <p className="text-sm opacity-60 text-cafe-text">Sesión iniciada como</p>
            <p className="font-bold text-lg text-cafe-text">Empleado Cafetería</p>
          </div>
        </div>

        {/* Ajustes de Interfaz */}
        <div 
          style={{ backgroundColor: isDark ? '#2C221C' : '#FFFFFF' }}
          className="rounded-3xl border border-white/5 overflow-hidden"
        >
          <button 
            onClick={toggleTheme}
            className="w-full p-5 flex items-center justify-between hover:bg-black/5 transition-colors"
          >
            <div className="flex items-center gap-4">
              {isDark ? <Sun className="text-orange-400" /> : <Moon className="text-indigo-600" />}
              <span className="font-bold text-cafe-text">Modo {isDark ? 'Claro' : 'Oscuro'}</span>
            </div>
            <div className={cn(
              "w-12 h-6 rounded-full relative transition-colors",
              isDark ? "bg-cafe-primary" : "bg-gray-300"
            )}>
              <div className={cn(
                "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                isDark ? "left-7" : "left-1"
              )} />
            </div>
          </button>
        </div>

        {/* Cerrar Sesión */}
        <button 
          onClick={handleLogout}
          style={{ backgroundColor: isDark ? '#2C221C' : '#FFFFFF' }}
          className="w-full p-5 rounded-3xl border border-white/5 flex items-center gap-4 text-red-500 font-bold hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={24} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
}