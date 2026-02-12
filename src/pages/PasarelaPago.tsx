import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, CreditCard, Calendar, Lock, User } from 'lucide-react';
import { UiButton } from '../components/ui/Button';
import { UiInput } from '../components/ui/Input';
import { useCarrito } from '../context/CarritoContext';
import { cn } from '../lib/utils';


export default function PasarelaPago() {
  const navigate = useNavigate();
  // Hooks seguros por si acaso
  const carrito = useCarrito();
  const items = carrito ? carrito.items : [];
  const limpiarCarrito = carrito ? carrito.limpiarCarrito : () => {};


  const [procesando, setProcesando] = useState(false);


  // Calcular total
  const total = items.reduce((suma, item) => suma + (item.precio || 0), 0);


  const handlePagar = (e: React.FormEvent) => {
    e.preventDefault();
    setProcesando(true);


    setTimeout(() => {
        limpiarCarrito();
        alert("¡Pago realizado con éxito! Tu pedido está en cocina.");
        navigate('/menu');
    }, 2000);
  };


  // Clase para los inputs en modo oscuro para que no brillen
  const inputDarkClass = "dark:bg-white/5 dark:border-white/10 dark:text-[#F5EBDC] dark:placeholder:text-[#F5EBDC]/30 transition-colors";


  return (
    <div className="min-h-screen bg-cafe-bg pb-10 w-full max-w-[600px] mx-auto shadow-2xl transition-colors duration-300 flex flex-col">
     
      {/* Header */}
      <header className="p-6 flex items-center relative">
        <Link
            to="/carrito"
            className="absolute left-6 p-2 -ml-2 text-cafe-text hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
        >
          <ChevronLeft size={28} />
        </Link>
        <h1 className="w-full text-center text-2xl font-bold text-cafe-text">
          Pago con tarjeta
        </h1>
      </header>


      <div className="px-6 mt-4">
       
        {/* Tarjeta Visual (Gradiente Marrón - Se ve igual en ambos modos) */}
        <div className="bg-gradient-to-br from-[#6F4E37] to-[#8D6E63] rounded-2xl p-6 text-white shadow-xl mb-8 relative overflow-hidden border border-white/10">
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            <div className="flex justify-between items-start mb-8">
                <CreditCard size={32} className="opacity-80" />
                <span className="font-mono font-bold tracking-widest text-lg opacity-80">DEBIT</span>
            </div>
            <div className="font-mono text-xl tracking-widest mb-6 drop-shadow-sm">
                •••• •••• •••• 4242
            </div>
            <div className="flex justify-between text-sm opacity-90">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase opacity-70">Titular</span>
                    <span className="font-bold tracking-wider">USUARIO</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase opacity-70">Expira</span>
                    <span className="font-bold tracking-wider">12/28</span>
                </div>
            </div>
        </div>


        {/* Formulario */}
        <form onSubmit={handlePagar} className="space-y-6">
           
            <div className="space-y-2">
                <label className="text-sm font-bold text-cafe-text ml-1">Número de tarjeta</label>
                <UiInput
                    icon={<CreditCard size={20} className="text-gray-400 dark:text-[#F5EBDC]/50" />}
                    placeholder="0000 0000 0000 0000"
                    required
                    maxLength={19}
                    className={inputDarkClass} // <--- APLICAMOS ESTILO OSCURO
                />
            </div>


            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-cafe-text ml-1">Caducidad</label>
                    <UiInput
                        icon={<Calendar size={20} className="text-gray-400 dark:text-[#F5EBDC]/50" />}
                        placeholder="MM/AA"
                        required
                        maxLength={5}
                        className={inputDarkClass}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-cafe-text ml-1">CVC</label>
                    <UiInput
                        icon={<Lock size={20} className="text-gray-400 dark:text-[#F5EBDC]/50" />}
                        placeholder="123"
                        type="password"
                        required
                        maxLength={3}
                        className={inputDarkClass}
                    />
                </div>
            </div>


            <div className="space-y-2">
                <label className="text-sm font-bold text-cafe-text ml-1">Nombre del titular</label>
                <UiInput
                    icon={<User size={20} className="text-gray-400 dark:text-[#F5EBDC]/50" />}
                    placeholder="Como aparece en la tarjeta"
                    required
                    className={inputDarkClass}
                />
            </div>


            {/* Resumen Total */}
            <div className="py-6 mt-4 border-t border-cafe-text/10 dark:border-white/10 flex justify-between items-end">
                <span className="text-cafe-text opacity-80">Total a pagar</span>
                <span className="text-4xl font-black text-cafe-primary animate-in zoom-in">{total.toFixed(2)}€</span>
            </div>


            {/* Botón Pagar */}
            <UiButton
                type="submit"
                disabled={procesando}
                className={cn(
                    "w-full h-14 text-lg shadow-lg shadow-cafe-primary/20 transition-all",
                    procesando && "opacity-80 cursor-wait",
                    // Aseguramos que el botón sea visible y bonito
                    "bg-[#6F4E37] text-white hover:bg-[#5D4030]"
                )}
            >
                {procesando ? "Procesando..." : "Pagar"}
            </UiButton>
        </form>


        <p className="text-center text-xs text-gray-400 dark:text-[#F5EBDC]/40 mt-6 flex items-center justify-center gap-2">
            <Lock size={12} /> Pagos seguros
        </p>


      </div>
    </div>
  );
}
