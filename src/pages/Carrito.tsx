import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { UiButton } from "../components/ui/Button";
import { useCarrito } from "../context/CarritoContext";
// NUEVO: Importamos los productos reales de la Base de Datos
import { useProductos } from "../context/ProductosContext"; 
import { cn } from "../lib/utils";
import { useTheme } from "../context/ThemeContext";

export default function Carrito() {
  const { items, eliminarProducto, limpiarCarrito } = useCarrito();
  const { isDark } = useTheme();
  const { listaProductos } = useProductos(); // Obtenemos el catálogo real

  const total = items.reduce((suma, item) => suma + item.precio, 0);

  return (
    <div
      className={cn(
        "fixed inset-0 z-0 w-full max-w-[600px] mx-auto overflow-hidden overscroll-none pb-24 shadow-2xl transition-colors duration-300 flex flex-col",
        isDark ? "bg-[#1A120B] shadow-black/20" : "bg-[#F3EFE0] shadow-black/5",
      )}
    >
      <div className="p-6 flex-1 flex flex-col overflow-hidden">
        <h1 className="shrink-0 text-3xl font-bold text-center text-cafe-text mb-8 mt-2">
          Carrito
        </h1>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full opacity-50">
              <p className="font-bold text-xl text-cafe-text">El carrito está vacío</p>
            </div>
          ) : (
            items.map((item, index) => {
              // Buscamos la foto y el nombre en la Base de Datos real
              const productoBase = listaProductos.find((p) => p.id.toString() === item.id.toString());
              
              if (!productoBase) return null; // Si por algo no está, no explota

              return (
                <div key={index} className="flex gap-4 mb-4 bg-black/5 dark:bg-white/5 p-4 rounded-2xl animate-in slide-in-from-right-2">
                  <img
                    src={productoBase.img}
                    alt={productoBase.nombre}
                    className="w-20 h-20 object-cover rounded-xl shadow-sm"
                  />
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-cafe-text leading-tight">{productoBase.nombre}</h3>
                      <span className="font-black text-cafe-primary">{item.precio.toFixed(2)}€</span>
                    </div>
                    {item.extras && item.extras.length > 0 && (
                      <p className="text-xs text-cafe-text opacity-70 mt-1 line-clamp-2 leading-snug">
                        {item.extras.join(", ")}
                      </p>
                    )}
                    {item.alergias && item.alergias.length > 0 && (
                      <p className="text-[10px] text-red-500 font-bold mt-1">
                        Alergias: {item.alergias.join(", ")}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => eliminarProducto(index)}
                    className="p-2 self-center text-cafe-text opacity-50 hover:opacity-100 hover:text-red-500 transition-all active:scale-90"
                  >
                    <X size={20} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* PIE FIJO */}
        {items.length > 0 && (
          <div className="shrink-0 mt-4 pt-6 border-t border-cafe-text/10 dark:border-white/10">
            <div className="flex justify-between items-center mb-6 px-2">
              <span className="font-bold text-lg text-cafe-text">Total</span>
              <span className="font-black text-2xl text-cafe-primary">
                {total.toFixed(2)}€
              </span>
            </div>

            <div className="flex gap-4">
              <UiButton
                onClick={limpiarCarrito}
                className="bg-cafe-primary hover:brightness-90 flex-1"
                style={{ backgroundColor: "#6F4E37", color: "white" }}
              >
                Cancelar
              </UiButton>

              <Link to="/pago" className="flex-1 block">
                <UiButton
                  className="w-full hover:brightness-95 shadow-sm"
                  style={{ backgroundColor: "#D7CCC8", color: "#3E2723" }}
                >
                  Pagar
                </UiButton>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}