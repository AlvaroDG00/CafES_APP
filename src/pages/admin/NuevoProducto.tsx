import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, CheckCircle2, Check, Plus, Minus } from 'lucide-react';
import { useProductos } from '../../context/ProductosContext';
import { useTheme } from '../../context/ThemeContext';


export default function NuevoProducto() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { anadirProducto } = useProductos();
 
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: 'Bocadillo',
    alergenos: [] as string[],
    precio: 0.00,
    tamano: 'Entero',
    ingredientes: [] as string[]
  });


  const [mostrandoExito, setMostrandoExito] = useState(false);


  const listaCategorias = ['Bocadillo', 'Bebidas frías', 'Bebida caliente', 'Bollería', 'Pack/Menú'];
  const listaAlergenos = ['Gluten', 'Crustáceos', 'Huevo', 'Pescado', 'Cacahuetes', 'Soja', 'Leche', 'Frutos con cáscara', 'Apio', 'Mostaza', 'Granos de sésamo', 'Dióxido de azufre y sulfitos', 'Altramuces', 'Moluscos'];
  const listaIngredientes = ['Chorizo', 'Salchichón', 'Queso', 'Jamón York', 'Pechuga de pavo'];
  const listaTamanos = ['Entero', 'Medio'];


  const esFormularioValido = formData.nombre.trim() !== '' && formData.precio > 0;


  const ajustarPrecio = (cantidad: number) => {
    setFormData(prev => ({
      ...prev,
      precio: Math.max(0, parseFloat((prev.precio + cantidad).toFixed(2)))
    }));
  };


  const toggleSelection = (campo: 'alergenos' | 'ingredientes', valor: string) => {
    setFormData(prev => {
      const listaActual = prev[campo];
      if (listaActual.includes(valor)) {
        return { ...prev, [campo]: listaActual.filter(item => item !== valor) };
      } else {
        return { ...prev, [campo]: [...listaActual, valor] };
      }
    });
  };


  const handleAñadir = () => {
    if (esFormularioValido) {
      anadirProducto({
        ...formData,
        ingredientes: formData.categoria === 'Bocadillo' ? formData.ingredientes : [],
        tamano: formData.categoria === 'Bocadillo' ? formData.tamano : undefined,
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


  const colores = {
    fondo: isDark ? '#1A120B' : '#FDF8F3',
    input: isDark ? '#2C1F14' : '#FFFFFF',
    borde: isDark ? '#423224' : '#E5E7EB',
    texto: isDark ? '#F5EBDC' : '#4B3F35',
    label: isDark ? '#D4B996' : '#6F4E37'
  };


  return (
    <div className="min-h-screen p-6 pb-32 flex flex-col transition-all duration-300" style={{ backgroundColor: colores.fondo }}>
     
      <header className="flex items-center mb-8 relative">
        <Link to="/admin/menu-gestion" className="absolute left-0 p-2 -ml-2" style={{ color: colores.texto }}>
          <ChevronLeft size={28} />
        </Link>
        <h1 className="w-full text-center text-2xl font-bold" style={{ color: colores.texto }}>Nuevo producto</h1>
      </header>


      <div className="space-y-6 flex-1">
       
        {/* NOMBRE */}
        <div>
          <label className="block text-sm font-bold mb-2 ml-1" style={{ color: colores.label }}>Nombre del producto</label>
          <input
            value={formData.nombre}
            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
            placeholder="Ej. Bocadillo de la casa"
            style={{ backgroundColor: colores.input, borderColor: colores.borde, color: colores.texto }}
            className="w-full border rounded-xl px-4 py-4 outline-none transition-all placeholder:opacity-20"
          />
        </div>


        {/* PRECIO TÁCTIL */}
        <div>
          <label className="block text-sm font-bold mb-2 ml-1" style={{ color: colores.label }}>Precio (€)</label>
          <div className="flex items-center justify-between p-2 rounded-2xl border" style={{ backgroundColor: colores.input, borderColor: colores.borde }}>
            <button
              onClick={() => ajustarPrecio(-0.50)}
              className="p-4 rounded-xl active:scale-90 transition-transform"
              style={{ backgroundColor: isDark ? '#1A120B' : '#F3F4F6', color: colores.texto }}
            >
              <Minus size={24} />
            </button>
           
            <span className="text-3xl font-black" style={{ color: colores.texto }}>
              {formData.precio.toFixed(2)}€
            </span>


            <button
              onClick={() => ajustarPrecio(0.50)}
              className="p-4 rounded-xl active:scale-90 transition-transform"
              style={{ backgroundColor: isDark ? '#1A120B' : '#F3F4F6', color: colores.texto }}
            >
              <Plus size={24} />
            </button>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            <button onClick={() => ajustarPrecio(-0.10)} className="text-xs font-bold px-3 py-1 rounded-full border shadow-sm" style={{ color: colores.label, borderColor: colores.borde, backgroundColor: colores.input }}>-0.10</button>
            <button onClick={() => ajustarPrecio(0.10)} className="text-xs font-bold px-3 py-1 rounded-full border shadow-sm" style={{ color: colores.label, borderColor: colores.borde, backgroundColor: colores.input }}>+0.10</button>
          </div>
        </div>


        {/* CATEGORÍA */}
        <div>
          <label className="block text-sm font-bold mb-2 ml-1" style={{ color: colores.label }}>Categoría</label>
          <div className="relative">
            <select
              value={formData.categoria}
              onChange={(e) => setFormData({...formData, categoria: e.target.value})}
              style={{ backgroundColor: colores.input, borderColor: colores.borde, color: colores.texto }}
              className="w-full border rounded-xl px-4 py-4 outline-none appearance-none"
            >
              {listaCategorias.map(cat => (
                <option key={cat} value={cat} style={{ backgroundColor: colores.input, color: colores.texto }}>{cat}</option>
              ))}
            </select>
            <ChevronLeft size={20} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none -rotate-90" style={{ color: colores.label }} />
          </div>
        </div>


        {/* SECCIÓN ESPECIAL BOCADILLOS */}
        {formData.categoria === 'Bocadillo' && (
          <div className="p-5 rounded-2xl border space-y-6 animate-in fade-in zoom-in-95 duration-300"
               style={{ backgroundColor: isDark ? 'rgba(111, 78, 55, 0.1)' : 'rgba(111, 78, 55, 0.05)', borderColor: colores.borde }}>
           
            {/* TAMAÑO */}
            <div>
               <label className="block text-sm font-bold mb-3" style={{ color: colores.label }}>Tamaño</label>
               <div className="flex gap-3">
                  {listaTamanos.map(tam => (
                    <button
                      key={tam}
                      onClick={() => setFormData(prev => ({ ...prev, tamano: tam }))}
                      style={{
                        backgroundColor: formData.tamano === tam ? '#6F4E37' : colores.fondo,
                        borderColor: formData.tamano === tam ? '#6F4E37' : colores.borde,
                        color: formData.tamano === tam ? '#FFFFFF' : colores.texto
                      }}
                      className="flex-1 py-3 rounded-xl text-sm font-bold transition-all border shadow-sm"
                    >
                      {tam}
                    </button>
                  ))}
               </div>
            </div>


            {/* INGREDIENTES */}
            <div>
               <label className="block text-sm font-bold mb-3" style={{ color: colores.label }}>Ingredientes principales</label>
               <div className="flex flex-wrap gap-2">
                  {listaIngredientes.map(ing => {
                    const isSelected = formData.ingredientes.includes(ing);
                    return (
                      <button
                        key={ing}
                        onClick={() => toggleSelection('ingredientes', ing)}
                        style={{
                          backgroundColor: isSelected ? '#6F4E37' : colores.fondo,
                          borderColor: isSelected ? '#6F4E37' : colores.borde,
                          color: isSelected ? '#FFFFFF' : colores.texto
                        }}
                        className="px-4 py-2 rounded-full text-xs font-bold transition-all border flex items-center gap-2 shadow-sm"
                      >
                        {isSelected && <Check size={14} />} {ing}
                      </button>
                    );
                  })}
               </div>
            </div>
          </div>
        )}


        {/* ALÉRGENOS */}
        <div>
           <label className="block text-sm font-bold mb-2 ml-1" style={{ color: colores.label }}>Alérgenos</label>
           <div className="flex flex-wrap gap-2">
              {listaAlergenos.map(alg => {
                const isSelected = formData.alergenos.includes(alg);
                return (
                  <button
                    key={alg}
                    onClick={() => toggleSelection('alergenos', alg)}
                    style={{
                      backgroundColor: isSelected ? 'rgba(34, 197, 94, 0.2)' : colores.input,
                      borderColor: isSelected ? '#22C55E' : colores.borde,
                      color: isSelected ? (isDark ? '#4ADE80' : '#166534') : colores.texto
                    }}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-2"
                  >
                    {isSelected && <CheckCircle2 size={14} />} {alg}
                  </button>
                );
              })}
           </div>
        </div>
      </div>


      {/* BOTÓN AÑADIR */}
      <div className="mt-10 mb-6 shrink-0">
        <button
          onClick={handleAñadir}
          disabled={!esFormularioValido}
          style={{
            backgroundColor: esFormularioValido ? '#6F4E37' : (isDark ? '#2C1F14' : '#D1D5DB'),
            color: esFormularioValido ? '#FFFFFF' : (isDark ? 'rgba(245, 235, 220, 0.1)' : '#9CA3AF'),
            boxShadow: esFormularioValido ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none'
          }}
          className="w-full text-xl font-bold py-5 rounded-2xl transition-all duration-300 active:scale-95"
        >
          Añadir
        </button>
      </div>
    </div>
  );
}
