import { createContext, useContext, useState, type ReactNode } from "react";

export interface CartItem {
  id: string | number; 
  extras: string[];
  precio: number;
  alergias?: string[]; 
}

interface CarritoContextType {
  items: CartItem[];
  cantidad: number;
  anadirProducto: (item: CartItem) => void;
  eliminarProducto: (index: number) => void;
  limpiarCarrito: () => void;
}

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const anadirProducto = (item: CartItem) => {
    setItems((prev) => [...prev, item]);
  };

  const eliminarProducto = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const limpiarCarrito = () => {
    setItems([]);
  };

  return (
    <CarritoContext.Provider
      value={{
        items,
        cantidad: items.length,
        anadirProducto,
        eliminarProducto,
        limpiarCarrito,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCarrito() {
  const context = useContext(CarritoContext);
  if (context === undefined) {
    throw new Error("useCarrito debe usarse dentro de un CarritoProvider");
  }
  return context;
}