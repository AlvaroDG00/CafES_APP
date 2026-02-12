import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Añadido useNavigate
import { MoreHorizontal, Plus, UserX, ChevronLeft } from 'lucide-react'; // Añadido ChevronLeft
import { useEmpleados } from '../../context/EmpleadosContext';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';

export default function GestionPersonal() {
  const navigate = useNavigate(); // Hook para volver
  const { listaEmpleados, eliminarEmpleado } = useEmpleados();
  const { isDark } = useTheme();
  const [menuAbierto, setMenuAbierto] = useState<number | null>(null);
  const [idEliminar, setIdEliminar] = useState<number | null>(null);

  return (
    <div className="p-6 h-full relative bg-cafe-bg min-h-screen transition-colors duration-300">
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
          Gestión de personal
        </h1>
      </div>

      {/* Botón Nuevo Empleado */}
      <div className="flex justify-center mb-10">
        <Link 
            to="/admin/nuevo-empleado" 
            className="group relative p-1.5 rounded-full pr-6 pl-2 flex items-center gap-3 transition-transform active:scale-95 shadow-sm bg-[#D7CCC8] dark:bg-[#C4B6AC]"
        >
           <div className="bg-sky-300 dark:bg-[#6AD2FF] p-2 rounded-full text-white">
              <Plus size={20} strokeWidth={3} />
           </div>
           <span className="font-bold text-[#4E342E] text-sm">Nuevo empleado</span>
        </Link>
      </div>

      {/* Lista de Empleados */}
      <div className="space-y-4">
        {listaEmpleados.map((emp) => (
          <div 
            key={emp.id} 
            style={{ 
              backgroundColor: isDark ? '#342A22' : '#FFFFFF',
              border: isDark ? '1px solid #F5EBDC20' : '1px solid #4A3B3210'
            }}
            className="flex items-center justify-between p-4 rounded-2xl shadow-sm transition-all"
          >
            <div className="flex items-center gap-4">
              <div 
                style={{ 
                  backgroundColor: isDark ? '#F5EBDC' : '#6F4E3720',
                  color: isDark ? '#1E1611' : '#6F4E37'
                }}
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
              >
                {emp.nombre.charAt(0)}
              </div>
              
              <span className="font-bold text-cafe-text">
                {emp.nombre}
              </span>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setMenuAbierto(menuAbierto === emp.id ? null : emp.id)}
                className="p-2 text-gray-400 dark:text-[#F5EBDC] transition-colors"
              >
                <MoreHorizontal size={24} />
              </button>

              {menuAbierto === emp.id && (
                <div className="absolute right-0 top-10 w-40 bg-white dark:bg-[#2C221C] rounded-xl shadow-xl border border-black/5 dark:border-white/10 z-50 overflow-hidden">
                  <button 
                    onClick={() => {
                        setIdEliminar(emp.id);
                        setMenuAbierto(null);
                    }}
                    className="w-full p-3 text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 text-sm font-bold"
                  >
                    <UserX size={16} /> Eliminar
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DE ELIMINAR */}
      {idEliminar !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#A1887F] dark:bg-[#342A22] w-full max-w-sm rounded-xl shadow-2xl border border-white/10">
                <div className="p-8 text-center text-white">
                    <h3 className="text-lg font-bold">¿Eliminar empleado?</h3>
                    <p className="text-sm opacity-70 mt-2">Esta acción no se puede deshacer.</p>
                </div>
                <div className="flex border-t border-white/10">
                    <button 
                        onClick={() => {
                            eliminarEmpleado(idEliminar);
                            setIdEliminar(null);
                        }}
                        className="flex-1 p-4 text-red-300 font-bold hover:bg-black/10 transition-colors border-r border-white/10"
                    >
                        Eliminar
                    </button>
                    <button 
                        onClick={() => setIdEliminar(null)}
                        className="flex-1 p-4 text-white font-bold hover:bg-black/10 transition-colors"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}