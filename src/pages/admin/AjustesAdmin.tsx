import ConfiguracionBase from "../../components/ConfiguracionBase";

export default function AjustesAdmin() {
  // Sacamos el nombre real de la base de datos que guardamos al hacer login
  const nombreReal = localStorage.getItem("usuario_nombre") || "Dueño";

  return (
    <ConfiguracionBase rol="Administrador" nombreUsuario={nombreReal} />
  );
}