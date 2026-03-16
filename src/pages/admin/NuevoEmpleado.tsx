import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, CheckCircle2 } from "lucide-react";
import { UiInput } from "../../components/ui/Input";
import { useEmpleados } from "../../context/EmpleadosContext";
import { useTheme } from "../../context/ThemeContext";
import { cn } from "../../lib/utils";

export default function NuevoEmpleado() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { anadirEmpleado } = useEmpleados();
  const [mostrandoExito, setMostrandoExito] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    password: "",
  });

  const esValido =
    formData.nombre.trim() !== "" && formData.correo.includes("@");

  const handleAñadir = () => {
    if (esValido) {
      anadirEmpleado({
        nombre: formData.nombre,
        correo: formData.correo,
      });
      setMostrandoExito(true);
    }
  };

  useEffect(() => {
    if (mostrandoExito) {
      const timer = setTimeout(() => {
        setMostrandoExito(false);
        navigate("/admin/personal");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [mostrandoExito, navigate]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-0 w-full max-w-[600px] mx-auto overflow-hidden overscroll-none flex flex-col p-6 transition-colors duration-300",
        isDark ? "bg-[#1A120B]" : "bg-[#F3EFE0]",
      )}
    >
      {/* HEADER CON BOTÓN CIRCULAR */}
      <header className="flex items-center mb-8 mt-4 relative shrink-0">
        <button
          onClick={() => navigate("/admin/personal")}
          className={cn(
            "p-2 rounded-full shadow-sm transition-all active:scale-95 absolute left-0 z-10",
            isDark ? "bg-[#2C221C] text-[#F5EBDC]" : "bg-white text-[#4E342E]",
          )}
        >
          <ChevronLeft size={24} />
        </button>
        <h1
          className={cn(
            "text-2xl font-bold text-center flex-1",
            isDark ? "text-[#F5EBDC]" : "text-[#4E342E]",
          )}
        >
          Nuevo empleado
        </h1>
      </header>

      {/* FORMULARIO CON CORRECCIÓN DE BORDES */}
      <div className="space-y-6 flex-1 overflow-y-auto no-scrollbar pt-4 px-1">
        <div className="pb-1">
          <UiInput
            type="text"
            placeholder="Nombre y apellidos"
            value={formData.nombre}
            onChange={(e) =>
              setFormData({ ...formData, nombre: e.target.value })
            }
          />
        </div>
        <div className="pb-1">
          <UiInput
            type="email"
            placeholder="Correo"
            value={formData.correo}
            onChange={(e) =>
              setFormData({ ...formData, correo: e.target.value })
            }
          />
        </div>
        <div className="pb-1">
          <UiInput
            type="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>
      </div>

      {/* BOTÓN DE ACCIÓN FIJO ABAJO */}
      <div className="mt-auto pt-6 pb-24 shrink-0">
        <button
          onClick={handleAñadir}
          disabled={!esValido}
          className={cn(
            "w-full text-xl font-bold py-5 rounded-[2rem] shadow-lg transition-all duration-300 active:scale-[0.98]",
            esValido
              ? "bg-[#6F4E37] text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50 dark:bg-[#2C1F14] dark:text-gray-600",
          )}
        >
          Añadir
        </button>
      </div>

      {/* VENTANA DE ÉXITO */}
      {mostrandoExito && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-6 pb-28 pointer-events-none">
          <div
            className={cn(
              "px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-10 duration-500",
              isDark
                ? "bg-[#F5EBDC] text-[#1A120B]"
                : "bg-[#4E342E] text-white",
            )}
          >
            <CheckCircle2 size={24} className="shrink-0 text-green-500" />
            <span className="font-bold whitespace-nowrap">
              Empleado añadido correctamente
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
