import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, Flame, ChevronLeft, Settings } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { cn } from "../../lib/utils";

type EstadoPedido = "ACEPTADO" | "EN PREPARACIÓN" | "FINALIZADO";

interface Pedido {
  id: string;
  cliente: string;
  estado: EstadoPedido;
  items: { nombre: string; precio: number; img: string }[];
}

// Todos inicializados en 'ACEPTADO'
const pedidosIniciales: Pedido[] = [
  {
    id: "1234",
    cliente: "Pepito",
    estado: "ACEPTADO",
    items: [{ nombre: "Bocadillo", precio: 1.5, img: "" }],
  },
  {
    id: "5678",
    cliente: "Manolo",
    estado: "ACEPTADO",
    items: [{ nombre: "Bocadillo", precio: 1.7, img: "" }],
  },
  {
    id: "9012",
    cliente: "Ana",
    estado: "ACEPTADO",
    items: [{ nombre: "Café", precio: 1.1, img: "" }],
  },
];

export default function EstadoPedidos() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [pedidos, setPedidos] = useState<Pedido[]>(pedidosIniciales);

  const location = useLocation();
  const isAdminPath = location.pathname.includes("/admin");

  const cambiarEstado = (id: string, nuevoEstado: EstadoPedido) => {
    setPedidos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, estado: nuevoEstado } : p)),
    );
  };

  const getStatusColor = (estado: EstadoPedido) => {
    switch (estado) {
      case "FINALIZADO":
        return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
      case "EN PREPARACIÓN":
        return "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800";
      case "ACEPTADO":
        return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-white/10 dark:text-gray-300 dark:border-white/5";
    }
  };

  const cardBg = isDark ? "bg-[#2C221C]" : "bg-white";
  const textMain = isDark ? "text-[#F5EBDC]" : "text-cafe-text";

  return (
    <div
      className={cn(
        "p-6 min-h-screen pb-20 transition-colors duration-300 relative",
        isDark ? "bg-[#1A120B]" : "bg-[#F3EFE0]",
      )}
    >
      {/* BOTÓN RUEDECITA (Ajustes) */}
      <button
        onClick={() => navigate("/empleado/configuracion")}
        className={cn(
          "absolute top-8 right-6 p-2 rounded-full shadow-sm transition-all active:scale-90 z-20",
          isDark ? "bg-[#2C221C] text-[#F5EBDC]" : "bg-white text-cafe-text",
        )}
      >
        <Settings size={24} />
      </button>

      {/* CABECERA */}
      <div className="flex items-center mb-6 mt-4 relative">
        {isAdminPath && (
          <button
            onClick={() => navigate("/admin")}
            className={cn(
              "p-2 rounded-full shadow-sm transition-all active:scale-90 absolute left-0 z-10",
              isDark
                ? "bg-[#2C221C] text-[#F5EBDC]"
                : "bg-white text-cafe-text",
            )}
          >
            <ChevronLeft size={24} />
          </button>
        )}

        <h1 className={cn("text-2xl font-bold text-center flex-1", textMain)}>
          Pedidos en curso
        </h1>
      </div>

      {/* PEDIDOS COMPACTOS */}
      <div className="grid grid-cols-1 gap-3">
        {pedidos.map((pedido, index) => (
          <div
            key={pedido.id}
            className={cn(
              "rounded-2xl p-4 shadow-sm border transition-all animate-in slide-in-from-bottom-2 duration-500",
              cardBg,
              isDark ? "border-[#F5EBDC]/5" : "border-[#4E342E]/5",
            )}
          >
            {/* FILA SUPERIOR: TÍTULO, ID y ESTADO */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className={cn("font-bold text-lg leading-none", textMain)}>
                  Pedido {index + 1}
                </h3>
                <span
                  className={cn(
                    "text-xs font-mono opacity-50 block mt-1",
                    textMain,
                  )}
                >
                  ID: {pedido.id}
                </span>
              </div>

              <span
                className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold border tracking-wide",
                  getStatusColor(pedido.estado),
                )}
              >
                {pedido.estado}
              </span>
            </div>

            {/* FILA INFERIOR: BOTONES ACCIÓN */}
            <div className="flex gap-2">
              {/* BOTÓN PREPARAR */}
              <button
                onClick={() => cambiarEstado(pedido.id, "EN PREPARACIÓN")}
                // Deshabilitado si ya está preparándose o finalizado
                disabled={
                  pedido.estado === "EN PREPARACIÓN" ||
                  pedido.estado === "FINALIZADO"
                }
                className={cn(
                  "flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95",
                  pedido.estado === "EN PREPARACIÓN"
                    ? "bg-orange-500 text-white shadow-md opacity-100" // Estado activo
                    : pedido.estado === "FINALIZADO"
                      ? "bg-gray-200 dark:bg-white/5 text-gray-400 opacity-50 cursor-not-allowed" // Deshabilitado
                      : "bg-orange-100 text-orange-600 hover:bg-orange-200 dark:bg-orange-500/10 dark:text-orange-400", // Disponible
                )}
              >
                <Flame size={14} /> Preparar
              </button>

              {/* BOTÓN FINALIZAR */}
              <button
                onClick={() => cambiarEstado(pedido.id, "FINALIZADO")}
                // Deshabilitado solo si ya está finalizado (puedes finalizar directamente desde aceptado si quieres)
                disabled={pedido.estado === "FINALIZADO"}
                className={cn(
                  "flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95",
                  pedido.estado === "FINALIZADO"
                    ? "bg-green-500 text-white shadow-md" // Estado activo
                    : "bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-500/10 dark:text-green-400", // Disponible
                )}
              >
                <CheckCircle2 size={14} /> Finalizar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
