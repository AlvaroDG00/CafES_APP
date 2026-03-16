import { useNavigate } from "react-router-dom";
import { ChevronLeft, User, Moon, LogOut } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { cn } from "../lib/utils";

interface ConfigProps {
  rol: string;
  nombreUsuario: string;
}

export default function ConfiguracionBase({ rol }: ConfigProps) {
  const navigate = useNavigate();
  const { isDark, setIsDark } = useTheme();

  return (
    <div
      className={cn(
        "fixed inset-0 z-0 w-full max-w-[600px] mx-auto overflow-hidden overscroll-none p-6 pb-24 transition-colors duration-500",
        isDark ? "bg-[#1A120B]" : "bg-[#F3EFE0]",
      )}
    >
      <header className="flex items-center gap-4 mb-8">
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
          Configuración
        </h1>
      </header>

      <div className="space-y-4">
        {/* TARJETA IDENTIDAD */}
        <div
          className={cn(
            "p-6 rounded-[2.5rem] flex items-center gap-4 shadow-sm",
            isDark ? "bg-[#2C221C]" : "bg-white",
          )}
        >
          <div className="p-3 rounded-full bg-gray-100 text-gray-500">
            <User size={32} />
          </div>
          <div>
            <p className="text-xs opacity-50 font-medium">
              Sesión iniciada como
            </p>
            <p
              className={cn(
                "text-lg font-bold",
                isDark ? "text-[#F5EBDC]" : "text-[#4E342E]",
              )}
            >
              {rol}:
            </p>
          </div>
        </div>

        {/* SWITCH MODO OSCURO */}
        <button
          type="button"
          onClick={() => setIsDark(!isDark)}
          className={cn(
            "w-full p-6 rounded-[2.5rem] flex items-center justify-between shadow-sm active:scale-[0.98] transition-all",
            isDark ? "bg-[#2C221C]" : "bg-white",
          )}
        >
          <div className="flex items-center gap-4 pointer-events-none">
            <Moon
              className={isDark ? "text-indigo-400" : "text-indigo-600"}
              size={24}
            />
            <span
              className={cn(
                "font-bold",
                isDark ? "text-[#F5EBDC]" : "text-[#4E342E]",
              )}
            >
              Modo Oscuro
            </span>
          </div>
          <div className="relative w-14 h-7 pointer-events-none">
            <div
              className={cn(
                "w-full h-full rounded-full transition-colors duration-300",
                isDark ? "bg-indigo-600" : "bg-gray-300",
              )}
            />
            <div
              className={cn(
                "absolute top-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 shadow-md",
                isDark ? "translate-x-8" : "translate-x-1",
              )}
            />
          </div>
        </button>

        {/* CERRAR SESIÓN */}
        <button
          onClick={() => navigate("/inicio")}
          className={cn(
            "w-full p-6 rounded-[2.5rem] flex items-center gap-4 shadow-sm active:scale-95 transition-all text-left",
            isDark ? "bg-[#2C221C]" : "bg-white",
          )}
        >
          <LogOut className="text-red-500" size={24} />
          <span className="font-bold text-red-500">Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
}
