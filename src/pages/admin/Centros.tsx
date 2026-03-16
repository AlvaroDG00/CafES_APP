import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  School,
  MapPin,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { cn } from "../../lib/utils";

interface Centro {
  id: number;
  nombre: string;
  ubicacion: string;
}

export default function Centros() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [menuAbierto, setMenuAbierto] = useState<number | null>(null);

  const listaCentros: Centro[] = [
    { id: 1, nombre: "IES José Zerpa", ubicacion: "Vecindario, Gran Canaria" },
    { id: 2, nombre: "IES Ana Luisa", ubicacion: "Las Palmas, Gran Canaria" },
    { id: 3, nombre: "Centro por determinar", ubicacion: "Desconocido" },
  ];

  return (
    <div
      className={cn(
        "fixed inset-0 z-0 w-full max-w-[600px] mx-auto overflow-hidden overscroll-none flex flex-col p-6 transition-colors duration-300",
        isDark ? "bg-[#1A120B]" : "bg-[#F3EFE0]", // Fondos exactos según tus capturas
      )}
    >
      {/* HEADER EXACTO */}
      <header className="flex items-center gap-4 mb-8 shrink-0">
        <button
          onClick={() => navigate(-1)}
          className={cn(
            "p-2 rounded-full shadow-sm active:scale-95 transition-all",
            isDark ? "bg-[#2C221C] text-[#F5EBDC]" : "bg-white text-[#4E342E]",
          )}
        >
          <ChevronLeft size={24} />
        </button>
        <h1
          className={cn(
            "text-2xl font-bold",
            isDark ? "text-[#F5EBDC]" : "text-[#4E342E]",
          )}
        >
          Centros
        </h1>
      </header>

      {/* LISTA DE CENTROS CON SCROLL INTERNO */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        <div className="space-y-4">
          {listaCentros.map((centro) => (
            <div key={centro.id} className="relative">
              <div
                className={cn(
                  "p-5 rounded-[1.5rem] flex items-center justify-between shadow-sm transition-all",
                  isDark ? "bg-[#2C221C]" : "bg-[#FFFFFF]", // Tarjetas blancas siempre
                )}
              >
                <div className="flex items-center gap-4">
                  {/* Icono de Centro Estilo Avatar */}
                  <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                    <School size={24} />
                  </div>
                  <div>
                    <p
                      className={cn(
                        "font-bold text-lg",
                        isDark ? "text-[#F5EBDC]" : "text-[#4E342E]",
                      )}
                    >
                      {centro.nombre}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <MapPin size={12} />
                      <span>{centro.ubicacion}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() =>
                    setMenuAbierto(menuAbierto === centro.id ? null : centro.id)
                  }
                  className="text-gray-300 hover:text-gray-500 transition-colors"
                >
                  <MoreHorizontal size={24} />
                </button>
              </div>

              {/* MENÚ DE OPCIONES FLOTANTE */}
              {menuAbierto === centro.id && (
                <div
                  className={cn(
                    "absolute right-0 top-14 z-20 w-48 rounded-2xl p-2 shadow-xl animate-in fade-in zoom-in duration-200",
                    isDark
                      ? "bg-[#1A120B] border border-[#F5EBDC]/10"
                      : "bg-[#FFFFFF] border border-[#4E342E]/10",
                  )}
                >
                  <button className="flex items-center gap-2 w-full p-3 text-red-500 font-bold hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors">
                    <Trash2 size={18} />
                    Eliminar centro
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
