import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MoreHorizontal, Plus } from 'lucide-react';
import { useProductos } from '../../context/ProductosContext'; // <--- IMPORTAR CONTEXTO
import { cn } from '../../lib/utils';

export default function GestionMenu() {
  // Traemos la lista y la función de eliminar del contexto
  const { listaProductos, eliminarProducto } = useProductos();
  
  const [categoriaActiva, setCategoriaActiva] = useState("Bocadillo");
  const [menuAbierto, setMenuAbierto] = useState<number | null>(null);
  const [idEliminar, setIdEliminar] = useState<number | null>(null);

  const categorias = [
    'Bocadillo', 'Bebidas frías', 'Bebida caliente', 'Bollería', 'Pack/Menú'
  ];

  const productosFiltrados = listaProductos.filter(p => p.categoria === categoriaActiva);

  return (
    <div className="p-6 h-full relative">
      <h1 className="text-3xl font-bold text-center text-cafe-text mb-8 mt-4">
        Gestión del menú
      </h1>

      <div className="flex justify-center mb-8">
        <Link 
            to="/admin/nuevo-producto" 
            className="group relative p-1.5 rounded-full pr-6 pl-2 flex items-center gap-3 transition-transform active:scale-95 shadow-sm hover:brightness-110 bg-[#D7CCC8] dark:bg-[#C4B6AC]"
        >
           <div className="bg-sky-300 dark:bg-[#6AD2FF] text-white rounded-full p-2 shadow-sm">
             <Plus size={20} strokeWidth={3} />
           </div>
           <span className="font-bold text-sm pr-2 text-[#4A3B32] dark:text-white">
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
              className={cn(
                "px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap border",
                isActive
                  ? "bg-[#8D6E63] text-white border-[#8D6E63] dark:bg-[#F5EBDC] dark:text-[#1E1611] dark:border-[#F5EBDC] shadow-md"
                  : "bg-white text-cafe-text border-cafe-text/10 dark:bg-transparent dark:text-[#F5EBDC] dark:border-[#F5EBDC]/30 hover:dark:border-[#F5EBDC]"
              )}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Lista Productos */}
      <div className="mt-2 min-h-[300px]">
        {productosFiltrados.map((prod) => (
            <div 
              key={prod.id} 
              className={cn(
                  "flex items-center justify-between py-5 border-b border-cafe-text/10 dark:border-white/10 last:border-none transition-colors rounded-lg px-2 -mx-2",
                  menuAbierto === prod.id ? "bg-blue-50 dark:bg-white/10" : "hover:bg-black/5 dark:hover:bg-white/5"
              )}
            >
              <span className="font-semibold text-lg text-cafe-text truncate pr-4">
                  {prod.nombre}
              </span>
              <button 
                  onClick={() => setMenuAbierto(prod.id)}
                  className={cn(
                      "p-2 rounded-full transition-colors shrink-0",
                      menuAbierto === prod.id 
                          ? "bg-sky-300 text-white" 
                          : "text-gray-400 dark:text-[#F5EBDC]/50 hover:text-cafe-primary dark:hover:text-[#F5EBDC]"
                  )}
              >
                  <MoreHorizontal size={24} />
              </button>
            </div>
          ))}
      </div>

      {/* Menú Opciones (Editar/Eliminar) */}
      {menuAbierto !== null && (
        <>
            <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm animate-in fade-in" onClick={() => setMenuAbierto(null)} />
            <div className="fixed bottom-24 left-6 right-6 z-50 animate-in slide-in-from-bottom-4">
                <div className="bg-[#D7CCC8] dark:bg-[#C4B6AC] rounded-xl overflow-hidden shadow-2xl mb-4">
                    <button className="w-full p-4 text-center font-bold text-white border-b border-white/20 hover:bg-white/10 transition-colors">
                        Editar producto
                    </button>
                    <button 
                        onClick={() => {
                            setIdEliminar(menuAbierto);
                            setMenuAbierto(null);
                        }}
                        className="w-full p-4 text-center font-bold text-white hover:bg-white/10 transition-colors"
                    >
                        Eliminar
                    </button>
                </div>
                <button onClick={() => setMenuAbierto(null)} className="w-full p-4 bg-[#8D6E63] text-white font-bold rounded-xl shadow-lg">
                    Cancelar
                </button>
            </div>
        </>
      )}

      {/* Popup Confirmación de Eliminación Real */}
      {idEliminar !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-[#A1887F] dark:bg-[#8D6E63] w-full max-w-sm rounded-xl shadow-2xl overflow-hidden">
                <div className="p-8 text-center">
                    <h3 className="text-white text-lg font-bold">¿Está seguro de querer eliminar este producto?</h3>
                </div>
                <div className="flex border-t border-black/10">
                    <button 
                        onClick={() => {
                            if(eliminarProducto) eliminarProducto(idEliminar); // <--- LLAMADA AL CONTEXTO
                            setIdEliminar(null);
                        }}
                        className="flex-1 p-4 text-red-600 dark:text-red-400 font-bold hover:bg-black/5 border-r border-black/10"
                    >
                        Eliminar
                    </button>
                    <button onClick={() => setIdEliminar(null)} className="flex-1 p-4 text-white font-bold hover:bg-black/5">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}