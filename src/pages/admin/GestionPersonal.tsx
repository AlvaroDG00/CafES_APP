import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MoreHorizontal, Plus, UserX, ChevronLeft } from "lucide-react";
import { useEmpleados } from "../../context/EmpleadosContext";
import { useTheme } from "../../context/ThemeContext";
import { cn } from "../../lib/utils";

export default function GestionPersonal() {
  const navigate = useNavigate();
  const { listaEmpleados, eliminarEmpleado } = useEmpleados();
  const { isDark } = useTheme();
  const [menuAbierto, setMenuAbierto] = useState<number | null>(null);
  const [idEliminar, setIdEliminar] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "fixed inset-0 z-0 w-full max-w-[600px] mx-auto overflow-hidden overscroll-none flex flex-col transition-colors duration-300",
        isDark ? "bg-[#1A120B]" : "bg-[#F3EFE0]",
      )}
    >
      {/* BLOQUE SUPERIOR ESTÁTICO */}
      <div className="shrink-0 pt-6 px-6 pb-2">
        {/* CABECERA CON FLECHA */}
        <div className="flex items-center mb-8 mt-4 relative">
          <button
            onClick={() => navigate("/admin")}
            className={cn(
              "p-2 rounded-full shadow-sm transition-all active:scale-95 absolute left-0 z-10",
              isDark
                ? "bg-[#2C221C] text-[#F5EBDC]"
                : "bg-white text-cafe-text",
            )}
          >
            <ChevronLeft size={24} />
          </button>
          <h1
            className={cn(
              "text-2xl font-bold text-center flex-1",
              isDark ? "text-[#F5EBDC]" : "text-cafe-text",
            )}
          >
            Gestión de personal
          </h1>
        </div>

        {/* Botón Nuevo Empleado */}
        <div className="flex justify-center mb-6">
          <Link
            to="/admin/nuevo-empleado"
            className="group relative p-1.5 rounded-full pr-6 pl-2 flex items-center gap-3 transition-transform active:scale-95 shadow-sm bg-[#D7CCC8] dark:bg-[#C4B6AC]"
          >
            <div className="bg-sky-300 dark:bg-[#6AD2FF] p-2 rounded-full text-white">
              <Plus size={20} strokeWidth={3} />
            </div>
            <span className="font-bold text-[#4E342E] text-sm">
              Nuevo empleado
            </span>
          </Link>
        </div>
      </div>

      {/* ÁREA DE SCROLL PARA LA LISTA DE EMPLEADOS */}
      <div className="flex-1 overflow-y-auto px-6 pb-24 no-scrollbar">
        <div className="space-y-4">
          {listaEmpleados.map((emp) => (
            <div
              key={emp.id}
              className={cn(
                "flex items-center justify-between p-4 rounded-2xl shadow-sm transition-all border",
                isDark
                  ? "bg-[#2C221C] border-[#F5EBDC]/10"
                  : "bg-white border-[#4A3B32]/10",
              )}
            >
              <div className="flex items-center gap-4">
                {/* Avatar circular con la inicial */}
                <div
                  style={{
                    backgroundColor: isDark ? "#F5EBDC" : "#6F4E3720",
                    color: isDark ? "#1E1611" : "#6F4E37",
                  }}
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shrink-0"
                >
                  {emp.nombre.charAt(0)}
                </div>

                {/* Información del empleado */}
                <div className="flex flex-col">
                  <span
                    className={cn(
                      "font-bold text-lg leading-tight",
                      isDark ? "text-[#F5EBDC]" : "text-cafe-text",
                    )}
                  >
                    {emp.nombre}
                  </span>
                  <span
                    className={cn(
                      "text-xs mt-0.5 opacity-60 font-medium",
                      isDark ? "text-[#F5EBDC]" : "text-cafe-text",
                    )}
                  >
                    {emp.correo}
                  </span>
                </div>
              </div>

              <div className="relative">
                <button
                  onClick={() =>
                    setMenuAbierto(menuAbierto === emp.id ? null : emp.id)
                  }
                  className={cn(
                    "p-2 transition-colors",
                    isDark ? "text-[#F5EBDC]/60" : "text-gray-400",
                  )}
                >
                  <MoreHorizontal size={24} />
                </button>

                {/* Menú desplegable de opciones */}
                {menuAbierto === emp.id && (
                  <div className="absolute right-0 top-10 w-40 bg-white dark:bg-[#FFFFFF] rounded-xl shadow-xl border border-black/5 dark:border-white/10 z-50 overflow-hidden">
                    <button
                      onClick={() => {
                        setIdEliminar(emp.id);
                        setMenuAbierto(null);
                      }}
                      className="w-full p-4 text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 text-sm font-bold"
                    >
                      <UserX size={18} /> Eliminar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL DE CONFIRMACIÓN PARA ELIMINAR */}
      {idEliminar !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div
            className={cn(
              "w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border border-white/10",
              isDark ? "bg-[#2C221C]" : "bg-[#A1887F]",
            )}
          >
            <div className="p-8 text-center text-white">
              <h3 className="text-lg font-bold">¿Eliminar empleado?</h3>
              <p className="text-sm opacity-70 mt-2">
                Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="flex border-t border-white/10">
              <button
                onClick={() => {
                  eliminarEmpleado(idEliminar);
                  setIdEliminar(null);
                }}
                className="flex-1 p-4 text-red-200 font-bold hover:bg-red-500/20 transition-colors border-r border-white/10"
              >
                Eliminar
              </button>
              <button
                onClick={() => setIdEliminar(null)}
                className="flex-1 p-4 text-white font-bold hover:bg-white/10 transition-colors"
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
