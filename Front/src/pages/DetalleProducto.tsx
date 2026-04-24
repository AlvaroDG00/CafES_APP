import { useState, type ReactNode } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronLeft,
  CheckCircle,
  ShoppingBag,
  Plus,
  Minus,
  Wheat,
  Shell,
  Egg,
  Fish,
  Bean,
  Milk,
  Nut,
  Leaf,
  Beaker,
  CircleDashed,
  Wine,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";
import { UiButton } from "../components/ui/Button";
import { useCarrito } from "../context/CarritoContext";
import { useTheme } from "../context/ThemeContext";
import { useProductos } from "../context/ProductosContext"; 
import { cn } from "../lib/utils";

// CORRECCIÓN: Volvemos a los iconos limpios y coloreados de lucide-react
const ALERGENOS_CONFIG: Record<string, ReactNode> = {
  "Gluten": <Wheat size={16} color="#8B9A47" />,
  "Crustáceos": <Shell size={16} color="#2A938C" />,
  "Huevo": <Egg size={16} color="#885776" />,
  "Pescado": <Fish size={16} color="#F3B72A" />,
  "Cacahuetes": <Bean size={16} color="#E88C28" />,
  "Soja": <Bean size={16} color="#E3266A" />,
  "Leche": <Milk size={16} color="#888888" />,
  "Frutos con cáscara": <Nut size={16} color="#A37941" />,
  "Apio": <Leaf size={16} color="#7872A6" />,
  "Mostaza": <Beaker size={16} color="#0F5E5C" />,
  "Granos de sésamo": <CircleDashed size={16} color="#D07228" />,
  "Sulfitos": <Wine size={16} color="#ED255D" />,
  "Dióxido de azufre y sulfitos": <Wine size={16} color="#ED255D" />,
  "Altramuces": <Leaf size={16} color="#54908C" />,
  "Moluscos": <Shell size={16} color="#EA6340" />,
};

const listaAlergenos = [
  "Gluten", "Crustáceos", "Huevo", "Pescado", "Cacahuetes", "Soja", 
  "Leche", "Frutos con cáscara", "Apio", "Mostaza", "Granos de sésamo", 
  "Sulfitos", "Altramuces", "Moluscos"
];

export default function DetalleProducto() {
  const { id } = useParams();
  const { anadirProducto } = useCarrito();
  const { isDark } = useTheme();
  
  const { listaProductos } = useProductos();

  const producto = listaProductos.find((p) => p.id.toString() === (id || ""));

  const nombreLower = producto?.nombre.toLowerCase() || "";
  const esUnEmbutido = nombreLower.includes("un embutido");
  const esDosEmbutidos = nombreLower.includes("dos embutidos");
  const esBocadilloEmbutido = esUnEmbutido || esDosEmbutidos;

  const maxEmbutidos = esUnEmbutido ? 1 : esDosEmbutidos ? 2 : 0;
  const opcionesEmbutidos = ["Jamón cocido", "Queso gouda", "Pavo cocido"];

  const [extrasSeleccionados, setExtrasSeleccionados] = useState<string[]>([]);
  const [tamanoSeleccionado, setTamanoSeleccionado] = useState<string | null>(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const [tieneAlergias, setTieneAlergias] = useState(false);
  const [alergiasSeleccionadas, setAlergiasSeleccionadas] = useState<string[]>([]);
  const [ingredientesQuitados, setIngredientesQuitados] = useState<string[]>([]);
  const [embutidosSeleccionados, setEmbutidosSeleccionados] = useState<string[]>([]);

  if (!producto) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-cafe-bg text-cafe-text">
        <p className="font-bold text-xl">Producto no encontrado</p>
        <Link to="/menu" className="text-cafe-primary font-bold mt-4 border border-cafe-primary px-4 py-2 rounded-full hover:bg-cafe-primary hover:text-white transition-colors">
          Volver al menú
        </Link>
      </div>
    );
  }

  const listaExtras = esBocadilloEmbutido
    ? []
    : producto.categoria === "Bebida caliente"
      ? ["Sin extras", "Para llevar (+0.10€)"]
      : producto.categoria === "Bocadillo"
        ? [
            "Sin extras",
            "Queso (+0.50€)",
            "Tomate y lechuga (+0.30€)",
            "Pan especial (+0.20€)",
          ]
        : ["Sin extras"];

  const precioEnteroReal = producto.precioEntero || producto.precio;
  const precioMedioReal = producto.precioMedio || producto.precio / 2;

  const opcionesTamano =
    producto.categoria === "Bocadillo"
      ? [
          { label: "Entero", precio: precioEnteroReal },
          { label: "Medio", precio: precioMedioReal },
        ]
      : [];

  const obtenerPrecioExtra = (textoExtra: string) => {
    const match = textoExtra.match(/\+(\d+\.\d+)€/);
    return match ? parseFloat(match[1]) : 0;
  };

  let precioBaseCalculado = producto.precio;
  if (producto.categoria === "Bocadillo") {
    if (tamanoSeleccionado === "Entero") precioBaseCalculado = precioEnteroReal;
    else if (tamanoSeleccionado === "Medio") precioBaseCalculado = precioMedioReal;
    else precioBaseCalculado = precioEnteroReal;
  }

  const precioTotalExtras = extrasSeleccionados.reduce((total, extra) => {
    return total + obtenerPrecioExtra(extra);
  }, 0);

  const precioTotal = precioBaseCalculado + precioTotalExtras;

  let esValido = true;
  if (producto.categoria === "Bocadillo" && !tamanoSeleccionado) {
    esValido = false;
  }
  if (esBocadilloEmbutido) {
    if (embutidosSeleccionados.length !== maxEmbutidos) esValido = false;
  } else {
    if (extrasSeleccionados.length === 0) esValido = false;
  }

  const toggleExtra = (extra: string) => {
    const opcionesUnicas = ["Sin extras", "Taza"];
    if (opcionesUnicas.includes(extra)) {
      setExtrasSeleccionados([extra]);
    } else {
      let nuevos = extrasSeleccionados.filter(
        (e) => !opcionesUnicas.includes(e),
      );
      if (nuevos.includes(extra)) {
        nuevos = nuevos.filter((e) => e !== extra);
      } else {
        nuevos.push(extra);
      }
      if (nuevos.length === 0) {
        setExtrasSeleccionados([]);
      } else {
        setExtrasSeleccionados(nuevos);
      }
    }
  };

  const toggleAlergia = (alergia: string) => {
    setAlergiasSeleccionadas((prev) =>
      prev.includes(alergia)
        ? prev.filter((a) => a !== alergia)
        : [...prev, alergia],
    );
  };

  const toggleQuitarIngrediente = (ingrediente: string) => {
    setIngredientesQuitados((prev) =>
      prev.includes(ingrediente)
        ? prev.filter((i) => i !== ingrediente)
        : [...prev, ingrediente],
    );
  };

  const addEmbutido = (emb: string) => {
    if (embutidosSeleccionados.length < maxEmbutidos) {
      setEmbutidosSeleccionados((prev) => [...prev, emb]);
    }
  };

  const removeEmbutido = (emb: string) => {
    setEmbutidosSeleccionados((prev) => {
      const index = prev.indexOf(emb);
      if (index === -1) return prev;
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
  };

  const handleAnadir = () => {
    if (producto && esValido) {
      const embutidosProcesados: string[] = [];
      if (esBocadilloEmbutido) {
        const counts: Record<string, number> = {};
        embutidosSeleccionados.forEach(
          (e) => (counts[e] = (counts[e] || 0) + 1),
        );
        for (const [emb, count] of Object.entries(counts)) {
          embutidosProcesados.push(
            count > 1 ? `Doble ${emb.toLowerCase()}` : emb,
          );
        }
      }

      const extrasFinales = [
        ...(tamanoSeleccionado ? [tamanoSeleccionado] : []),
        ...(esBocadilloEmbutido ? embutidosProcesados : extrasSeleccionados),
        ...(esBocadilloEmbutido
          ? []
          : ingredientesQuitados.map((ing) => `Sin ${ing.toLowerCase()}`)),
      ];

      anadirProducto({
        id: producto.id,
        extras: extrasFinales,
        precio: precioTotal,
        alergias: tieneAlergias ? alergiasSeleccionadas : [],
      });

      setMostrarConfirmacion(true);
      setTimeout(() => setMostrarConfirmacion(false), 2500);
    }
  };

  return (
    <div className="h-screen overflow-y-auto overscroll-none bg-cafe-bg relative w-full max-w-[600px] mx-auto shadow-2xl transition-colors duration-300">
      <div className="relative h-72 w-full shrink-0">
        <img
          src={producto.img}
          alt={producto.nombre}
          className="w-full h-full object-cover"
        />
        <Link
          to="/menu"
          className={cn(
            "absolute top-4 left-4 p-2.5 rounded-full shadow-md transition-all active:scale-95",
            isDark
              ? "bg-[#1e1611] text-[#f5ebdc]"
              : "bg-[#f5ebdc] text-[#1A120B]",
          )}
        >
          <ChevronLeft size={24} />
        </Link>
      </div>

      <div className="p-6 -mt-8 bg-cafe-bg rounded-t-[2rem] relative z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] min-h-full transition-colors duration-300">
        <div className="flex justify-between items-start gap-4 mb-2">
          <h1 className="text-2xl font-bold text-cafe-text leading-tight">
            {producto.nombre}
          </h1>
          <span className="text-2xl font-black text-cafe-primary whitespace-nowrap">
            {producto.precio.toFixed(2)}€
          </span>
        </div>

        <p className="text-sm text-cafe-text opacity-80 mt-4 leading-relaxed">
          {producto.desc}
        </p>

        {/* ALÉRGENOS QUE CONTIENE EL PRODUCTO (Cápsulas legibles) */}
        {producto.alergenos && producto.alergenos.length > 0 && (
            <div className="mt-6 border-t border-b border-black/5 dark:border-white/5 py-4">
              <h3 className="text-xs font-bold text-cafe-text opacity-50 uppercase tracking-wider mb-3">
                Contiene alérgenos:
              </h3>
              <div className="flex flex-wrap gap-2">
                {producto.alergenos.map((alergenoId: string) => {
                  const icono = ALERGENOS_CONFIG[alergenoId] || <AlertTriangle size={16} color="#666" />;
                  return (
                    <div
                      key={alergenoId}
                      className={cn(
                        "px-3 py-1.5 rounded-full border shadow-sm flex items-center gap-2",
                        isDark
                          ? "bg-[#2C221C] border-white/5"
                          : "bg-white border-gray-200"
                      )}
                    >
                      {icono}
                      <span
                        className={cn(
                          "text-xs font-bold",
                          isDark ? "text-[#F5EBDC]" : "text-[#4E342E]"
                        )}
                      >
                        {alergenoId}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        <div className="mt-8">
          <label className="flex items-center gap-4 cursor-pointer group select-none">
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                className="peer appearance-none w-8 h-8 rounded-full border-2 border-gray-400 dark:border-gray-600 checked:border-cafe-primary checked:bg-cafe-primary transition-all"
                checked={tieneAlergias}
                onChange={() => setTieneAlergias(!tieneAlergias)}
              />
              <div className="absolute w-3.5 h-3.5 bg-cafe-bg rounded-full opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
            <span
              className={cn(
                "text-lg font-bold transition-colors",
                tieneAlergias ? "text-cafe-primary" : "text-cafe-text",
              )}
            >
              Tengo alergias (Quitar ingredientes)
            </span>
          </label>

          {/* SELECTOR DE ALERGIAS (Botones legibles) */}
          {tieneAlergias && (
            <div className="mt-4 p-4 bg-black/5 dark:bg-white/5 rounded-2xl animate-in slide-in-from-top-2 duration-300">
              <p className="text-xs opacity-60 mb-3 font-medium">
                Selecciona tus alergias para avisar a cocina:
              </p>
              <div className="flex flex-wrap gap-2">
                {listaAlergenos.map((alg) => {
                  const isSelected = alergiasSeleccionadas.includes(alg);
                  const icono = ALERGENOS_CONFIG[alg] || <AlertTriangle size={16} color="#666" />;
                  return (
                    <button
                      key={alg}
                      onClick={() => toggleAlergia(alg)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-[11px] font-bold transition-all border shadow-sm flex items-center gap-1.5",
                        isSelected
                          ? "bg-[#4E342E] border-[#4E342E] text-white dark:bg-[#F5EBDC] dark:text-[#1A120B] dark:border-[#F5EBDC]"
                          : isDark
                            ? "bg-[#2C1F14] border-[#423224] text-[#F5EBDC] hover:bg-[#1A120B]"
                            : "bg-white border-gray-200 text-[#4B3F35] hover:bg-gray-50"
                      )}
                    >
                      {isSelected ? <CheckCircle2 size={16} className={isDark ? "text-[#1A120B]" : "text-white"} /> : icono}
                      {alg}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {producto.categoria === "Bocadillo" && (
          <div className="mt-8 animate-in slide-in-from-left duration-300">
            <h3 className="font-bold text-lg text-cafe-primary mb-4 border-b-2 border-cafe-primary/20 inline-block pb-1">
              Tamaño <span className="text-red-500">*</span>
            </h3>
            <div className="flex gap-4">
              {opcionesTamano.map((opcion) => (
                <button
                  key={opcion.label}
                  onClick={() => setTamanoSeleccionado(opcion.label)}
                  className={cn(
                    "flex-1 py-4 px-2 rounded-2xl border-2 transition-all active:scale-95 flex flex-col items-center justify-center gap-1",
                    tamanoSeleccionado === opcion.label
                      ? "border-[#6F4E37] bg-[#6F4E37] text-white shadow-lg"
                      : "bg-transparent border-cafe-text/20 text-cafe-text/70 hover:border-[#6F4E37]/50 hover:text-cafe-text",
                  )}
                >
                  <span className="text-sm font-bold opacity-90">
                    {opcion.label}
                  </span>
                  <span className="text-3xl font-black tracking-tight">
                    {opcion.precio.toFixed(2)}€
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {esBocadilloEmbutido && (
          <div className="mt-8">
            <h3 className="font-bold text-lg text-cafe-primary mb-4 border-b-2 border-cafe-primary/20 inline-block pb-1">
              Elige tu{maxEmbutidos > 1 ? "s" : ""} embutido
              {maxEmbutidos > 1 ? "s" : ""}{" "}
              <span className="text-red-500">*</span>
            </h3>
            <p className="text-sm text-cafe-text opacity-60 mb-4 -mt-2">
              Selecciona {maxEmbutidos} opci{maxEmbutidos === 1 ? "ón" : "ones"}{" "}
              {maxEmbutidos > 1 && "(puedes repetir)"}
            </p>

            <div className="space-y-2">
              {opcionesEmbutidos.map((emb) => {
                const cantidad = embutidosSeleccionados.filter(
                  (e) => e === emb,
                ).length;
                const totalSeleccionados = embutidosSeleccionados.length;
                const noMas = totalSeleccionados >= maxEmbutidos;

                return (
                  <div
                    key={emb}
                    className="flex items-center justify-between py-3 border-b border-cafe-text/5 last:border-0"
                  >
                    <span
                      className={cn(
                        "text-base transition-colors",
                        cantidad > 0
                          ? "text-cafe-text font-bold"
                          : "text-cafe-text",
                      )}
                    >
                      {emb}
                    </span>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => removeEmbutido(emb)}
                        disabled={cantidad === 0}
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all",
                          cantidad === 0
                            ? "border-cafe-text/20 text-cafe-text/30 cursor-not-allowed"
                            : "border-cafe-text text-cafe-text active:scale-95 hover:bg-cafe-text/5",
                        )}
                      >
                        <Minus size={16} strokeWidth={2.5} />
                      </button>

                      <span
                        className={cn(
                          "font-bold text-lg w-6 text-center transition-colors",
                          cantidad > 0 ? "text-cafe-text" : "text-cafe-text/40",
                        )}
                      >
                        {cantidad}
                      </span>

                      <button
                        onClick={() => addEmbutido(emb)}
                        disabled={noMas}
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all",
                          noMas
                            ? "border-cafe-text/20 text-cafe-text/30 cursor-not-allowed"
                            : "border-cafe-text text-cafe-text active:scale-95 hover:bg-cafe-text/5",
                        )}
                      >
                        <Plus size={16} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!esBocadilloEmbutido && producto.ingredientes && producto.ingredientes.length > 0 && (
            <div className="mt-8">
              <h3 className="font-bold text-lg text-cafe-primary mb-4 border-b-2 border-cafe-primary/20 inline-block pb-1">
                El {producto.nombre.toLowerCase()} viene con:
              </h3>
              <p className="text-sm text-cafe-text opacity-60 mb-4 -mt-2">
                Quita los ingredientes que no desees
              </p>

              <div className="space-y-4">
                {producto.ingredientes.map((ing: string) => {
                  const isIncluido = !ingredientesQuitados.includes(ing);

                  return (
                    <label
                      key={ing}
                      className="flex items-center gap-4 cursor-pointer group select-none py-1"
                    >
                      <div className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          className="peer appearance-none w-8 h-8 rounded-full border-2 border-gray-400 dark:border-gray-600 checked:border-cafe-primary checked:bg-cafe-primary transition-all cursor-pointer"
                          checked={isIncluido}
                          onChange={() => toggleQuitarIngrediente(ing)}
                        />
                        <div className="absolute w-3.5 h-3.5 bg-cafe-bg rounded-full opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></div>
                      </div>
                      <span
                        className={cn(
                          "text-base transition-colors",
                          isIncluido
                            ? "text-cafe-primary font-bold"
                            : "text-cafe-text opacity-40 line-through",
                        )}
                      >
                        {ing}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

        {!esBocadilloEmbutido && listaExtras.length > 0 && (
          <div className="mt-8">
            <h3 className="font-bold text-lg text-cafe-primary mb-4 border-b-2 border-cafe-primary/20 inline-block pb-1">
              Extras <span className="text-red-500">*</span>
            </h3>
            <div className="space-y-4">
              {listaExtras.map((extra, index) => {
                const isChecked = extrasSeleccionados.includes(extra);
                return (
                  <label
                    key={index}
                    className="flex items-center gap-4 cursor-pointer group select-none py-1"
                  >
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        className="peer appearance-none w-8 h-8 rounded-full border-2 border-gray-400 dark:border-gray-600 checked:border-cafe-primary checked:bg-cafe-primary transition-all"
                        checked={isChecked}
                        onChange={() => toggleExtra(extra)}
                      />
                      <div className="absolute w-3.5 h-3.5 bg-cafe-bg rounded-full opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></div>
                    </div>
                    <span
                      className={cn(
                        "text-base transition-colors",
                        isChecked
                          ? "text-cafe-primary font-bold"
                          : "text-cafe-text group-hover:text-cafe-primary",
                      )}
                    >
                      {extra}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-10 mb-4">
          <UiButton
            onClick={handleAnadir}
            disabled={!esValido}
            className={cn(
              "shadow-lg flex justify-between px-8 transition-all",
              !esValido
                ? "opacity-50 grayscale cursor-not-allowed"
                : "shadow-cafe-primary/20",
            )}
          >
            <span>
              {!esValido
                ? producto.categoria === "Bocadillo" && !tamanoSeleccionado
                  ? "Selecciona tamaño"
                  : esBocadilloEmbutido
                    ? `Faltan embutidos`
                    : "Selecciona extras"
                : "Añadir"}
            </span>
            <span>{precioTotal.toFixed(2)}€</span>
          </UiButton>
        </div>
      </div>

      {mostrarConfirmacion && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
          <div
            className={cn(
              "w-full max-w-xs rounded-3xl p-8 shadow-2xl border text-center animate-in zoom-in-95",
              isDark
                ? "bg-[#2C221C] border-[#F5EBDC20]"
                : "bg-white border-[#4E342E10]",
            )}
          >
            <div className="flex justify-center mb-4">
              <div className="bg-green-500/20 p-4 rounded-full">
                <CheckCircle size={48} className="text-green-500" />
              </div>
            </div>
            <h3
              className={cn(
                "text-2xl font-bold mb-2",
                isDark ? "text-[#F5EBDC]" : "text-[#4E342E]",
              )}
            >
              ¡Añadido!
            </h3>
            <p
              className={cn(
                "text-sm mb-6",
                isDark ? "text-[#F5EBDC80]" : "text-[#8D6E63]",
              )}
            >
              Producto añadido a la cesta correctamente.
            </p>
            <button
              onClick={() => setMostrarConfirmacion(false)}
              className="w-full py-3 bg-[#8D6E63] text-white rounded-xl font-bold shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              <ShoppingBag size={18} /> Continuar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}