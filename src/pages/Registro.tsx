import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Loader2 } from "lucide-react";
import { UiButton } from "../components/ui/Button";
import { UiInput } from "../components/ui/Input";

export default function Registro() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegistro = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      navigate("/menu");
    }, 1800);
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

      <form
        onSubmit={handleRegistro}
        className="space-y-4 max-w-sm mx-auto flex flex-col h-full"
      >
        <UiInput
          placeholder="Nombre y apellidos"
          required
          disabled={isLoading}
        />
        <UiInput
          type="email"
          placeholder="Correo electrónico"
          required
          disabled={isLoading}
        />
        <UiInput
          type="password"
          placeholder="Contraseña"
          required
          disabled={isLoading}
        />
        <UiInput
          type="password"
          placeholder="Confirmar contraseña"
          required
          disabled={isLoading}
        />

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
          <Link
            to="/inicio"
            className="text-cafe-primary font-bold ml-1 hover:underline"
          >
            Inicia sesión
          </Link>
        </p>
      )}
    </div>
  );
}
