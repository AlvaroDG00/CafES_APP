import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, CheckCircle2 } from 'lucide-react';
import { UiInput } from '../../components/ui/Input';
import { useEmpleados } from '../../context/EmpleadosContext';


export default function NuevoEmpleado() {
  const navigate = useNavigate();
  const { anadirEmpleado } = useEmpleados();
  const [mostrandoExito, setMostrandoExito] = useState(false);
 
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    password: ''
  });


  const esValido = formData.nombre.trim() !== '' && formData.correo.includes('@');


  const handleAñadir = () => {
    if (esValido) {
      anadirEmpleado({
        nombre: formData.nombre,
        correo: formData.correo
      });
      setMostrandoExito(true);
    }
  };


  useEffect(() => {
    if (mostrandoExito) {
      const timer = setTimeout(() => {
        setMostrandoExito(false);
        navigate('/admin');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [mostrandoExito, navigate]);


  return (
    // CAMBIO 1: Usamos 'h-full' para que encaje perfecto en la pantalla sin scroll general
    <div className="p-6 h-full flex flex-col bg-cafe-bg transition-colors duration-300">
     
      <header className="flex items-center mb-8 relative shrink-0">
        <Link to="/admin/personal" className="absolute left-0 p-2 -ml-2 text-cafe-text">
          <ChevronLeft size={28} />
        </Link>
        <h1 className="w-full text-center text-2xl font-bold text-cafe-text">Nuevo empleado</h1>
      </header>


      {/* CAMBIO 2: 'overflow-y-auto' aquí para que si hay muchos campos, solo se muevan los inputs */}
      <div className="space-y-6 flex-1 overflow-y-auto no-scrollbar">
        <UiInput
          placeholder="Nombre y apellidos"
          value={formData.nombre}
          onChange={(e) => setFormData({...formData, nombre: e.target.value})}
        />
        <UiInput
          type="email"
          placeholder="Correo"
          value={formData.correo}
          onChange={(e) => setFormData({...formData, correo: e.target.value})}
        />
        <UiInput
          type="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
        />
      </div>


      {/* CAMBIO 3: 'pb-24' para levantar el botón y que no lo tape la barra de abajo */}
      <div className="mt-auto pt-6 pb-24 shrink-0">
        <button
          onClick={handleAñadir}
          disabled={!esValido}
          className={`w-full text-xl font-bold py-5 rounded-2xl shadow-lg transition-all duration-300 bg-[#6F4E37] text-white dark:bg-cafe-primary dark:text-cafe-bg active:scale-[0.98] ${!esValido ? 'cursor-not-allowed' : ''}`}
        >
          Añadir
        </button>
      </div>


      {/* Ventana de Éxito */}
      {mostrandoExito && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-6 pb-24 pointer-events-none">
          <div className="bg-[#6F4E37] dark:bg-cafe-primary text-white dark:text-cafe-bg px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-10 duration-500">
            <CheckCircle2 size={24} className="shrink-0" />
            <span className="font-bold whitespace-nowrap">Empleado añadido correctamente</span>
          </div>
        </div>
      )}
    </div>
  );
}
