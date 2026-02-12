import { createContext, useContext, useState, ReactNode } from 'react';

export interface Empleado {
  id: number;
  nombre: string;
  correo: string;
}

interface EmpleadosContextType {
  listaEmpleados: Empleado[];
  anadirEmpleado: (nuevo: Omit<Empleado, 'id'>) => void;
  eliminarEmpleado: (id: number) => void;
}

const EmpleadosContext = createContext<EmpleadosContextType | undefined>(undefined);

export function EmpleadosProvider({ children }: { children: ReactNode }) {
  const [listaEmpleados, setListaEmpleados] = useState<Empleado[]>([
    { id: 1, nombre: "Empleado/a 1", correo: "emp1@cafe.com" },
    { id: 2, nombre: "Empleado/a 2", correo: "emp2@cafe.com" },
    { id: 3, nombre: "Empleado/a 3", correo: "emp3@cafe.com" },
  ]);

  const anadirEmpleado = (nuevo: Omit<Empleado, 'id'>) => {
    setListaEmpleados(prev => [...prev, { ...nuevo, id: Date.now() }]);
  };

  const eliminarEmpleado = (id: number) => {
    setListaEmpleados(prev => prev.filter(emp => emp.id !== id));
  };

  return (
    <EmpleadosContext.Provider value={{ listaEmpleados, anadirEmpleado, eliminarEmpleado }}>
      {children}
    </EmpleadosContext.Provider>
  );
}

export const useEmpleados = () => {
  const context = useContext(EmpleadosContext);
  if (!context) throw new Error("useEmpleados debe usarse dentro de EmpleadosProvider");
  return context;
};