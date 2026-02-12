import { useState, useEffect } from 'react';
import { useProductos } from '../context/ProductosContext'; // <--- IMPORTAR CONTEXTO
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function Menu() {
  // Obtenemos la lista dinámica del contexto
  const { listaProductos } = useProductos(); 
  
  const [categoriaActiva, setCategoriaActiva] = useState(() => {
    return sessionStorage.getItem("menuCategoriaActiva") || "Bocadillo";
  });

  useEffect(() => {
    sessionStorage.setItem("menuCategoriaActiva", categoriaActiva);
  }, [categoriaActiva]);

  const categorias = [
    'Bocadillo', 
    'Bebidas frías', 
    'Bebida caliente', 
    'Bollería', 
    'Pack/Menú'
  ];

  // Filtramos sobre listaProductos (la que tiene los nuevos productos)
  const productosFiltrados = listaProductos.filter(p => p.categoria === categoriaActiva);

  return (
    <div className="p-6 pb-24 min-h-screen transition-colors duration-300">
      <h1 className="text-3xl font-bold text-center text-cafe-text mb-8 mt-2">
        Menú cafetería
      </h1>

      {/* Categorías */}
      <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-hide -mx-6 px-6">
        {categorias.map((cat) => {
          const isActive = categoriaActiva === cat;
          return (
            <button
              key={cat}
              onClick={() => setCategoriaActiva(cat)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border",
                isActive
                  ? "bg-cafe-primary text-[var(--btn-text)] border-cafe-primary shadow-md" 
                  : "bg-transparent text-cafe-text border-cafe-text/30 hover:border-cafe-text"
              )}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Lista de Productos Dinámica */}
      <div className="flex flex-col mt-2 min-h-[300px]">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((prod) => (
            <Link 
              key={prod.id} 
              to={`/producto/${prod.id}`} 
              className="group flex gap-4 items-center py-5 border-b border-cafe-text/10 dark:border-white/10 last:border-none hover:bg-black/5 dark:hover:bg-white/5 transition-colors rounded-lg px-2 -mx-2 animate-in fade-in slide-in-from-bottom-1 duration-300"
            >
              <img 
                src={prod.img} 
                alt={prod.nombre} 
                className="w-24 h-16 object-cover rounded-lg shadow-sm bg-gray-100" 
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-cafe-text leading-tight group-hover:text-cafe-primary transition-colors">
                  {prod.nombre}
                </h3>
                <p className="text-sm font-medium mt-1 text-gray-500 dark:text-[#F5EBDC]/70">
                  {prod.precio.toFixed(2)}€
                </p>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-10 text-gray-400">
            <p>No hay productos en esta categoría</p>
          </div>
        )}
      </div>
    </div>
  );
}