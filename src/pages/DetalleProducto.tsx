import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { productos } from '../lib/data';
import { UiButton } from '../components/ui/Button';
import { useCarrito } from '../context/CarritoContext';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/utils';


export default function DetalleProducto() {
  const { id } = useParams();
  const { anadirProducto } = useCarrito();
  const { isDark } = useTheme();


  const producto = productos.find(p => p.id === Number(id));


  // --- ESTADO PARA SELECCIÓN MÚLTIPLE ---
  const [extrasSeleccionados, setExtrasSeleccionados] = useState<string[]>([]);


  if (!producto) {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-cafe-text">
            <p>Producto no encontrado</p>
            <Link to="/menu" className="text-cafe-primary font-bold mt-4">Volver al menú</Link>
        </div>
    );
  }


  // --- DEFINICIÓN DE EXTRAS ---
  let listaExtras: string[] = [];
 
  if (extrasSeleccionados.length === 0) {
     if (producto.categoria === 'Bebida caliente') {
         setExtrasSeleccionados(['Taza']);
     } else {
         setExtrasSeleccionados(['Sin extras']);
     }
  }


  if (producto.categoria === 'Bebida caliente') {
    listaExtras = ['Taza', 'Para llevar (+0.10€)', 'Leche de soja (+0.20€)', 'Descafeinado'];
  } else if (producto.categoria === 'Bocadillo') {
    listaExtras = ['Sin extras', 'Queso (+0.50€)', 'Tomate y lechuga (+0.30€)', 'Pan especial (+0.20€)'];
  } else {
    listaExtras = ['Sin extras'];
  }


  // --- CALCULADORA ---
  const obtenerPrecioExtra = (textoExtra: string) => {
    const match = textoExtra.match(/\+(\d+\.\d+)€/);
    return match ? parseFloat(match[1]) : 0;
  };


  const precioTotal = extrasSeleccionados.reduce((total, extra) => {
    return total + obtenerPrecioExtra(extra);
  }, producto.precio);


  // --- LÓGICA DE SELECCIÓN ---
  const toggleExtra = (extra: string) => {
    const opcionesUnicas = ["Sin extras", "Taza"];
   
    if (opcionesUnicas.includes(extra)) {
        setExtrasSeleccionados([extra]);
    } else {
        let nuevos = extrasSeleccionados.filter(e => !opcionesUnicas.includes(e));
       
        if (nuevos.includes(extra)) {
            nuevos = nuevos.filter(e => e !== extra);
        } else {
            nuevos.push(extra);
        }


        if (nuevos.length === 0) {
             setExtrasSeleccionados([producto.categoria === 'Bebida caliente' ? 'Taza' : 'Sin extras']);
        } else {
             setExtrasSeleccionados(nuevos);
        }
    }
  };


  const handleAnadir = () => {
    if (producto) {
        // AHORA ENVIAMOS UN OBJETO COMPLETO CON EXTRAS Y PRECIO
        anadirProducto({
            id: producto.id,
            extras: extrasSeleccionados,
            precio: precioTotal
        });
    }
  };


  return (
    <div className="min-h-screen bg-cafe-bg pb-24 relative w-full max-w-[600px] mx-auto shadow-2xl shadow-black/5 dark:shadow-black/20 transition-colors duration-300">
     
      {/* Header con imagen */}
      <div className="relative h-72 w-full">
        <img
            src={producto.img}
            alt={producto.nombre}
            className="w-full h-full object-cover"
        />
        <Link
            to="/menu"
            className={cn(
              "absolute top-4 left-4 p-2.5 rounded-full shadow-sm backdrop-blur-sm transition-all active:scale-95 hover:bg-white",
              "bg-white/90",
              isDark ? "text-[#1E1611]" : "text-cafe-text"
            )}
        >
          <ChevronLeft size={24} />
        </Link>
      </div>


      {/* Info del producto */}
      <div className="p-6 -mt-8 bg-cafe-bg rounded-t-[2rem] relative z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] min-h-[50vh] transition-colors duration-300">
       
        <div className="flex justify-between items-start gap-4 mb-2">
            <h1 className="text-2xl font-bold text-cafe-text leading-tight">{producto.nombre}</h1>
            <span className="text-2xl font-black text-cafe-primary whitespace-nowrap animate-in zoom-in duration-300">
                {precioTotal.toFixed(2)}€
            </span>
        </div>
       
        <p className="text-sm text-cafe-text opacity-80 mt-4 leading-relaxed">
          {producto.desc} <br/>
          <span className="block mt-2 italic text-xs opacity-70">
            Nota: Debido al tamaño reducido de nuestra cocina no podemos garantizar la ausencia total de trazas de otros alérgenos.
          </span>
        </p>


        {/* Sección Extras */}
        <div className="mt-8">
            <h3 className="font-bold text-lg text-cafe-primary mb-4 border-b-2 border-cafe-primary/20 inline-block pb-1">
                Extras
            </h3>
           
            <div className="space-y-4">
                {listaExtras.map((extra, index) => {
                    const isChecked = extrasSeleccionados.includes(extra);
                    return (
                        <label key={index} className="flex items-center gap-4 cursor-pointer group select-none py-1">
                            <div className="relative flex items-center justify-center">
                                <input
                                    type="checkbox"
                                    className="peer appearance-none w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600 checked:border-cafe-primary checked:bg-cafe-primary transition-all"
                                    checked={isChecked}
                                    onChange={() => toggleExtra(extra)}
                                />
                                <div className="absolute w-3.5 h-3.5 bg-white dark:bg-[#1E1611] rounded-full opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></div>
                            </div>
                            <span className={cn(
                                "text-base transition-colors",
                                isChecked ? "text-cafe-primary font-bold" : "text-cafe-text group-hover:text-cafe-primary"
                            )}>
                                {extra}
                            </span>
                        </label>
                    );
                })}
            </div>
        </div>


        {/* Botón de Añadir */}
        <div className="mt-10">
            <UiButton onClick={handleAnadir} className="shadow-lg shadow-cafe-primary/20 flex justify-between px-8">
                <span>Añadir</span>
                <span>{precioTotal.toFixed(2)}€</span>
            </UiButton>
        </div>
      </div>
    </div>
  );
}
