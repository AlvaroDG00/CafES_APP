import { useState } from "react";
import { User, Lock, Coffee, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { UiButton } from "../components/ui/Button";
import { UiInput } from "../components/ui/Input";
import api from "../api/config"; 
import { AxiosError } from "axios"; // <-- AÑADIDO PARA TYPESCRIPT

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const response = await api.post("/login", { email, password });
      
      const { rol, id, email: correoUser, nombre } = response.data.usuario;
      
      localStorage.setItem("usuario_id", id);
      localStorage.setItem("usuario_rol", rol);
      localStorage.setItem("usuario_email", correoUser);
      localStorage.setItem("usuario_nombre", nombre);

      if (rol === "Admin") {
        navigate("/admin");
      } else if (rol === "Cocina") {
        navigate("/empleado");
      } else {
        navigate("/menu");
      }
    } catch (error) {
      // <-- CORRECCIÓN TYPESCRIPT: Tipamos el error correctamente sin usar 'any'
      const err = error as AxiosError<{ error: string }>;
      setErrorMsg(err.response?.data?.error || "Error al conectar con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cafe-bg flex flex-col items-center justify-center p-6 text-cafe-text w-full max-w-[600px] mx-auto shadow-2xl transition-colors duration-300">
      <div className="flex flex-col items-center mb-10">
        <Coffee size={80} className="text-cafe-primary mb-4 animate-bounce-slow" />
        <h1 className="text-4xl font-black tracking-wider text-cafe-text">CaFES</h1>
      </div>

      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-5">
        <UiInput
          icon={<User size={20} />}
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
        <UiInput
          icon={<Lock size={20} />}
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />

        {errorMsg && (
          <div className="text-red-600 text-sm font-semibold text-center bg-red-100 p-2 rounded-md">
            {errorMsg}
          </div>
        )}

        <div className="pt-2">
          <UiButton type="submit" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 w-full">
                <Loader2 className="animate-spin" size={20} />
                <span>Iniciando sesión...</span>
              </div>
            ) : (
              "Iniciar sesión"
            )}
          </UiButton>
        </div>
      </form>

      {!isLoading && (
        <p className="mt-8 text-xs text-gray-500 font-medium animate-in fade-in duration-500">
          ¿No tienes cuenta?{" "}
          <Link to="/registro" className="text-cafe-primary font-bold ml-1 hover:underline">
            Regístrate
          </Link>
        </p>
      )}
    </div>
  );
}