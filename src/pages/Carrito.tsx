import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { productos } from "../lib/data";
import { UiButton } from "../components/ui/Button";
import { useCarrito } from "../context/CarritoContext";
import { cn } from "../lib/utils";
import { useTheme } from "../context/ThemeContext";

export default function Carrito() {
  const { items, eliminarProducto, limpiarCarrito } = useCarrito();
  const { isDark } = useTheme();

  const total = items.reduce((suma, item) => suma + item.precio, 0);

  return (
    <div
      className={cn(
        "fixed inset-0 z-0 w-full max-w-[600px] mx-auto overflow-hidden overscroll-none pb-24 shadow-2xl transition-colors duration-300 flex flex-col",
        isDark ? "bg-[#1A120B] shadow-black/20" : "bg-[#F3EFE0] shadow-black/5",
      )}
    >
      <div className="p-6 flex-1 flex flex-col overflow-hidden">
        {/* Título estático */}
        <h1 className="shrink-0 text-3xl font-bold text-center text-cafe-text mb-8 mt-2">
          Carrito
        </h1>

        {/* ÁREA DE SCROLL */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {items.length === 0 ? (
            <div className="text-center text-gray-400 mt-20 flex flex-col items-center gap-4">
              <span className="text-6xl opacity-20">🛒</span>
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            items.map((item, index) => {
              const producto = productos.find((p) => p.id === item.id);
              if (!producto) return null;

              return (
                <div
                  key={index}
                  className="flex gap-4 items-center py-5 border-b border-cafe-text/10 dark:border-white/10 last:border-none relative animate-in fade-in slide-in-from-bottom-2 group"
                >
                  <img
                    src={producto.img}
                    alt={producto.nombre}
                    className="w-24 h-16 object-cover rounded-lg shadow-sm"
                  />

                  <div className="flex-1 pr-10">
                    <h3 className="font-semibold text-lg text-cafe-text leading-tight">
                      {producto.nombre}
                    </h3>

                    {item.extras.length > 0 && (
                      <p className="text-xs text-gray-500 dark:text-[#F5EBDC]/60 mt-1 italic">
                        {item.extras.join(", ")}
                      </p>
                    )}

                    <p className="font-bold text-cafe-primary mt-1">
                      {item.precio.toFixed(2)}€
                    </p>
                  </div>

                  <button
                    onClick={() => eliminarProducto(index)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-red-400 hover:text-red-600 p-2 hover:bg-red-50 dark:hover:bg-white/10 rounded-full transition-colors"
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
              {/* Botón Cancelar */}
              <UiButton
                onClick={limpiarCarrito}
                className="bg-cafe-primary hover:brightness-90 flex-1"
                style={{ backgroundColor: "#6F4E37", color: "white" }}
              >
                Cancelar
              </UiButton>

              {/* Botón Pagar */}
              <Link to="/pago" className="flex-1 block">
                <UiButton
                  className="w-full hover:brightness-95 shadow-sm"
                  style={{
                    backgroundColor: "#D7CCC8",
                    color: "#3E2723",
                  }}
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
