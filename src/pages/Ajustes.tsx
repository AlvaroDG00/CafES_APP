import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, ChevronDown, Eye, EyeOff, Sun, CloudSun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/utils';


export default function Ajustes() {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
 
  // Estados
  const [mostrarClave, setMostrarClave] = useState(false);
  const [turnoAbierto, setTurnoAbierto] = useState(false); // Para abrir/cerrar el menú
  const [turnoSeleccionado, setTurnoSeleccionado] = useState("Mañana");


  const handleLogout = () => {
    navigate('/');
  };


  // Opciones del turno con sus iconos
  const opcionesTurno = [
    { label: "Mañana", icon: <Sun size={18} className="text-orange-500" /> },
    { label: "Tarde", icon: <CloudSun size={18} className="text-yellow-600" /> },
    { label: "Noche", icon: <Moon size={18} className="text-blue-500" /> },
  ];


  // Buscamos el objeto del turno actual para mostrar su icono en el botón principal
  const turnoActual = opcionesTurno.find(t => t.label === turnoSeleccionado);


  const rowClass = "w-full p-5 flex justify-between items-center row-ajustes transition-colors duration-300 first:rounded-t-xl last:border-none relative z-10";


  return (
    <div className="min-h-screen p-6 pb-24 w-full max-w-[600px] mx-auto shadow-2xl shadow-black/5 dark:shadow-black/20 transition-colors duration-300">
     
      {/* Header */}
      <header className="flex items-center mb-8 relative">
        <Link to="/menu" className="absolute left-0 p-2 -ml-2 text-gray-600 dark:text-[#F5EBDC] transition-colors">
          <ChevronLeft size={28} />
        </Link>
        <h1 className="w-full text-center text-3xl font-bold tracking-tight text-cafe-text">
          Configuración
        </h1>
      </header>


      {/* Bloque de Configuración */}
      <div className="rounded-xl shadow-sm isolate"> {/* 'isolate' ayuda con el z-index del menú */}
       
        {/* 1. Modo Oscuro */}
        <div className={rowClass}>
          <span className="font-bold text-base text-cafe-text">Modo Oscuro</span>
         
          <button
            onClick={toggleTheme}
            className={cn(
              "w-14 h-8 rounded-full transition-colors relative focus:outline-none",
              isDark ? "bg-[#6F4E37] dark:bg-[#F5EBDC]" : "bg-gray-300"
            )}
          >
            <span className={cn(
              "absolute top-1 left-1 bg-white dark:bg-[#1E1611] w-6 h-6 rounded-full shadow-md transition-transform duration-300",
              isDark ? "translate-x-6" : "translate-x-0"
            )} />
          </button>
        </div>


        {/* 2. Turno (DESPLEGABLE PERSONALIZADO "CUSTOM") */}
        <div className={rowClass + " z-20"}> {/* Más z-index para que el menú flote sobre lo demás */}
          <span className="font-bold text-base text-cafe-text whitespace-nowrap mr-4">Turno</span>
         
          <div className="relative w-full max-w-[160px]">
           
            {/* BOTÓN DESPLEGABLE (Trigger) */}
            <button
              onClick={() => setTurnoAbierto(!turnoAbierto)}
              className="w-full bg-black/5 dark:bg-white/10 text-cafe-text py-2.5 px-4 rounded-lg flex items-center justify-between font-medium text-base transition-all hover:bg-black/10 dark:hover:bg-white/20"
            >
              {/* Contenido centrado: Icono + Texto */}
              <div className="flex items-center gap-2 mx-auto">
                {turnoActual?.icon}
                <span>{turnoSeleccionado}</span>
              </div>
             
              {/* Flechita que gira */}
              <ChevronDown
                size={16}
                className={cn("text-cafe-text opacity-50 transition-transform duration-300 absolute right-3", turnoAbierto && "rotate-180")}
              />
            </button>


            {/* MENÚ FLOTANTE (Opciones) */}
            {turnoAbierto && (
              <>
                {/* Telón invisible para cerrar al hacer clic fuera */}
                <div className="fixed inset-0 z-10" onClick={() => setTurnoAbierto(false)} />
               
                <div className="absolute top-full mt-2 w-full bg-white dark:bg-[#2C221C] rounded-xl shadow-xl border border-gray-100 dark:border-white/5 overflow-hidden z-20 animate-in fade-in slide-in-from-top-2">
                  {opcionesTurno.map((opcion) => (
                    <button
                      key={opcion.label}
                      onClick={() => {
                        setTurnoSeleccionado(opcion.label);
                        setTurnoAbierto(false);
                      }}
                      className={cn(
                        "w-full px-4 py-3 flex items-center justify-center gap-3 text-sm font-medium transition-colors hover:bg-cafe-primary/10 dark:hover:bg-white/10",
                        turnoSeleccionado === opcion.label
                          ? "text-cafe-primary bg-cafe-primary/5 dark:text-[#F5EBDC]"
                          : "text-gray-600 dark:text-gray-400"
                      )}
                    >
                      {opcion.icon}
                      {opcion.label}
                    </button>
                  ))}
                </div>
              </>
            )}
           
          </div>
        </div>


        {/* 3. Clave Docente */}
        <div className={rowClass + " z-0"}>
           <div className="relative w-full">
             <input
               type={mostrarClave ? "text" : "password"}
               placeholder="Clave docente..."
               className="w-full bg-transparent border-none outline-none text-base placeholder-gray-500 dark:placeholder-[#575552]/50 text-left pr-10"
             />
             <button
               type="button"
               onClick={() => setMostrarClave(!mostrarClave)}
               className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 dark:text-[#575552]/70 p-2 hover:text-cafe-primary transition-colors"
             >
               {mostrarClave ? <EyeOff size={20} /> : <Eye size={20} />}
             </button>
           </div>
        </div>


        {/* 4. Cerrar Sesión */}
        <button
            onClick={handleLogout}
            className="w-full p-5 flex justify-center items-center bg-[#DBCBB6] dark:bg-[#4E342E] border-t border-white/10 text-white dark:text-[#F5EBDC] font-bold text-lg hover:brightness-110 transition-all rounded-b-xl z-0 relative"
        >
          Cerrar sesión
        </button>


      </div>
    </div>
  );
}
