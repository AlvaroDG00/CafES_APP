import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  CheckCircle2,
  Check,
  Plus,
  Minus,
  ChevronDown,
} from "lucide-react";
import { useProductos } from "../../context/ProductosContext";
import { useTheme } from "../../context/ThemeContext";
import { cn } from "../../lib/utils";

export default function NuevoProducto() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { anadirProducto } = useProductos();

  const [formData, setFormData] = useState({
    nombre: "",
    categoria: "Bocadillo",
    alergenos: [] as string[],
    precio: 0.0,
    precioEntero: 0.0,
    precioMedio: 0.0,
    ingredientes: [] as string[],
  });

  const [mostrandoExito, setMostrandoExito] = useState(false);
  const [mostrarMenuCategoria, setMostrarMenuCategoria] = useState(false);

  const listaCategorias = [
    "Bocadillo",
    "Bebidas frías",
    "Bebida caliente",
    "Bollería",
    "Pack/Menú",
  ];
  const listaAlergenos = [
    "Gluten",
    "Crustáceos",
    "Huevo",
    "Pescado",
    "Cacahuetes",
    "Soja",
    "Leche",
    "Frutos con cáscara",
    "Apio",
    "Mostaza",
    "Granos de sésamo",
    "Dióxido de azufre y sulfitos",
    "Altramuces",
    "Moluscos",
  ];
  const listaIngredientes = ["Queso", "Jamón York", "Pavo cocido"];

  const esFormularioValido =
    formData.nombre.trim() !== "" &&
    (formData.categoria === "Bocadillo"
      ? formData.precioEntero > 0 && formData.precioMedio > 0
      : formData.precio > 0);

  const ajustarPrecio = (
    campo: "precio" | "precioEntero" | "precioMedio",
    cantidad: number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [campo]: Math.max(0, parseFloat((prev[campo] + cantidad).toFixed(2))),
    }));
  };

  const toggleSelection = (
    campo: "alergenos" | "ingredientes",
    valor: string,
  ) => {
    setFormData((prev) => {
      const listaActual = prev[campo];
      if (listaActual.includes(valor)) {
        return {
          ...prev,
          [campo]: listaActual.filter((item) => item !== valor),
        };
      } else {
        return { ...prev, [campo]: [...listaActual, valor] };
      }
    });
  };

  const handleAñadir = () => {
    if (esFormularioValido) {
      const datosFinales = {
        ...formData,
        precioEntero:
          formData.categoria === "Bocadillo"
            ? formData.precioEntero
            : undefined,
        precioMedio:
          formData.categoria === "Bocadillo" ? formData.precioMedio : undefined,
        ingredientes:
          formData.categoria === "Bocadillo" ? formData.ingredientes : [],
        img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=150&auto=format&fit=crop",
      };
      anadirProducto(datosFinales);
      setMostrandoExito(true);
    }
  };

  useEffect(() => {
    if (mostrandoExito) {
      const timer = setTimeout(() => {
        setMostrandoExito(false);
        navigate("/admin/menu-gestion");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [mostrandoExito, navigate]);

  // Componente Reutilizable para el Selector de Precio
  const SelectorPrecio = ({
    label,
    valor,
    onChange,
  }: {
    label: string;
    valor: number;
    onChange: (n: number) => void;
  }) => (
    <div className="mb-4">
      <label
        className={cn(
          "block text-sm font-bold mb-2 ml-1",
          isDark ? "text-[#D4B996]" : "text-[#6F4E37]",
        )}
      >
        {label}
      </label>
      <div
        className={cn(
          "flex items-center justify-between p-2 rounded-2xl border transition-colors",
          isDark ? "bg-[#2C1F14] border-[#423224]" : "bg-white border-gray-200",
        )}
      >
        <button
          onClick={() => onChange(-0.5)}
          className={cn(
            "p-4 rounded-xl active:scale-90 transition-transform",
            isDark
              ? "bg-[#1A120B] text-[#F5EBDC]"
              : "bg-gray-100 text-[#4B3F35]",
          )}
        >
          <Minus size={24} />
        </button>
        <span
          className={cn(
            "text-3xl font-black",
            isDark ? "text-[#F5EBDC]" : "text-[#4B3F35]",
          )}
        >
          {valor.toFixed(2)}€
        </span>
        <button
          onClick={() => onChange(0.5)}
          className={cn(
            "p-4 rounded-xl active:scale-90 transition-transform",
            isDark
              ? "bg-[#1A120B] text-[#F5EBDC]"
              : "bg-gray-100 text-[#4B3F35]",
          )}
        >
          <Plus size={24} />
        </button>
      </div>
    </div>
  );

  return (
    <div
      className={cn(
        "fixed inset-0 z-0 w-full max-w-[600px] mx-auto overflow-hidden overscroll-none flex flex-col p-6 transition-colors duration-300",
        isDark ? "bg-[#1A120B]" : "bg-[#F3EFE0]",
      )}
    >
      {/* HEADER UNIFICADO */}
      <header className="flex items-center mb-8 mt-4 relative shrink-0">
        <button
          onClick={() => navigate("/admin/menu-gestion")}
          className={cn(
            "p-2 rounded-full shadow-sm transition-all active:scale-95 absolute left-0 z-10",
            isDark ? "bg-[#2C221C] text-[#F5EBDC]" : "bg-white text-[#4E342E]",
          )}
        >
          <ChevronLeft size={24} />
        </button>
        <h1
          className={cn(
            "text-2xl font-bold text-center flex-1",
            isDark ? "text-[#F5EBDC]" : "text-[#4E342E]",
          )}
        >
          Nuevo producto
        </h1>
      </header>

      {/* CUERPO CON SCROLL */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 pb-4">
        {/* NOMBRE */}
        <div>
          <label
            className={cn(
              "block text-sm font-bold mb-2 ml-1",
              isDark ? "text-[#D4B996]" : "text-[#6F4E37]",
            )}
          >
            Nombre del producto
          </label>
          <input
            value={formData.nombre}
            onChange={(e) =>
              setFormData({ ...formData, nombre: e.target.value })
            }
            placeholder="Ej. Bocadillo de la casa"
            type="text"
            className={cn(
              "w-full border rounded-xl px-4 py-4 outline-none transition-all placeholder:opacity-20",
              isDark
                ? "bg-[#2C1F14] border-[#423224] text-[#F5EBDC]"
                : "bg-white border-gray-200 text-[#4B3F35]",
            )}
          />
        </div>

        {/* CATEGORÍA */}
        <div className="relative z-20">
          <label
            className={cn(
              "block text-sm font-bold mb-2 ml-1",
              isDark ? "text-[#D4B996]" : "text-[#6F4E37]",
            )}
          >
            Categoría
          </label>
          <button
            onClick={() => setMostrarMenuCategoria(!mostrarMenuCategoria)}
            className={cn(
              "w-full flex items-center justify-between border rounded-xl px-4 py-4 outline-none transition-all",
              isDark
                ? "bg-[#2C1F14] border-[#423224] text-[#F5EBDC]"
                : "bg-white border-gray-200 text-[#4B3F35]",
            )}
          >
            <span className="font-medium">{formData.categoria}</span>
            <ChevronDown
              size={20}
              className={cn(
                "transition-transform duration-300",
                mostrarMenuCategoria ? "rotate-180" : "",
              )}
            />
          </button>

          {mostrarMenuCategoria && (
            <div
              className={cn(
                "absolute top-full left-0 right-0 mt-2 rounded-2xl shadow-xl border z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200",
                isDark
                  ? "bg-[#2C1F14] border-[#423224]"
                  : "bg-white border-gray-200",
              )}
            >
              {listaCategorias.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setFormData({ ...formData, categoria: cat });
                    setMostrarMenuCategoria(false);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-3 text-sm font-bold flex items-center justify-between transition-colors",
                    isDark
                      ? "text-[#F5EBDC] hover:bg-[#1A120B]"
                      : "text-[#4B3F35] hover:bg-gray-50",
                    formData.categoria === cat &&
                      (isDark ? "bg-[#1A120B]" : "bg-gray-100"),
                  )}
                >
                  {cat}
                  {formData.categoria === cat && (
                    <Check size={16} className="text-green-500" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* PRECIOS */}
        {formData.categoria === "Bocadillo" ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <SelectorPrecio
              label="Precio Entero (€)"
              valor={formData.precioEntero}
              onChange={(n) => ajustarPrecio("precioEntero", n)}
            />
            <SelectorPrecio
              label="Precio Medio (€)"
              valor={formData.precioMedio}
              onChange={(n) => ajustarPrecio("precioMedio", n)}
            />
          </div>
        ) : (
          <SelectorPrecio
            label="Precio (€)"
            valor={formData.precio}
            onChange={(n) => ajustarPrecio("precio", n)}
          />
        )}

        {/* SECCIÓN ESPECIAL BOCADILLOS: INGREDIENTES */}
        {formData.categoria === "Bocadillo" && (
          <div
            className={cn(
              "p-5 rounded-2xl border space-y-4 animate-in fade-in zoom-in-95 duration-300",
              isDark
                ? "bg-[#6F4E37]/10 border-[#423224]"
                : "bg-[#6F4E37]/5 border-gray-200",
            )}
          >
            <label
              className={cn(
                "block text-sm font-bold",
                isDark ? "text-[#D4B996]" : "text-[#6F4E37]",
              )}
            >
              Ingredientes principales
            </label>
            <div className="flex flex-wrap gap-2">
              {listaIngredientes.map((ing) => {
                const isSelected = formData.ingredientes.includes(ing);
                return (
                  <button
                    key={ing}
                    onClick={() => toggleSelection("ingredientes", ing)}
                    className={cn(
                      "px-4 py-2 rounded-full text-xs font-bold transition-all border flex items-center gap-2 shadow-sm",
                      isSelected
                        ? "bg-[#6F4E37] text-white border-[#6F4E37]"
                        : isDark
                          ? "bg-[#1A120B] border-[#423224] text-[#F5EBDC]"
                          : "bg-white border-gray-200 text-[#4B3F35]",
                    )}
                  >
                    {isSelected && <Check size={14} />} {ing}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ALÉRGENOS */}
        <div>
          <label
            className={cn(
              "block text-sm font-bold mb-3 ml-1",
              isDark ? "text-[#D4B996]" : "text-[#6F4E37]",
            )}
          >
            Alérgenos
          </label>
          <div className="flex flex-wrap gap-2">
            {listaAlergenos.map((alg) => {
              const isSelected = formData.alergenos.includes(alg);
              return (
                <button
                  key={alg}
                  onClick={() => toggleSelection("alergenos", alg)}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-2",
                    isSelected
                      ? "bg-green-500/20 border-green-500 text-green-600 dark:text-green-400"
                      : isDark
                        ? "bg-[#2C1F14] border-[#423224] text-[#F5EBDC]"
                        : "bg-white border-gray-200 text-[#4B3F35]",
                  )}
                >
                  {isSelected && <CheckCircle2 size={14} />} {alg}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* BOTÓN FIJO ABAJO */}
      <div className="mt-auto pt-4 pb-24 shrink-0">
        <button
          onClick={handleAñadir}
          disabled={!esFormularioValido}
          className={cn(
            "w-full text-xl font-bold py-5 rounded-2xl transition-all duration-300 active:scale-95",
            esFormularioValido
              ? "bg-[#6F4E37] text-white shadow-lg"
              : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50 dark:bg-[#2C1F14] dark:text-gray-600",
          )}
        >
          Añadir
        </button>
      </div>

      {/* ÉXITO */}
      {mostrandoExito && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-6 pb-28 pointer-events-none">
          <div
            className={cn(
              "px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-10 duration-500",
              isDark
                ? "bg-[#F5EBDC] text-[#1A120B]"
                : "bg-[#4E342E] text-white",
            )}
          >
            <CheckCircle2 size={24} className="text-green-500" />
            <span className="font-bold">Producto añadido correctamente</span>
          </div>
        </div>
      )}
    </div>
  );
}
