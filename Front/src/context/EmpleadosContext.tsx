import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import api from "../api/config";

export interface Empleado {
  id: string | number; 
  nombre: string;
  correo: string;
}

interface EmpleadosContextType {
  listaEmpleados: Empleado[];
  anadirEmpleado: (nuevo: Omit<Empleado, "id">) => void;
  eliminarEmpleado: (id: string | number) => void;
}

const EmpleadosContext = createContext<EmpleadosContextType | undefined>(undefined);

export function EmpleadosProvider({ children }: { children: ReactNode }) {
  const [listaEmpleados, setListaEmpleados] = useState<Empleado[]>([]);

  useEffect(() => {
    api.get('/empleados')
       .then(res => setListaEmpleados(res.data))
       .catch((error) => console.error("Error cargando empleados:", error)); // <-- CORREGIDO
  }, []);

  const anadirEmpleado = async (nuevo: Omit<Empleado, "id">) => {
    try {
      const res = await api.post('/empleados', nuevo);
      setListaEmpleados((prev) => [...prev, { id: res.data.id, nombre: nuevo.nombre, correo: nuevo.correo }]);
    } catch(error) { 
      console.error("Error añadiendo empleado", error); // <-- CORREGIDO
    }
  };

  const eliminarEmpleado = async (id: string | number) => {
    try {
      await api.delete(`/empleados/${id}`);
      setListaEmpleados((prev) => prev.filter((emp) => emp.id !== id));
    } catch(error) { 
      console.error("Error eliminando empleado", error); // <-- CORREGIDO
    }
  };

  return (
    <EmpleadosContext.Provider value={{ listaEmpleados, anadirEmpleado, eliminarEmpleado }}>
      {children}
    </EmpleadosContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useEmpleados = () => {
  const context = useContext(EmpleadosContext);
  if (!context) throw new Error("useEmpleados debe usarse dentro de EmpleadosProvider");
  return context;
};