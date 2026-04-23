import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, Flame, ChevronLeft } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { cn } from "../../lib/utils";
import api from "../../api/config";

type EstadoPedido = "ACEPTADO" | "EN PREPARACIÓN" | "FINALIZADO";

interface Pedido {
  id: string;
  idCorto: string;
  estado: EstadoPedido;
}

export default function EstadoPedidosAdmin() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const location = useLocation();
  const isAdminPath = location.pathname.includes("/admin");

  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [toast, setToast] = useState<{ idPedido: string; timerId: ReturnType<typeof setTimeout> } | null>(null);

  useEffect(() => {
    api.get('/pedidos/activos')
       .then(res => setPedidos(res.data))
       .catch((error) => console.error("Error cargando pedidos", error)); // <-- CORREGIDO
  }, []);

  const cambiarEstado = async (id: string, nuevoEstado: EstadoPedido) => {
    try {
      await api.put(`/pedidos/${id}/estado`, { estado: nuevoEstado });

      if (nuevoEstado === "FINALIZADO") {
        setPedidos((prev) => prev.map((p) => (p.id === id ? { ...p, estado: "FINALIZADO" } : p)));

        const timer = setTimeout(() => {
          setPedidos((prev) => prev.filter((p) => p.id !== id)); 
          setToast(null); 
        }, 10000);

        setToast({ idPedido: id, timerId: timer });
      } else {
        setPedidos((prev) => prev.map((p) => (p.id === id ? { ...p, estado: nuevoEstado } : p)));
      }
    } catch (error) {
      console.error("Error actualizando pedido", error); // <-- CORREGIDO
    }
  };

  const undoFinalizar = async () => {
    if (toast) {
      clearTimeout(toast.timerId); 
      try {
        await api.put(`/pedidos/${toast.idPedido}/estado`, { estado: "EN PREPARACIÓN" });
        setPedidos((prev) => prev.map((p) => (p.id === toast.idPedido ? { ...p, estado: "EN PREPARACIÓN" } : p)));
        setToast(null);
      } catch (error) {
        console.error("Error al revertir", error); // <-- CORREGIDO
      }
    }
  };

  const getStatusColor = (estado: EstadoPedido) => {
    switch (estado) {
      case "FINALIZADO": return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
      case "EN PREPARACIÓN": return "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800";
      case "ACEPTADO": return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-white/10 dark:text-gray-300 dark:border-white/5";
    }
  };

  return (
    <div className={cn("fixed inset-0 z-0 w-full max-w-[600px] mx-auto overflow-hidden overscroll-none p-6 pb-24 flex flex-col transition-colors duration-300", isDark ? "bg-[#1A120B]" : "bg-[#F3EFE0]")}>
      
      <div className="flex items-center mb-6 mt-4 relative shrink-0">
        {isAdminPath && (
          <button onClick={() => navigate("/admin")} className={cn("p-2 rounded-full shadow-sm transition-all active:scale-90 absolute left-0 z-10", isDark ? "bg-[#2C221C] text-[#F5EBDC]" : "bg-white text-cafe-text")}>
            <ChevronLeft size={24} />
          </button>
        )}
        <h1 className={cn("text-2xl font-bold text-center flex-1", isDark ? "text-[#F5EBDC]" : "text-cafe-text")}>
          Pedidos en curso
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
        <div className="grid grid-cols-1 gap-3">
          {pedidos.map((pedido) => (
            <div key={pedido.id} className={cn("rounded-2xl p-4 shadow-sm border transition-all animate-in slide-in-from-bottom-2 duration-500", isDark ? "bg-[#2C221C] border-[#F5EBDC]/5" : "bg-white border-[#4E342E]/5")}>
              
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className={cn("font-bold text-lg leading-none", isDark ? "text-[#F5EBDC]" : "text-cafe-text")}>
                    Pedido #{pedido.idCorto}
                  </h3>
                  <span className={cn("text-[10px] font-bold opacity-50 block mt-1", isDark ? "text-[#F5EBDC]" : "text-cafe-text")}>
                    Detalles en Ticket de Cocina
                  </span>
                </div>
                <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold border tracking-wide", getStatusColor(pedido.estado))}>
                  {pedido.estado}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => cambiarEstado(pedido.id, "EN PREPARACIÓN")}
                  disabled={pedido.estado === "EN PREPARACIÓN" || pedido.estado === "FINALIZADO"}
                  className={cn("flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95", pedido.estado === "EN PREPARACIÓN" ? "bg-orange-500 text-white shadow-md opacity-100" : pedido.estado === "FINALIZADO" ? "bg-gray-200 dark:bg-white/5 text-gray-400 opacity-50 cursor-not-allowed" : "bg-orange-100 text-orange-600 hover:bg-orange-200 dark:bg-orange-500/10 dark:text-orange-400")}
                >
                  <Flame size={14} /> Preparar
                </button>

                <button
                  onClick={() => cambiarEstado(pedido.id, "FINALIZADO")}
                  disabled={pedido.estado === "FINALIZADO"}
                  className={cn("flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95", pedido.estado === "FINALIZADO" ? "bg-green-500 text-white shadow-md" : "bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-500/10 dark:text-green-400")}
                >
                  <CheckCircle2 size={14} /> Finalizar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div className="bg-[#2C221C] text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-4 border border-white/10">
                <span className="text-sm font-bold">Pedido finalizado</span>
                <div className="w-[1px] h-4 bg-white/20" />
                <button onClick={undoFinalizar} className="text-orange-400 font-bold text-sm hover:text-orange-300 active:scale-95 transition-all">
                    Deshacer
                </button>
            </div>
        </div>
      )}
    </div>
  );
}