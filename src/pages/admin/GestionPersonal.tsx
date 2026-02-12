import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MoreHorizontal, Plus, UserX } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useEmpleados } from '../../context/EmpleadosContext';

export default function GestionPersonal() {
  const { listaEmpleados, eliminarEmpleado } = useEmpleados();
  const [menuAbierto, setMenuAbierto] = useState<number | null>(null);
  const [idEliminar, setIdEliminar] = useState<number | null>(null);

  return (
    <div className="p-6 h-full relative bg-cafe-bg min-h-screen">
      <h1 className="text-3xl font-bold text-center text-cafe-text mb-8 mt-4">
        Gestión de personal
      </h1>

      {/* Botón Nuevo Empleado */}
      <div className="flex justify-center mb-10">
        <Link 
            to="/admin/nuevo-empleado" 
            className="group relative p-1.5 rounded-full pr-6 pl-2 flex items-center gap-3 transition-transform active:scale-95 shadow-sm hover:brightness-110 bg-[#D7CCC8] dark:bg-[#C4B6AC]"
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
          <div key={emp.id} className="flex items-center justify-between p-4 bg-white dark:bg-white/5 rounded-2xl border border-cafe-text/5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-cafe-primary/20 flex items-center justify-center text-cafe-primary font-bold">
                {emp.nombre.charAt(0)}
              </div>
              <span className="font-medium text-cafe-text">{emp.nombre}</span>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setMenuAbierto(menuAbierto === emp.id ? null : emp.id)}
                className="p-2 text-gray-400 hover:text-cafe-primary transition-colors"
              >
                <MoreHorizontal size={20} />
              </button>

              {menuAbierto === emp.id && (
                <div className="absolute right-0 top-10 w-40 bg-white dark:bg-[#2C221C] rounded-xl shadow-xl border border-black/5 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <button 
                    onClick={() => {
                        setIdEliminar(emp.id);
                        setMenuAbierto(null);
                    }}
                    className="w-full p-3 text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2 text-sm font-bold"
                  >
                    <UserX size={16} /> Eliminar
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DE ELIMINAR (Confirmación) */}
      {idEliminar !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-[#A1887F] dark:bg-[#8D6E63] w-full max-w-sm rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95">
                <div className="p-8 text-center text-white">
                    <h3 className="text-lg font-bold leading-snug">
                        ¿Está seguro de querer eliminar al empleado?
                    </h3>
                    <p className="text-sm opacity-80 mt-2">Esta acción no se puede deshacer.</p>
                </div>
                <div className="flex border-t border-white/10">
                    <button 
                        onClick={() => {
                            eliminarEmpleado(idEliminar);
                            setIdEliminar(null);
                        }}
                        className="flex-1 p-4 text-red-200 font-bold hover:bg-black/10 transition-colors border-r border-white/10"
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