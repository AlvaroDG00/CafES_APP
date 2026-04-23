import {
  ClipboardList,
  Users,
  UtensilsCrossed,
  Settings,
  School,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { cn } from "../../lib/utils";

export default function AdminMenu() {
  const { isDark } = useTheme();

  const opciones = [
    {
      label: "Gestión del menú",
      icon: <UtensilsCrossed size={24} />,
      ruta: "/admin/menu-gestion",
      color: "bg-orange-100 text-orange-600",
    },
    {
      label: "Estado de pedidos",
      icon: <ClipboardList size={24} />,
      ruta: "/admin/estado-pedidos",
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Gestión de personal",
      icon: <Users size={24} />,
      ruta: "/admin/personal",
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Centros",
      icon: <School size={24} />,
      ruta: "/admin/centros",
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "Configuración",
      icon: <Settings size={24} />,
      ruta: "/admin/ajustes",
      color: "bg-gray-100 text-gray-600",
    },
  ];

  return (
    <div
      className={cn(
        "fixed inset-0 z-0 w-full max-w-[600px] mx-auto overflow-hidden overscroll-none flex flex-col p-6 pb-24 transition-colors duration-300",
        isDark ? "bg-[#1A120B]" : "bg-[#F3EFE0]",
      )}
    >
      <h1
        className={cn(
          "shrink-0 text-3xl font-bold text-center mb-10 mt-4",
          isDark ? "text-[#F5EBDC]" : "text-[#4E342E]",
        )}
      >
        Panel de Control - IES José Zerpa
      </h1>

      {/* Contenedor que permite scroll interno SOLO si los botones no caben en un móvil pequeño */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto pb-6">
          {opciones.map((opcion) => (
            <Link
              key={opcion.ruta}
              to={opcion.ruta}
              style={{
                backgroundColor: isDark ? "#2C221C" : "#FFFFFF",
                borderColor: isDark ? "#F5EBDC10" : "#4E342E10",
              }}
              className="flex items-center gap-4 p-5 rounded-[2rem] border shadow-sm active:scale-95 transition-all group"
            >
              <div
                className={cn(
                  "p-3 rounded-2xl transition-transform group-hover:scale-110",
                  opcion.color,
                )}
              >
                {opcion.icon}
              </div>
              <span
                className={cn(
                  "font-bold text-lg",
                  isDark ? "text-[#F5EBDC]" : "text-[#4E342E]",
                )}
              >
                {opcion.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
