import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Añadido useNavigate
import { MoreHorizontal, Plus, ChevronLeft } from 'lucide-react'; // Añadido ChevronLeft
import { useProductos } from '../../context/ProductosContext';
import { cn } from '../../lib/utils';
import { useTheme } from '../../context/ThemeContext';

export default function GestionMenu() {
  const navigate = useNavigate(); // Hook para volver
  const { isDark } = useTheme();
  const { listaProductos, eliminarProducto } = useProductos();
  
  const [categoriaActiva, setCategoriaActiva] = useState("Bocadillo");
  const [menuAbierto, setMenuAbierto] = useState<number | null>(null);
  const [idEliminar, setIdEliminar] = useState<number | null>(null);

  const categorias = [
    'Bocadillo', 'Bebidas frías', 'Bebida caliente', 'Bollería', 'Pack/Menú'
  ];

  const productosFiltrados = listaProductos.filter(p => p.categoria === categoriaActiva);

  return (
    <div className="p-6 h-full relative min-h-screen transition-colors duration-300">
      {/* CABECERA CON FLECHA */}
      <div className="flex items-center mb-8 mt-4 relative">
        <button 
          onClick={() => navigate('/admin')}
          className={cn(
            "p-2 rounded-full shadow-sm transition-all active:scale-95 absolute left-0",
            isDark ? "bg-[#2C221C] text-[#F5EBDC]" : "bg-white text-cafe-text"
          )}
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-3xl font-bold text-center text-cafe-text flex-1">
          Gestión del menú
        </h1>
      </div>

      <div className="flex justify-center mb-8">
        <Link 
            to="/admin/nuevo-producto" 
            className="group relative p-1.5 rounded-full pr-6 pl-2 flex items-center gap-3 transition-transform active:scale-95 shadow-sm hover:brightness-110 bg-[#D7CCC8] dark:bg-[#C4B6AC]"
        >
           <div className="bg-sky-300 dark:bg-[#6AD2FF] text-white rounded-full p-2 shadow-sm">
             <Plus size={20} strokeWidth={3} />
           </div>
           <span className="font-bold text-sm pr-2 text-[#4A3B32] dark:text-[#1E1611]">
             Nuevo producto
           </span>
        </Link>
      </div>

      {/* Categorías */}
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6 mb-2">
        {categorias.map((cat) => {
          const isActive = categoriaActiva === cat;
          return (
            <button
              key={cat}
              onClick={() => setCategoriaActiva(cat)}
              style={{
                backgroundColor: isDark 
                  ? (isActive ? '#F5EBDC' : '#2C221C') 
                  : (isActive ? '#8D6E63' : '#FFFFFF'),
                color: isDark 
                  ? (isActive ? '#1E1611' : '#F5EBDC') 
                  : (isActive ? '#FFFFFF' : '#4E342E'),
                borderColor: isDark ? '#F5EBDC20' : '#4E342E10'
              }}
              className="px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap border shadow-sm"
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Lista Productos */}
      <div className="mt-2 min-h-[300px] space-y-4">
        {productosFiltrados.map((prod) => (
            <div 
              key={prod.id} 
              style={{
                backgroundColor: isDark ? '#2C221C' : '#FFFFFF',
                borderColor: isDark ? '#F5EBDC10' : '#4E342E05'
              }}
              className="flex items-center justify-between p-4 rounded-2xl border shadow-sm transition-all"
            >
              <span 
                style={{ color: isDark ? '#F5EBDC' : '#4E342E' }}
                className="font-bold text-lg truncate pr-4"
              >
                  {prod.nombre}
              </span>
              <button 
                  onClick={() => setMenuAbierto(prod.id)}
                  style={{ color: isDark ? '#F5EBDC60' : '#9CA3AF' }}
                  className="p-2 rounded-full hover:bg-black/10 transition-colors shrink-0"
              >
                  <MoreHorizontal size={24} />
              </button>
            </div>
          ))}
      </div>

      {/* Menú Opciones (Editar/Eliminar) */}
      {menuAbierto !== null && (
        <>
            <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={() => setMenuAbierto(null)} />
            <div className="fixed bottom-24 left-6 right-6 z-50">
                <div 
                  style={{ backgroundColor: isDark ? '#342A22' : '#D7CCC8' }}
                  className="rounded-2xl overflow-hidden shadow-2xl mb-4 border border-white/10"
                >
                    <button 
                      style={{ color: isDark ? '#F5EBDC' : '#FFFFFF' }}
                      className="w-full p-4 text-center font-bold border-b border-white/10 hover:bg-white/5 transition-colors"
                    >
                        Editar producto
                    </button>
                    <button 
                        onClick={() => {
                            setIdEliminar(menuAbierto);
                            setMenuAbierto(null);
                        }}
                        className="w-full p-4 text-center font-bold text-red-400 hover:bg-white/5 transition-colors"
                    >
                        Eliminar
                    </button>
                </div>
                <button 
                  onClick={() => setMenuAbierto(null)} 
                  className="w-full p-4 bg-[#8D6E63] text-white font-bold rounded-2xl shadow-lg"
                >
                    Cancelar
                </button>
            </div>
        </>
      )}

      {/* Popup Confirmación */}
      {idEliminar !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div 
              style={{ backgroundColor: isDark ? '#2C221C' : '#A1887F' }}
              className="w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border border-white/10"
            >
                <div className="p-8 text-center">
                    <h3 className="text-white text-lg font-bold">¿Eliminar este producto?</h3>
                </div>
                <div className="flex border-t border-white/10">
                    <button 
                        onClick={() => {
                            if(eliminarProducto) eliminarProducto(idEliminar);
                            setIdEliminar(null);
                        }}
                        className="flex-1 p-4 text-red-200 font-bold hover:bg-red-500/20 border-r border-white/10"
                    >
                        Eliminar
                    </button>
                    <button onClick={() => setIdEliminar(null)} className="flex-1 p-4 text-white font-bold hover:bg-white/10">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}