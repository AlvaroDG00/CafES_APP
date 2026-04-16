import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Loader2 } from "lucide-react";
import { UiButton } from "../components/ui/Button";
import { UiInput } from "../components/ui/Input";
import api from "../api/config";
import { AxiosError } from "axios"; // <-- AÑADIDO PARA TYPESCRIPT

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (nombre.trim().split(/\s+/).length < 2) {
      setErrorMsg("Debes incluir tu nombre y al menos un apellido");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Las contraseñas no coinciden");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/registro", { nombre, email, password });
      
      localStorage.setItem("usuario_id", response.data.usuario_id);
      localStorage.setItem("usuario_rol", "Alumno");
      localStorage.setItem("usuario_nombre", nombre);
      
      navigate("/menu");
    } catch (error) {
      // <-- CORRECCIÓN TYPESCRIPT: Tipado seguro
      const err = error as AxiosError<{ error?: string, errors?: { msg: string }[] }>;
      
      if (err.response?.data?.errors) {
         setErrorMsg(err.response.data.errors[0].msg);
      } else {
         setErrorMsg(err.response?.data?.error || "Error al registrar la cuenta");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cafe-bg p-6 text-cafe-text font-sans w-full max-w-[600px] mx-auto shadow-2xl transition-colors duration-300">
      <header className="flex items-center mb-8 relative">
        <Link
          to="/inicio"
          className={`absolute left-0 p-2 -ml-2 text-gray-600 transition-opacity ${isLoading ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        >
          <ChevronLeft size={28} />
        </Link>
        <h1 className="w-full text-center text-2xl font-bold">Crear cuenta</h1>
      </header>

      <form onSubmit={handleRegistro} className="space-y-4 max-w-sm mx-auto flex flex-col h-full">
        <UiInput
          placeholder="Nombre y apellidos"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          disabled={isLoading}
        />
        <UiInput
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
        <UiInput
          type="password"
          placeholder="Contraseña (Mín. 6 caracteres)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          disabled={isLoading}
        />
        <UiInput
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={isLoading}
        />

        {errorMsg && (
          <div className="text-red-600 text-sm font-semibold text-center bg-red-100 p-2 rounded-md">
            {errorMsg}
          </div>
        )}

        <div className="pt-6">
          <UiButton type="submit" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 w-full">
                <Loader2 className="animate-spin" size={20} />
                <span>Creando perfil...</span>
              </div>
            ) : (
              "Registrarse"
            )}
          </UiButton>
        </div>
      </form>

      {!isLoading && (
        <p className="mt-6 text-center text-xs text-gray-500">
          ¿Ya tienes cuenta?{" "}
          <Link to="/inicio" className="text-cafe-primary font-bold ml-1 hover:underline">
            Inicia sesión
          </Link>
        </p>
      )}
    </div>
  );
}