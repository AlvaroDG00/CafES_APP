import { useState } from "react";
import { User, Lock, Coffee, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { UiButton } from "../components/ui/Button";
import { UiInput } from "../components/ui/Input";

export default function Login() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const lowerEmail = email.toLowerCase();

      if (lowerEmail.includes("admin")) {
        navigate("/admin");
      } else if (lowerEmail.includes("emp")) {
        navigate("/empleado");
      } else {
        navigate("/menu");
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-cafe-bg flex flex-col items-center justify-center p-6 text-cafe-text w-full max-w-[600px] mx-auto shadow-2xl transition-colors duration-300">
      <div className="flex flex-col items-center mb-10">
        <Coffee
          size={80}
          className="text-cafe-primary mb-4 animate-bounce-slow"
        />
        <h1 className="text-4xl font-black tracking-wider text-cafe-text">
          CaFES
        </h1>
      </div>

      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-5">
        <UiInput
          icon={<User size={20} />}
          type="text"
          placeholder="Correo (admin@... o emp@...)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
        <UiInput
          icon={<Lock size={20} />}
          type="password"
          placeholder="Contraseña"
          required
          disabled={isLoading}
        />

        <div className="pt-2">
          <UiButton type="submit" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 w-full">
                <Loader2 className="animate-spin" size={20} />
                <span>
                  {email?.includes("admin") || email === ""
                    ? "Verificando..."
                    : "Iniciando..."}
                </span>
              </div>
            ) : email?.includes("admin") || email === "" ? (
              "Iniciar sesión"
            ) : (
              "Registrarse"
            )}
          </UiButton>
        </div>
      </form>

      {!isLoading && (
        <p className="mt-8 text-xs text-gray-500 font-medium animate-in fade-in duration-500">
          ¿No tienes cuenta?{" "}
          <Link
            to="/registro"
            className="text-cafe-primary font-bold ml-1 hover:underline"
          >
            Regístrate
          </Link>
        </p>
      )}
    </div>
  );
}
