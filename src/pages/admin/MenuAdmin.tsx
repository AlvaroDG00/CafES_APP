import { ClipboardList, Users, UtensilsCrossed, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';

export default function AdminMenu() {
  const { isDark } = useTheme();

  const opciones = [
    { 
      label: 'Gestión del menú', 
      icon: <UtensilsCrossed size={24} />, 
      ruta: '/admin/menu-gestion',
      color: 'bg-orange-100 text-orange-600'
    },
    { 
      label: 'Estado de pedidos', // EL NUEVO ACCESO
      icon: <ClipboardList size={24} />, 
      ruta: '/admin/estado-pedidos',
      color: 'bg-green-100 text-green-600'
    },
    { 
      label: 'Gestión de personal', 
      icon: <Users size={24} />, 
      ruta: '/admin/personal',
      color: 'bg-blue-100 text-blue-600'
    },
    { 
      label: 'Configuración', 
      icon: <Settings size={24} />, 
      ruta: '/admin/ajustes',
      color: 'bg-gray-100 text-gray-600'
    },
  ];

  return (
    <div className="p-6 min-h-screen bg-cafe-bg transition-colors duration-300">
      <h1 className="text-3xl font-bold text-center text-cafe-text mb-10 mt-4">
        Panel de Control
      </h1>

      <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto">
        {opciones.map((opcion) => (
          <Link
            key={opcion.ruta}
            to={opcion.ruta}
            style={{ 
              backgroundColor: isDark ? '#2C221C' : '#FFFFFF',
              borderColor: isDark ? '#F5EBDC10' : '#4E342E10'
            }}
            className="flex items-center gap-4 p-5 rounded-[2rem] border shadow-sm active:scale-95 transition-all group"
          >
            <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110", opcion.color)}>
              {opcion.icon}
            </div>
            <span className="font-bold text-lg text-cafe-text">
              {opcion.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}