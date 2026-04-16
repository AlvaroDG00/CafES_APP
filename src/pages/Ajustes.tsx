import { useState } from "react"; // <-- CORRECCIÓN 1: Eliminado useEffect
import { useNavigate } from "react-router-dom";
import {
  User,
  Moon,
  LogOut,
  Key,
  Clock,
  Eye,
  EyeOff,
  ChevronDown,
  Check,
  ShieldCheck
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { cn } from "../lib/utils";
import api from "../api/config";
import { AxiosError } from "axios";

export default function ConfiguracionCliente({
  usuarioInicial,
}: {
  // <-- CORRECCIÓN 2: Tipado seguro en lugar de 'any'
  usuarioInicial?: { turno?: string; nombre?: string }; 
}) {
  const navigate = useNavigate();
  const { isDark, setIsDark } = useTheme();

  // --- ESTADOS DE DATOS REALES ---
  // <-- CORRECCIÓN 3: Quitamos setNombre porque aquí no editamos el nombre, solo lo leemos
  const nombre = localStorage.getItem("usuario_nombre") || "Usuario";
  const [rol, setRol] = useState(localStorage.getItem("usuario_rol") || "Alumno");
  const email = localStorage.getItem("usuario_email") || "";

  const [clave, setClave] = useState("");
  const [mostrarClave, setMostrarClave] = useState(false);
  const [turno, setTurno] = useState(usuarioInicial?.turno || "Mañana");
  const [mostrarMenuTurnos, setMostrarMenuTurnos] = useState(false);

  // Estados para la validación VIP
  const [loadingVip, setLoadingVip] = useState(false);
  const [mensajeVip, setMensajeVip] = useState({ texto: "", error: false });

  const opcionesTurno = ["Mañana", "Tarde", "Noche"];

  // ==========================================
  // 🔐 FUNCIÓN: ACTIVAR MODO DOCENTE
  // ==========================================
  const handleActivarVip = async () => {
    if (clave.length !== 6) {
      setMensajeVip({ texto: "La clave debe tener 6 caracteres", error: true });
      return;
    }

    setLoadingVip(true);
    setMensajeVip({ texto: "", error: false });

    try {
      const response = await api.post("/validar-vip", {
        email: email,
        codigo: clave,
        nuevoRol: "Docente/PAS"
      });

      setRol("Docente/PAS");
      localStorage.setItem("usuario_rol", "Docente/PAS");
      setMensajeVip({ texto: response.data.message || "¡Cuenta actualizada!", error: false });
      setClave("");
      
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      setMensajeVip({
        texto: err.response?.data?.error || "Error al verificar código",
        error: true
      });
    } finally {
      setLoadingVip(false);
    }
  };

  // ==========================================
  // 🚪 FUNCIÓN: CERRAR SESIÓN SEGURO
  // ==========================================
  const handleLogout = () => {
    localStorage.removeItem("usuario_id");
    localStorage.removeItem("usuario_rol");
    localStorage.removeItem("usuario_email");
    localStorage.removeItem("usuario_nombre");
    navigate("/inicio");
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-0 w-full max-w-[600px] mx-auto overflow-hidden overscroll-none p-6 pb-24 transition-colors duration-500",
        isDark ? "bg-[#1A120B]" : "bg-[#F3EFE0]",
      )}
    >
      <header className="flex items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-center text-cafe-text w-full mt-2">
          Mi perfil
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
          <div className={cn(
            "p-3 rounded-full",
            rol === "Docente/PAS" ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"
          )}>
            {rol === "Docente/PAS" ? <ShieldCheck size={32} /> : <User size={32} />}
          </div>
          <div>
            <p className="text-xs opacity-50 font-bold uppercase tracking-wider">
              {rol}
            </p>
            <p
              className={cn(
                "text-lg font-bold capitalize",
                isDark ? "text-[#F5EBDC]" : "text-[#4E342E]",
              )}
            >
              {nombre}
            </p>
          </div>
        </div>

        {/* INFO EDITABLE */}
        <div
          className={cn(
            "rounded-[2.5rem] shadow-sm relative z-20",
            isDark ? "bg-[#2C221C]" : "bg-white",
          )}
        >
          {/* CAJÓN VIP: Solo se muestra si el usuario es Alumno */}
          {rol === "Alumno" && (
            <div className="p-5 flex flex-col gap-2 border-b border-black/5 dark:border-white/5">
              <div className="flex items-center gap-4">
                <Key className="text-amber-500 shrink-0" size={20} />
                <div className="flex-1">
                  <p className="text-[10px] uppercase tracking-wider opacity-50 font-bold">
                    Clave Docente / PAS
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type={mostrarClave ? "text" : "password"}
                      value={clave}
                      placeholder="Introduce tu código"
                      onChange={(e) => setClave(e.target.value)}
                      maxLength={6}
                      className={cn(
                        "bg-transparent font-bold outline-none w-full uppercase",
                        isDark ? "text-[#F5EBDC]" : "text-[#4E342E]",
                      )}
                    />
                    <button
                      onClick={() => setMostrarClave(!mostrarClave)}
                      className="p-1 opacity-50 hover:opacity-100"
                    >
                      {mostrarClave ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    {clave.length > 0 && (
                      <button
                        onClick={handleActivarVip}
                        disabled={loadingVip}
                        className="text-xs font-bold bg-amber-500 text-white px-3 py-1.5 rounded-full shadow-md active:scale-95 transition-all"
                      >
                        {loadingVip ? "..." : "Activar"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
              {mensajeVip.texto && (
                <p className={cn("text-xs font-bold pl-9", mensajeVip.error ? "text-red-500" : "text-green-500")}>
                  {mensajeVip.texto}
                </p>
              )}
            </div>
          )}

          {/* Input Turno: Solo visible para Alumnos */}
          {rol === "Alumno" && (
            <div className="p-5 flex items-center gap-4 relative border-t border-black/5 dark:border-white/5">
              <Clock className="text-green-500 shrink-0" size={20} />
              <div className="flex-1 relative">
                <p className="text-[10px] uppercase tracking-wider opacity-50 font-bold mb-1">
                  Turno asignado
                </p>

                <button
                  onClick={() => setMostrarMenuTurnos(!mostrarMenuTurnos)}
                  className={cn(
                    "flex items-center justify-between w-full font-bold outline-none",
                    isDark ? "text-[#F5EBDC]" : "text-[#4E342E]",
                  )}
                >
                  <span>{turno}</span>
                  <ChevronDown
                    size={18}
                    className={cn(
                      "transition-transform duration-300 opacity-50",
                      mostrarMenuTurnos ? "rotate-180" : "",
                    )}
                  />
                </button>

                {mostrarMenuTurnos && (
                  <div
                    className={cn(
                      "absolute top-full left-0 right-0 mt-2 rounded-2xl shadow-xl border z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200",
                      isDark
                        ? "bg-[#1A120B] border-[#F5EBDC]/10"
                        : "bg-[#FFFFFF] border-[#4E342E]/10",
                    )}
                  >
                    {opcionesTurno.map((opcion) => (
                      <button
                        key={opcion}
                        onClick={() => {
                          setTurno(opcion);
                          setMostrarMenuTurnos(false);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-3 text-sm font-bold flex items-center justify-between transition-colors",
                          isDark
                            ? "hover:bg-[#F5EBDC]/10 text-[#F5EBDC]"
                            : "hover:bg-[#4E342E]/5 text-[#4E342E]",
                          turno === opcion &&
                            (isDark ? "bg-[#F5EBDC]/5" : "bg-[#4E342E]/5"),
                        )}
                      >
                        {opcion}
                        {turno === opcion && (
                          <Check size={16} className="text-green-500" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* SWITCH MODO OSCURO */}
        <button
          type="button"
          onClick={() => setIsDark(!isDark)}
          className={cn(
            "w-full p-6 rounded-[2.5rem] flex items-center justify-between shadow-sm active:scale-[0.98] transition-all relative z-10",
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

        {/* BOTÓN CERRAR SESIÓN */}
        <button
          onClick={handleLogout}
          className={cn(
            "w-full p-6 rounded-[2.5rem] flex items-center gap-4 shadow-sm active:scale-95 transition-all text-left relative z-10",
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