import { useState, useEffect, useRef } from "react";
import { useProductos } from "../context/ProductosContext";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";
import { Loader2 } from "lucide-react";

export default function Menu() {
  const { listaProductos, cargando } = useProductos();
  const { isDark } = useTheme();

  const [categoriaActiva, setCategoriaActiva] = useState(() => {
    return sessionStorage.getItem("menuCategoriaActiva") || "Bocadillo";
  });

  useEffect(() => {
    sessionStorage.setItem("menuCategoriaActiva", categoriaActiva);
  }, [categoriaActiva]);

  // CORRECCIÓN: Bebida fría en singular para que coincida con Airtable
  const categorias = ["Bocadillo", "Bebida fría", "Bebida caliente", "Bollería", "Pack/Menú"];

  const productosFiltrados = listaProductos.filter(
    (p) => p.categoria === categoriaActiva && p.disponible !== false
  );

  const scrollRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    isDown.current = true;
    if (scrollRef.current) {
      scrollRef.current.classList.add("cursor-grabbing");
      startX.current = e.pageX - scrollRef.current.offsetLeft;
      scrollLeft.current = scrollRef.current.scrollLeft;
    }
  };
  
  const onMouseLeave = () => {
    isDown.current = false;
    if (scrollRef.current) scrollRef.current.classList.remove("cursor-grabbing");
  };
  
  const onMouseUp = () => {
    isDown.current = false;
    if (scrollRef.current) scrollRef.current.classList.remove("cursor-grabbing");
  };
  
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 2; 
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <div className="pb-24 min-h-screen transition-colors duration-300">
      <div
        className={cn(
          "sticky top-0 z-40 pt-8 pb-4 px-6 transition-colors duration-300 border-b",
          isDark ? "bg-[#1A120B] border-white/5" : "bg-[#F3EFE0] border-black/5"
        )}
      >
        <h1 className="text-3xl font-bold text-center text-cafe-text mb-6">Menú cafetería</h1>

        <div
          ref={scrollRef}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6 cursor-grab"
        >
          {categorias.map((cat) => {
            const isActive = categoriaActiva === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategoriaActiva(cat)}
                className={cn(
                  "px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border select-none",
                  isActive
                    ? "bg-cafe-primary text-[var(--btn-text)] border-cafe-primary shadow-md"
                    : "bg-transparent text-cafe-text border-cafe-text/30 hover:border-cafe-text"
                )}
              >
                {cat === "Bebida fría" ? "Bebidas frías" : cat}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col mt-2 px-6 min-h-[300px]">
        {cargando ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-50">
            <Loader2 className="animate-spin text-cafe-primary" size={40} />
            <p className="mt-4 font-bold text-cafe-text">Conectando con cocina...</p>
          </div>
        ) : productosFiltrados.length > 0 ? (
          productosFiltrados.map((prod) => (
            <Link
              key={prod.id}
              to={`/producto/${prod.id}`}
              className="group flex gap-4 items-center py-5 border-b border-cafe-text/10 dark:border-white/10 last:border-none hover:bg-black/5 dark:hover:bg-white/5 transition-colors rounded-xl px-2 -mx-2 animate-in fade-in slide-in-from-bottom-1 duration-300"
            >
              <img
                src={prod.img}
                alt={prod.nombre}
                className="w-24 h-24 object-cover rounded-xl shadow-sm bg-gray-100 shrink-0 pointer-events-none"
              />
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <h3 className="font-bold text-lg text-cafe-text leading-tight group-hover:text-cafe-primary transition-colors">
                    {prod.nombre}
                  </h3>
                  <span className="font-black text-cafe-primary whitespace-nowrap text-lg">
                    {prod.precio.toFixed(2)}€
                  </span>
                </div>
                <p className="text-sm text-cafe-text opacity-70 line-clamp-2 leading-snug">
                  {prod.desc}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-10 opacity-50">
            <p className="font-bold">No hay productos disponibles en esta categoría.</p>
          </div>
        )}
      </div>
    </div>
  );
}