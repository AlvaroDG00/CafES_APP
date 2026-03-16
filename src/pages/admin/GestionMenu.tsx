import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MoreHorizontal, Plus, ChevronLeft, Edit3, Trash2 } from "lucide-react";
import { useProductos } from "../../context/ProductosContext";
import { cn } from "../../lib/utils";
import { useTheme } from "../../context/ThemeContext";

export default function GestionMenu() {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  // Extraemos actualizarProducto para poder cambiar el estado de disponibilidad
  const { listaProductos, eliminarProducto, actualizarProducto } =
    useProductos();

  const [categoriaActiva, setCategoriaActiva] = useState("Bocadillo");
  const [menuAbierto, setMenuAbierto] = useState<number | null>(null);
  const [idEliminar, setIdEliminar] = useState<number | null>(null);

  const categorias = [
    "Bocadillo",
    "Bebidas frías",
    "Bebida caliente",
    "Bollería",
    "Pack/Menú",
  ];

  const productosFiltrados = listaProductos.filter(
    (p) => p.categoria === categoriaActiva,
  );

  // --- FUNCIÓN PARA CAMBIAR EL ESTADO (Habilitar / Deshabilitar) ---
  const handleToggle = (id: number, estadoActual: boolean) => {
    if (actualizarProducto) {
      // Enviamos el ID y el nuevo estado invertido
      actualizarProducto(id, { disponible: !estadoActual });
    }
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-0 w-full max-w-[600px] mx-auto overflow-hidden overscroll-none flex flex-col transition-colors duration-300",
        isDark ? "bg-[#1A120B]" : "bg-[#F3EFE0]",
      )}
    >
      {/* BLOQUE SUPERIOR ESTÁTICO */}
      <div className="shrink-0 pt-6 px-6 pb-2">
        {/* CABECERA */}
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
            Gestión del menú
          </h1>
        </div>

        {/* Botón Nuevo Producto */}
        <div className="flex justify-center mb-8">
          <Link
            to="/admin/nuevo-producto"
            className="group relative p-1.5 rounded-full pr-6 pl-2 flex items-center gap-3 transition-transform active:scale-95 shadow-sm hover:brightness-110 bg-[#D7CCC8] dark:bg-[#C4B6AC]"
          >
            <div className="bg-sky-300 dark:bg-[#6AD2FF] text-white rounded-full p-2 shadow-sm">
              <Plus size={20} strokeWidth={3} />
            </div>
            <span className="font-bold text-sm pr-2 text-[#4A3B32] dark:text-[#1E1611]">
              Nuevo producto
            </span>
          </Link>
        </div>

        {/* Categorías */}
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6">
          {categorias.map((cat) => {
            const isActive = categoriaActiva === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategoriaActiva(cat)}
                className={cn(
                  "px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap border shadow-sm shrink-0", // Añadido shrink-0 para que las pastillas no se aplasten
                  isDark
                    ? isActive
                      ? "bg-[#8D6E63] text-white border-[#8D6E63]"
                      : "bg-[#2C221C] text-[#F5EBDC] border-[#F5EBDC]/10"
                    : isActive
                      ? "bg-[#8D6E63] text-white border-[#8D6E63]"
                      : "bg-white text-[#4E342E] border-[#4E342E]/10",
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* ÁREA DE SCROLL PARA LA LISTA DE PRODUCTOS */}
      <div className="flex-1 overflow-y-auto px-6 pb-24">
        <div className="mt-2 space-y-4">
          {productosFiltrados.map((prod) => {
            // Asumimos que si no existe la propiedad, está disponible por defecto
            const estaDisponible = prod.disponible !== false;

            return (
              <div
                key={prod.id}
                className={cn(
                  "flex items-center justify-between p-4 rounded-2xl border shadow-sm transition-all duration-300",
                  isDark
                    ? "bg-[#2C221C] border-[#F5EBDC]/10"
                    : "bg-white border-[#4E342E]/5",
                  !estaDisponible && "opacity-60",
                )}
              >
                <div className="flex items-center gap-4 flex-1 overflow-hidden">
                  {/* INTERRUPTOR CONFIGURADO */}
                  <button
                    onClick={() => handleToggle(prod.id, estaDisponible)}
                    className={cn(
                      "w-12 h-6 rounded-full relative transition-colors duration-300 shrink-0",
                      estaDisponible
                        ? "bg-green-500"
                        : "bg-gray-400 dark:bg-gray-600",
                    )}
                  >
                    <div
                      className={cn(
                        "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-md",
                        estaDisponible ? "translate-x-7" : "translate-x-1",
                      )}
                    />
                  </button>

                  <span
                    className={cn(
                      "font-bold text-lg truncate transition-all",
                      isDark ? "text-[#F5EBDC]" : "text-[#4E342E]",
                      !estaDisponible && "line-through opacity-50",
                    )}
                  >
                    {prod.nombre}
                  </span>
                </div>

                <button
                  onClick={() => setMenuAbierto(prod.id)}
                  className={cn(
                    "p-2 rounded-full hover:bg-black/10 transition-colors shrink-0",
                    isDark ? "text-[#F5EBDC]/60" : "text-[#9CA3AF]",
                  )}
                >
                  <MoreHorizontal size={24} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* SUBMENÚ MODERNO */}
      {menuAbierto !== null && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-[2px] animate-in fade-in duration-300"
            onClick={() => setMenuAbierto(null)}
          />
          <div className="fixed inset-x-0 bottom-0 z-50 p-4 pb-10 flex flex-col items-center">
            <div className="w-full max-w-sm animate-in slide-in-from-bottom duration-300">
              {/* Bloque de Acciones */}
              <div
                className={cn(
                  "rounded-[2.5rem] overflow-hidden mb-3 border shadow-2xl",
                  isDark
                    ? "bg-[#1A120B] border-[#F5EBDC]/10"
                    : "bg-[#FDF8F3] border-[#4E342E]/10",
                )}
              >
                <button
                  onClick={() => {
                    const producto = listaProductos.find(
                      (p) => p.id === menuAbierto,
                    );
                    setMenuAbierto(null);
                    navigate("/admin/editar-producto", { state: { producto } });
                  }}
                  className={cn(
                    "w-full py-6 text-center font-bold flex items-center justify-center gap-3 active:bg-black/10 transition-colors border-b",
                    isDark
                      ? "text-[#F5EBDC] border-[#F5EBDC]/5"
                      : "text-[#4E342E] border-[#4E342E]/5",
                  )}
                >
                  <Edit3 size={20} />
                  Editar producto
                </button>

                <button
                  onClick={() => {
                    setIdEliminar(menuAbierto);
                    setMenuAbierto(null);
                  }}
                  className="w-full py-6 text-center font-bold text-red-500 flex items-center justify-center gap-3 active:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={20} />
                  Eliminar
                </button>
              </div>

              {/* Botón Cancelar */}
              <button
                onClick={() => setMenuAbierto(null)}
                className="w-full py-5 bg-[#8D6E63] text-white font-bold rounded-3xl shadow-lg active:scale-95 transition-transform"
              >
                Cancelar
              </button>
            </div>
          </div>
        </>
      )}

      {/* Popup Confirmación Eliminación */}
      {idEliminar !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div
            className={cn(
              "w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10",
              isDark ? "bg-[#2C221C]" : "bg-white",
            )}
          >
            <div className="p-10 text-center">
              <h3
                className={cn(
                  "text-xl font-bold",
                  isDark ? "text-[#F5EBDC]" : "text-[#4E342E]",
                )}
              >
                ¿Eliminar este producto?
              </h3>
              <p className="text-sm opacity-60 mt-2">
                Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="flex border-t border-black/5 dark:border-white/10">
              <button
                onClick={() => {
                  if (eliminarProducto) eliminarProducto(idEliminar);
                  setIdEliminar(null);
                }}
                className="flex-1 p-5 text-red-500 font-bold hover:bg-red-500/10 border-r border-black/5 dark:border-white/10"
              >
                Eliminar
              </button>
              <button
                onClick={() => setIdEliminar(null)}
                className={cn(
                  "flex-1 p-5 font-bold hover:bg-black/5 transition-colors",
                  isDark ? "text-[#F5EBDC]" : "text-[#4E342E]",
                )}
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
