import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ChevronLeft,
  Check,
  Plus,
  Minus,
  ShoppingBag,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import { useProductos } from "../../context/ProductosContext";
import { useTheme } from "../../context/ThemeContext";
import { cn } from "../../lib/utils";

export default function EditarProducto() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  const { actualizarProducto } = useProductos();

  const productoAEditar = location.state?.producto;

  // Estado inicial con protección de datos
  const [formData, setFormData] = useState(() => {
    if (!productoAEditar) return null;
    return {
      ...productoAEditar,
      precioEntero: productoAEditar.precioEntero || 0,
      precioMedio: productoAEditar.precioMedio || 0,
      alergenos: productoAEditar.alergenos || [],
      ingredientes: productoAEditar.ingredientes || [],
    };
  });

  const [mostrarModal, setMostrarModal] = useState(false);
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
  const listaIngredientes = [
    "Chorizo",
    "Salchichón",
    "Queso",
    "Jamón York",
    "Pechuga de pavo",
  ];

  // Redirección si no hay producto
  useEffect(() => {
    if (!productoAEditar) {
      navigate("/admin/menu-gestion");
    }
  }, [productoAEditar, navigate]);

  if (!formData) return null;

  const esFormularioValido =
    formData.nombre.trim() !== "" &&
    (formData.categoria === "Bocadillo"
      ? formData.precioEntero > 0 && formData.precioMedio > 0
      : formData.precio > 0);

  const ajustarPrecio = (
    campo: "precio" | "precioEntero" | "precioMedio",
    cantidad: number,
  ) => {
    setFormData((prev: any) => ({
      ...prev,
      [campo]: Math.max(
        0,
        parseFloat(((prev[campo] || 0) + cantidad).toFixed(2)),
      ),
    }));
  };

  const toggleSelection = (
    campo: "alergenos" | "ingredientes",
    valor: string,
  ) => {
    setFormData((prev: any) => {
      const listaActual = prev[campo] || [];
      if (listaActual.includes(valor)) {
        return {
          ...prev,
          [campo]: listaActual.filter((item: string) => item !== valor),
        };
      } else {
        return { ...prev, [campo]: [...listaActual, valor] };
      }
    });
  };

  const handleGuardar = () => {
    if (esFormularioValido) {
      actualizarProducto(formData.id, {
        ...formData,
        precio:
          formData.categoria === "Bocadillo"
            ? formData.precioEntero
            : formData.precio,
        precioEntero:
          formData.categoria === "Bocadillo"
            ? formData.precioEntero
            : undefined,
        precioMedio:
          formData.categoria === "Bocadillo" ? formData.precioMedio : undefined,
        ingredientes:
          formData.categoria === "Bocadillo" ? formData.ingredientes : [],
      });
      setMostrarModal(true);
    }
  };

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
          Editar producto
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
            type="text"
            className={cn(
              "w-full border rounded-xl px-4 py-4 outline-none transition-all",
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

        {/* PRECIOS DINÁMICOS */}
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

        {/* BOCADILLO EXTRA: INGREDIENTES */}
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
                const isSelected = formData.ingredientes?.includes(ing);
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
              const isSelected = formData.alergenos?.includes(alg);
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

      {/* BOTÓN GUARDAR FIJO */}
      <div className="mt-auto pt-4 pb-24 shrink-0">
        <button
          onClick={handleGuardar}
          disabled={!esFormularioValido}
          className={cn(
            "w-full text-xl font-bold py-5 rounded-2xl transition-all duration-300 active:scale-95 shadow-lg",
            esFormularioValido
              ? "bg-[#6F4E37] text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50 dark:bg-[#2C1F14] dark:text-gray-600",
          )}
        >
          Guardar cambios
        </button>
      </div>

      {/* MODAL DE ÉXITO CIRCULAR */}
      {mostrarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm">
          <div
            className={cn(
              "rounded-[2.5rem] p-8 w-full max-w-xs flex flex-col items-center text-center shadow-2xl animate-in zoom-in-90 duration-300",
              isDark ? "bg-[#2C1F14]" : "bg-white",
            )}
          >
            <div className="w-20 h-20 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mb-6">
              <Check className="text-green-500" size={40} strokeWidth={3} />
            </div>
            <h2
              className={cn(
                "text-3xl font-bold mb-2",
                isDark ? "text-[#F5EBDC]" : "text-[#4E342E]",
              )}
            >
              ¡Actualizado!
            </h2>
            <p className="text-gray-500 dark:text-[#F5EBDC]/60 mb-8 leading-tight">
              Los cambios se han guardado correctamente.
            </p>
            <button
              onClick={() => navigate("/admin/menu-gestion")}
              className="w-full bg-[#8D6E63] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <ShoppingBag size={20} />
              Continuar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
