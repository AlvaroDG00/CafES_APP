import { useState } from "react";
import ConfiguracionBase from "../../components/ConfiguracionBase";

export default function ConfigEmpleado() {
  const [nombre] = useState(() => {
    const nombreGuardado = localStorage.getItem("usuario_nombre");
    return nombreGuardado || "Empleado"; // Si por lo que sea no está, pone Empleado
  });

  // Le pasamos la variable 'nombre' a la prop 'rol' porque hemos visto
  // que es la que controla el texto grande en tu componente ConfiguracionBase.
  return <ConfiguracionBase rol={nombre} nombreUsuario={nombre} />;
}