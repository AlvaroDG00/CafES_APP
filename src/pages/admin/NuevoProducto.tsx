import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, CheckCircle2 } from 'lucide-react';
import { useProductos } from '../../context/ProductosContext';

export default function NuevoProducto() {
  const navigate = useNavigate();
  const { anadirProducto } = useProductos();
  
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: 'Bocadillo', // Valor inicial por defecto
    alergenos: 'Ninguno',   // Valor inicial por defecto
    precio: ''
  });

  const [mostrandoExito, setMostrandoExito] = useState(false);

  // Opciones para los selects
  const listaCategorias = ['Bocadillo', 'Bebidas frías', 'Bebida caliente', 'Bollería', 'Pack/Menú'];
  const listaAlergenos = ['Ninguno', 'Gluten', 'Lácteos', 'Frutos de cáscara', 'Huevo', 'Soja'];

  const esFormularioValido = formData.nombre.trim() !== '' && formData.precio.trim() !== '';

  const handleAñadir = () => {
    if (esFormularioValido) {
      anadirProducto({
        nombre: formData.nombre,
        categoria: formData.categoria,
        // Si necesitas guardar los alérgenos, asegúrate de que tu interfaz 
        // en ProductosContext.tsx también tenga ese campo.
        precio: parseFloat(formData.precio.replace(',', '.')),
        img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=150&auto=format&fit=crop'
      });

      setMostrandoExito(true);
    }
  };

  useEffect(() => {
    if (mostrandoExito) {
      const timer = setTimeout(() => {
        setMostrandoExito(false);
        navigate('/admin/menu-gestion');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [mostrandoExito, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-cafe-bg p-6 flex flex-col transition-colors duration-300">
      <header className="flex items-center mb-8 relative">
        <Link to="/admin/menu-gestion" className="absolute left-0 p-2 -ml-2 text-cafe-text">
          <ChevronLeft size={28} />
        </Link>
        <h1 className="w-full text-center text-2xl font-bold text-cafe-text">Nuevo producto</h1>
      </header>

      <div className="space-y-5 flex-1">
        {/* Nombre */}
        <input 
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Nombre del producto"
          className="input-cafe px-4" 
        />

        {/* Selector de Categoría */}
        <div className="relative">
          <select 
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            className="input-cafe px-4 appearance-none"
          >
            {listaCategorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <ChevronLeft size={20} className="-rotate-90" />
          </div>
        </div>

        {/* Selector de Alérgenos */}
        <div className="relative">
          <select 
            name="alergenos"
            value={formData.alergenos}
            onChange={handleChange}
            className="input-cafe px-4 appearance-none"
          >
            {listaAlergenos.map(alg => (
              <option key={alg} value={alg}>{alg}</option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <ChevronLeft size={20} className="-rotate-90" />
          </div>
        </div>

        {/* Precio */}
        <input 
          name="precio"
          value={formData.precio}
          onChange={handleChange}
          type="number" 
          step="0.01"
          placeholder="Precio"
          className="input-cafe px-4" 
        />
      </div>

      {/* Botón Añadir */}
      <div className="mt-10 mb-6">
        <button 
          onClick={handleAñadir}
          disabled={!esFormularioValido}
          className={`w-full text-xl font-bold py-5 rounded-2xl shadow-lg transition-all duration-300
            ${esFormularioValido 
              ? 'bg-cafe-primary text-white dark:text-cafe-bg active:scale-[0.98]' 
              : 'bg-gray-300 dark:bg-[#342A22] text-gray-500 dark:text-gray-600 cursor-not-allowed opacity-50'
            }`}
        >
          Añadir
        </button>
      </div>

      {/* Ventana de Éxito */}
      {mostrandoExito && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-6 pb-24 pointer-events-none">
          <div className="bg-[#6F4E37] dark:bg-cafe-primary text-white dark:text-cafe-bg px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-10 duration-500">
            <CheckCircle2 size={24} className="shrink-0" />
            <span className="font-bold whitespace-nowrap">Producto añadido correctamente</span>
          </div>
        </div>
      )}
    </div>
  );
}