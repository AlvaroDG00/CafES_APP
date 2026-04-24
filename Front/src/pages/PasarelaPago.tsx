import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronLeft, CreditCard, Calendar, Lock, User, CheckCircle, ShoppingBag, AlertTriangle } from "lucide-react";
import { UiButton } from "../components/ui/Button";
import { UiInput } from "../components/ui/Input";
import { useCarrito } from "../context/CarritoContext";
import { useTheme } from "../context/ThemeContext";
import { cn } from "../lib/utils";
import api from "../api/config";

export default function PasarelaPago() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  
  const carrito = useCarrito();
  const items = carrito ? carrito.items : [];
  const limpiarCarrito = carrito ? carrito.limpiarCarrito : () => {};

  const [procesando, setProcesando] = useState(false);
  const [mostrarExito, setMostrarExito] = useState(false);
  const [mostrarError, setMostrarError] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

  const [numTarjeta, setNumTarjeta] = useState("");
  const [fecha, setFecha] = useState("");
  const [cvc, setCvc] = useState("");
  const [titular, setTitular] = useState("");

  const total = items.reduce((suma, item) => suma + (item.precio || 0), 0);

  const handleNumTarjeta = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    const formatted = val.match(/.{1,4}/g)?.join(" ") || "";
    setNumTarjeta(formatted.substring(0, 19));
  };

  const handleFecha = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length >= 2) {
      val = val.substring(0, 2) + "/" + val.substring(2, 4);
    }
    setFecha(val.substring(0, 5));
  };

  const handleCvc = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    setCvc(val.substring(0, 4));
  };

  const handlePagar = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcesando(true);

    const usuario_id = localStorage.getItem("usuario_id");

    if (!usuario_id) {
        setMensajeError("No se detecta sesión de usuario. Por favor, vuelve a entrar.");
        setMostrarError(true);
        setProcesando(false);
        return;
    }

    const pedido_data = {
      usuario_id: usuario_id,
      total: total,
      items: items.map((item) => ({
        Producto_id: item.id.toString(),
        Cantidad: 1,
        Tamaño: item.extras.includes("Medio") ? "Medio" : "Entero"
      }))
    };

    try {
      await api.post('/procesar-pago', {
        paymentMethodId: "pm_card_visa",
        pedido_data
      });

      setMostrarExito(true);
      
      // Lanzamos el tiempo de espera sin guardarlo en una variable para que el linter no se queje
      setTimeout(() => {
        limpiarCarrito();
        navigate("/menu");
      }, 2500);

    } catch (err) {
      // Le decimos a TypeScript la forma exacta que tiene nuestro error para evitar "any"
      const error = err as { response?: { data?: { error?: string } } };
      const msg = error.response?.data?.error || "Error al conectar con la base de datos de pedidos.";
      
      setMensajeError(msg);
      setMostrarError(true);
      setProcesando(false);
    }
  };

  const inputDarkClass = "dark:bg-white/5 dark:border-white/10 dark:text-[#F5EBDC] dark:placeholder:text-[#F5EBDC]/30";

  return (
    <div className={cn("min-h-screen pb-24 transition-colors duration-300", isDark ? "bg-[#1A120B]" : "bg-[#F3EFE0]")}>
      
      <div className={cn("sticky top-0 z-40 pt-8 pb-4 px-6 border-b", isDark ? "bg-[#1A120B] border-white/5" : "bg-[#F3EFE0] border-black/5")}>
        <div className="flex items-center gap-4 relative">
          <Link to="/carrito" className={cn("p-2 rounded-full shadow-sm transition-all active:scale-95 absolute left-0", isDark ? "bg-[#2C221C] text-[#F5EBDC]" : "bg-white text-cafe-text")}>
            <ChevronLeft size={24} />
          </Link>
          <h1 className={cn("text-2xl font-bold text-center flex-1", isDark ? "text-[#F5EBDC]" : "text-cafe-text")}>
            Pago seguro
          </h1>
        </div>
      </div>

      <div className="p-6">
        
        <div className={cn(
          "mb-8 relative w-full h-48 rounded-2xl p-6 text-white shadow-xl overflow-hidden transition-all duration-300 animate-in slide-in-from-top-4",
          isDark ? "bg-gradient-to-tr from-[#3E2723] to-[#5D4030]" : "bg-gradient-to-tr from-gray-800 to-gray-500"
        )}>
          <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>

          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <div className="w-12 h-8 bg-yellow-200/80 rounded-md border border-yellow-400/50 flex items-center justify-center opacity-90 shadow-sm">
                <div className="w-8 h-4 border border-yellow-500/40 rounded-sm"></div>
              </div>
              <div className="text-2xl font-black italic tracking-widest opacity-90 drop-shadow-md">VISA</div>
            </div>

            <div>
              <p className="font-mono text-[1.35rem] tracking-widest mb-2 shadow-sm drop-shadow-md">
                {numTarjeta || "•••• •••• •••• ••••"}
              </p>
              <div className="flex justify-between items-end uppercase text-xs font-bold opacity-90">
                <div className="flex flex-col max-w-[65%]">
                  <span className="text-[8px] opacity-70 mb-0.5 tracking-wider">Titular</span>
                  <span className="tracking-widest truncate">{titular || "NOMBRE APELLIDO"}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] opacity-70 mb-0.5 tracking-wider">Caduca</span>
                  <span className="tracking-widest">{fecha || "MM/AA"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handlePagar} className="space-y-4">
          <div className="space-y-2">
            <label className={cn("text-sm font-bold ml-1", isDark ? "text-[#F5EBDC]/80" : "text-cafe-text")}>Número de Tarjeta</label>
            <UiInput 
              icon={<CreditCard size={20} className="text-gray-400 dark:text-[#F5EBDC]/50" />} 
              placeholder="0000 0000 0000 0000" 
              type="text" 
              value={numTarjeta}
              onChange={handleNumTarjeta}
              required 
              className={inputDarkClass} 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={cn("text-sm font-bold ml-1", isDark ? "text-[#F5EBDC]/80" : "text-cafe-text")}>Fecha (MM/AA)</label>
              <UiInput 
                icon={<Calendar size={20} className="text-gray-400 dark:text-[#F5EBDC]/50" />} 
                placeholder="MM/AA" 
                type="text" 
                value={fecha}
                onChange={handleFecha}
                required 
                className={inputDarkClass} 
              />
            </div>
            <div className="space-y-2">
              <label className={cn("text-sm font-bold ml-1", isDark ? "text-[#F5EBDC]/80" : "text-cafe-text")}>CVC</label>
              <UiInput 
                icon={<Lock size={20} className="text-gray-400 dark:text-[#F5EBDC]/50" />} 
                placeholder="123" 
                type="password" 
                value={cvc}
                onChange={handleCvc}
                required 
                className={inputDarkClass} 
              />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <label className={cn("text-sm font-bold ml-1", isDark ? "text-[#F5EBDC]/80" : "text-cafe-text")}>Titular de la tarjeta</label>
            <UiInput 
              icon={<User size={20} className="text-gray-400 dark:text-[#F5EBDC]/50" />} 
              placeholder="Como aparece en la tarjeta" 
              type="text" 
              value={titular}
              onChange={(e) => setTitular(e.target.value.toUpperCase())}
              required 
              className={inputDarkClass} 
            />
          </div>

          <div className="py-6 mt-4 border-t border-cafe-text/10 dark:border-white/10 flex justify-between items-end">
            <span className={cn("opacity-80", isDark ? "text-[#F5EBDC]" : "text-cafe-text")}>Total a pagar</span>
            <span className="text-4xl font-black text-[#6F4E37] animate-in zoom-in">{total.toFixed(2)}€</span>
          </div>

          <UiButton type="submit" disabled={procesando} className={cn("w-full h-14 text-lg shadow-lg shadow-cafe-primary/20 transition-all", procesando && "opacity-80 cursor-wait", "bg-[#6F4E37] text-white hover:bg-[#5D4030]")}>
            {procesando ? "Procesando..." : "Pagar"}
          </UiButton>
        </form>

        <p className="text-center text-xs opacity-40 mt-6 flex justify-center items-center gap-1">
          <Lock size={12} /> Pagos encriptados con seguridad SSL
        </p>
      </div>

      {mostrarExito && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
          <div className={cn("w-full max-w-xs rounded-3xl p-8 shadow-2xl border text-center animate-in zoom-in-95", isDark ? "bg-[#2C221C] border-[#F5EBDC20]" : "bg-white border-[#4E342E10]")}>
            <div className="flex justify-center mb-4">
              <div className="bg-green-500/20 p-4 rounded-full">
                <CheckCircle size={48} className="text-green-500" />
              </div>
            </div>
            <h3 className={cn("text-2xl font-bold mb-2", isDark ? "text-[#F5EBDC]" : "text-[#4E342E]")}>¡Pago completado!</h3>
            <p className={cn("text-sm mb-6", isDark ? "text-[#F5EBDC80]" : "text-[#8D6E63]")}>Tu pedido ha sido enviado a la cocina.</p>
            <button disabled className="w-full py-3 bg-[#8D6E63] text-white rounded-xl font-bold shadow-md opacity-50 flex items-center justify-center gap-2">
              <ShoppingBag size={18} /> Preparando...
            </button>
          </div>
        </div>
      )}

      {mostrarError && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={cn("w-full max-w-xs rounded-3xl p-8 shadow-2xl border text-center animate-in zoom-in-95", isDark ? "bg-[#2C1F14] border-red-500/20" : "bg-white border-red-500/10")}>
            <div className="flex justify-center mb-4">
              <div className="bg-red-500/10 p-4 rounded-full border border-red-500/20">
                <AlertTriangle size={48} className="text-red-500" />
              </div>
            </div>
            <h3 className={cn("text-2xl font-bold mb-2", isDark ? "text-[#F5EBDC]" : "text-[#4E342E]")}>Algo ha fallado</h3>
            <p className={cn("text-sm mb-6 font-medium", isDark ? "text-red-400" : "text-red-500")}>
              {mensajeError}
            </p>
            <button 
              onClick={() => setMostrarError(false)}
              className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold shadow-md active:scale-95 transition-all"
            >
              Cerrar y reintentar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}