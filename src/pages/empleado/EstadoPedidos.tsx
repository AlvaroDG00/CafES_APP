import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, Flame, ChevronLeft, Settings } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { cn } from "../../lib/utils";
import api from "../../api/config"; // Asegúrate de que esta ruta coincida con tu estructura

type EstadoPedido = "ACEPTADO" | "EN PREPARACIÓN" | "FINALIZADO";

// Ajustamos la interfaz a lo que realmente manda nuestro Backend
interface Pedido {
  id: string;
  idCorto: string; 
  estado: EstadoPedido;
}

export default function EstadoPedidos() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  const location = useLocation();
  const isAdminPath = location.pathname.includes("/admin");

  // 1. CARGAR PEDIDOS DESDE LA BASE DE DATOS
  const cargarPedidos = useCallback(async () => {
    try {
      const res = await api.get('/pedidos/activos');
      setPedidos(res.data);
    } catch (error) {
      console.error("Error al cargar los pedidos de cocina:", error);
    }
  }, []);

  // 2. REFRESCO AUTOMÁTICO (Polling)
  useEffect(() => {
    // Envolvemos la primera llamada en una función asíncrona
    // Así el linter sabe que no estamos bloqueando la pantalla
    const arrancarCarga = async () => {
      await cargarPedidos();
    };
    
    arrancarCarga(); // Llamada inicial segura
    
    const intervalo = setInterval(cargarPedidos, 5000); 
    return () => clearInterval(intervalo); 
  }, [cargarPedidos]);

  // 3. CAMBIAR ESTADO Y AVISAR AL BACKEND
  const cambiarEstado = async (id: string, nuevoEstado: EstadoPedido) => {
    // Actualización visual instantánea (para que parezca que vuela)
    setPedidos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, estado: nuevoEstado } : p)),
    );

    try {
      await api.put(`/pedidos/${id}/estado`, { estado: nuevoEstado });
      // Nota: Si el estado es FINALIZADO, el backend ya no lo devolverá en el 
      // próximo "cargarPedidos", por lo que desaparecerá de la pantalla solo.
    } catch (error) {
      console.error("Error actualizando estado:", error);
      cargarPedidos(); // Si falla, recargamos la verdad de la base de datos
    }
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
    // CONTENEDOR RAÍZ (Fondo de color unificado, sin flex para que no aplaste al hijo)
    <div className={cn("min-h-screen", isDark ? "bg-[#1A120B]" : "bg-[#F3EFE0]")}>
      
      {/* LA JAULA MÓVIL (w-full para que se expanda, max-w-[600px] para que pare) */}
      <div
        className={cn(
          "w-full max-w-[600px] mx-auto p-6 min-h-screen pb-20 transition-colors duration-300 relative shadow-2xl",
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

        {/* LISTA DE PEDIDOS */}
        <div className="grid grid-cols-1 gap-3">
          {pedidos.length === 0 && (
            <div className="text-center mt-10 opacity-50 font-medium">
              No hay pedidos activos en este momento.
            </div>
          )}

          {pedidos.map((pedido, index) => (
            <div
              key={pedido.id}
              className={cn(
                "rounded-2xl p-4 shadow-sm border transition-all animate-in slide-in-from-bottom-2 duration-500",
                cardBg,
                isDark ? "border-[#F5EBDC]/5" : "border-[#4E342E]/5",
              )}
            >
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
                    ID: {pedido.idCorto} {/* Ahora mostramos el ID cortito del backend */}
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

              <div className="flex gap-2">
                <button
                  onClick={() => cambiarEstado(pedido.id, "EN PREPARACIÓN")}
                  disabled={
                    pedido.estado === "EN PREPARACIÓN" ||
                    pedido.estado === "FINALIZADO"
                  }
                  className={cn(
                    "flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95",
                    pedido.estado === "EN PREPARACIÓN"
                      ? "bg-orange-500 text-white shadow-md opacity-100"
                      : pedido.estado === "FINALIZADO"
                        ? "bg-gray-200 dark:bg-white/5 text-gray-400 opacity-50 cursor-not-allowed"
                        : "bg-orange-100 text-orange-600 hover:bg-orange-200 dark:bg-orange-500/10 dark:text-orange-400",
                  )}
                >
                  <Flame size={14} /> Preparar
                </button>

                <button
                  onClick={() => cambiarEstado(pedido.id, "FINALIZADO")}
                  disabled={pedido.estado === "FINALIZADO"}
                  className={cn(
                    "flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95",
                    pedido.estado === "FINALIZADO"
                      ? "bg-green-500 text-white shadow-md"
                      : "bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-500/10 dark:text-green-400",
                  )}
                >
                  <CheckCircle2 size={14} /> Finalizar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}