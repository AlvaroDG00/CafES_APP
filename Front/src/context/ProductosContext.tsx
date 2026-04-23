import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import api from "../api/config";

export interface Producto {
  id: string | number;
  nombre: string;
  precio: number;
  categoria: string;
  img: string;
  desc?: string;
  disponible?: boolean;
  precioEntero?: number;
  precioMedio?: number;
  ingredientes?: string[];
  alergenos?: string[];
}

interface ProductosContextType {
  listaProductos: Producto[];
  cargando: boolean;
  anadirProducto: (nuevo: Omit<Producto, "id">) => void;
  eliminarProducto: (id: string | number) => void;
  actualizarProducto: (id: string | number, nuevosDatos: Partial<Producto>) => void;
}

interface AirtableProd {
  id: string;
  nombre: string;
  precio_entero: number;
  precio_medio: number;
  categoria: string;
  imagen: string;
  disponible: boolean;
  alergenos?: string[];
}

const ProductosContext = createContext<ProductosContextType | undefined>(undefined);

export function ProductosProvider({ children }: { children: ReactNode }) {
  const [listaProductos, setListaProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await api.get('/productos');
        const productosReales = res.data.data.map((p: AirtableProd) => ({
          id: p.id,
          nombre: p.nombre,
          precio: p.precio_entero || 0,
          precioEntero: p.precio_entero || 0, // Conectado al precio real
          precioMedio: p.precio_medio || 0,   // Conectado al precio real
          categoria: p.categoria || "Otros",
          img: p.imagen || "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=200&auto=format&fit=crop", 
          disponible: p.disponible !== false,
          desc: "Delicioso y recién preparado",
          alergenos: p.alergenos || [] // Conectado a los alérgenos reales
        }));
        setListaProductos(productosReales);
      } catch (error) {
        console.error("Error cargando el catálogo:", error);
      } finally {
        setCargando(false);
      }
    };
    fetchProductos();
  }, []);

  const anadirProducto = (nuevo: Omit<Producto, "id">) => {
    console.log("Pendiente conectar añadir:", nuevo);
  };
  const eliminarProducto = (id: string | number) => {
    console.log("Pendiente conectar eliminar:", id);
  };

  const actualizarProducto = async (id: string | number, nuevosDatos: Partial<Producto>) => {
    setListaProductos((prev) => prev.map((p) => (p.id === id ? { ...p, ...nuevosDatos } : p)));
    
    if (nuevosDatos.disponible !== undefined) {
       try {
           await api.put(`/productos/${id}/toggle`, { disponible: nuevosDatos.disponible });
       } catch (error) {
           console.error("Error sincronizando disponibilidad", error); 
       }
    }
  };

  return (
    <ProductosContext.Provider value={{ listaProductos, cargando, anadirProducto, eliminarProducto, actualizarProducto }}>
      {children}
    </ProductosContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProductos() {
  const context = useContext(ProductosContext);
  if (!context) throw new Error("useProductos debe usarse dentro de un ProductosProvider");
  return context;
}