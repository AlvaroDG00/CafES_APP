import { User, Lock, Coffee } from 'lucide-react';
import { Link } from 'react-router-dom';
import { UiButton } from '../components/ui/Button';
import { UiInput } from '../components/ui/Input';


export default function Login() {
  return (
    <div className="min-h-screen bg-cafe-bg flex flex-col items-center justify-center p-6 text-cafe-text w-full max-w-[600px] mx-auto shadow-2xl shadow-black/5 dark:shadow-black/20 transition-colors duration-300">
     
      {/* Logo */}
      <div className="flex flex-col items-center mb-10">
        {/* Icono: Usa 'text-cafe-primary' para cambiar de marrón a crema */}
        <Coffee size={80} className="text-cafe-primary mb-4 transition-colors" />
       
        {/* Título: Usa 'text-cafe-text' para cambiar de marrón oscuro a crema */}
        <h1 className="text-4xl font-black tracking-wider text-cafe-text transition-colors">
          CaFES
        </h1>
      </div>


      <form className="w-full max-w-sm space-y-5">
        <UiInput icon={<User size={20} />} placeholder="Nombre completo/Correo" />
        <UiInput icon={<Lock size={20} />} type="password" placeholder="Contraseña" />
       
        {/* Enlace de "Olvidé mi contraseña" (opcional, añadido para parecerse más a un login real) */}
        <div className="text-right">
            <a href="#" className="text-xs font-medium text-gray-500 dark:text-[#575552]/70 hover:text-cafe-primary transition-colors">
                ¿Olvidaste tu contraseña?
            </a>
        </div>


        <div className="pt-2">
          <UiButton>Iniciar sesión</UiButton>
        </div>
      </form>


      <p className="mt-8 text-xs text-gray-500 dark:text-[#575552]/70 font-medium transition-colors">
        ¿No tienes cuenta? <Link to="/registro" className="text-cafe-primary font-bold ml-1 hover:underline">Regístrate</Link>
      </p>
    </div>
  );
}
