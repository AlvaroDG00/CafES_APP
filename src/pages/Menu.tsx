import { useState, useEffect } from "react";
import { useProductos } from "../context/ProductosContext";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";

export default function Menu() {
  const { listaProductos } = useProductos();
  const { isDark } = useTheme();

  const [categoriaActiva, setCategoriaActiva] = useState(() => {
    return sessionStorage.getItem("menuCategoriaActiva") || "Bocadillo";
  });

  useEffect(() => {
    sessionStorage.setItem("menuCategoriaActiva", categoriaActiva);
  }, [categoriaActiva]);

  const categorias = [
    "Bocadillo",
    "Bebidas frías",
    "Bebida caliente",
    "Bollería",
    "Pack/Menú",
  ];

  const productosFiltrados = listaProductos.filter(
    (p) => p.categoria === categoriaActiva,
  );

  return (
    <div className="pb-24 min-h-screen transition-colors duration-300">
      {/* CABECERA FIJA */}
      <div
        className={cn(
          "sticky top-0 z-40 pt-8 pb-4 px-6 transition-colors duration-300 border-b",
          isDark
            ? "bg-[#1A120B] border-white/5"
            : "bg-[#F3EFE0] border-black/5",
        )}
      >
        <h1 className="text-3xl font-bold text-center text-cafe-text mb-6">
          Menú cafetería
        </h1>

        {/* Categorías */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6">
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
                    : "bg-transparent text-cafe-text border-cafe-text/30 hover:border-cafe-text",
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lista de Productos Dinámica */}
      <div className="flex flex-col mt-2 px-6 min-h-[300px]">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((prod) => (
            <Link
              key={prod.id}
              to={`/producto/${prod.id}`}
              className="group flex gap-4 items-center py-5 border-b border-cafe-text/10 dark:border-white/10 last:border-none hover:bg-black/5 dark:hover:bg-white/5 transition-colors rounded-xl px-2 -mx-2 animate-in fade-in slide-in-from-bottom-1 duration-300"
            >
              {/* Imagen */}
              <img
                src={prod.img}
                alt={prod.nombre}
                className="w-24 h-24 object-cover rounded-xl shadow-sm bg-gray-100 shrink-0"
              />

              {/* Contenedor de Textos */}
              <div className="flex-1 flex flex-col justify-center">
                {/* Fila superior: Título a la izq y Precio a la der */}
                <div className="flex justify-between items-start gap-2 mb-1">
                  <h3 className="font-bold text-lg text-cafe-text leading-tight group-hover:text-cafe-primary transition-colors">
                    {prod.nombre}
                  </h3>
                  <span className="font-black text-cafe-primary whitespace-nowrap text-lg">
                    {prod.precio.toFixed(2)}€
                  </span>
                </div>

                {/* Descripción debajo del título */}
                <p className="text-sm text-cafe-text opacity-70 line-clamp-2 leading-snug">
                  {(prod as any).desc}
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
