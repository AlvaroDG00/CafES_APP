import { createContext, useContext, useState, ReactNode } from 'react';
import { productos as productosIniciales } from '../lib/data';

// 1. Definimos la forma del producto
export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
  img: string;
}

// 2. Definimos qué datos y funciones tendrá el contexto
interface ProductosContextType {
  listaProductos: Producto[];
  anadirProducto: (nuevo: Omit<Producto, 'id'>) => void;
  eliminarProducto: (id: number) => void; // <--- AÑADIR ESTO
}

const ProductosContext = createContext<ProductosContextType | undefined>(undefined);

export function ProductosProvider({ children }: { children: ReactNode }) {
  // Inicializamos con los productos del archivo data.ts
  const [listaProductos, setListaProductos] = useState<Producto[]>(productosIniciales);

  // Función para añadir productos (usada en NuevoProducto.tsx)
  const anadirProducto = (nuevo: Omit<Producto, 'id'>) => {
    const nuevoProducto = {
      ...nuevo,
      id: Date.now(), // Generamos un ID único temporal
    };
    setListaProductos((prev) => [...prev, nuevoProducto]);
  };

  // --- AQUÍ PONES LA FUNCIÓN ELIMINAR ---
  const eliminarProducto = (id: number) => {
    setListaProductos((prev) => prev.filter(p => p.id !== id));
  };

  return (
    <ProductosContext.Provider 
      value={{ 
        listaProductos, 
        anadirProducto, 
        eliminarProducto // <--- NO OLVIDES PASARLA AQUÍ
      }}
    >
      {children}
    </ProductosContext.Provider>
  );
}

// Hook para usarlo fácilmente
export function useProductos() {
  const context = useContext(ProductosContext);
  if (!context) {
    throw new Error('useProductos debe usarse dentro de un ProductosProvider');
  }
  return context;
}