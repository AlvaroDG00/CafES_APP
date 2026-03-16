import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Menu from "./pages/Menu";
import DetalleProducto from "./pages/DetalleProducto";
import Carrito from "./pages/Carrito";
import Ajustes from "./pages/Ajustes";
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";
import GestionPersonal from "./pages/admin/GestionPersonal";
import { CarritoProvider } from "./context/CarritoContext";
import { ThemeProvider } from "./context/ThemeContext";
import AjustesAdmin from "./pages/admin/AjustesAdmin";
import NuevoEmpleado from "./pages/admin/NuevoEmpleado";
import GestionMenu from "./pages/admin/GestionMenu";
import NuevoProducto from "./pages/admin/NuevoProducto";
import PasarelaPago from "./pages/PasarelaPago";
import { ProductosProvider } from "./context/ProductosContext";
import { EmpleadosProvider } from "./context/EmpleadosContext";
import EstadoPedidos from "./pages/empleado/EstadoPedidos";
import ConfiguracionEmpleado from "./pages/empleado/ConfiguracionEmpleado";
import MenuAdmin from "./pages/admin/MenuAdmin";
import EditarProducto from "./pages/admin/EditarProducto";
import EstadoPedidosAdmin from "./pages/admin/EstadoPedidosAdmin";
import Centros from "./pages/admin/Centros";

function App() {
  return (
    <ThemeProvider>
      <ProductosProvider>
        <EmpleadosProvider>
          <CarritoProvider>
            <BrowserRouter>
              <Routes>
                {/* Rutas Públicas */}
                <Route path="/" element={<Navigate to="/inicio" replace />} />
                <Route path="/inicio" element={<Login />} />
                <Route path="/registro" element={<Registro />} />

                {/* Rutas Cliente (Layout normal) */}
                <Route element={<Layout />}>
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/carrito" element={<Carrito />} />
                  <Route path="/ajustes" element={<Ajustes />} />
                  <Route path="/pago" element={<PasarelaPago />} />
                </Route>

                {/* Rutas Admin (Layout Admin) */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<MenuAdmin />} />
                  <Route path="personal" element={<GestionPersonal />} />
                  <Route path="menu-gestion" element={<GestionMenu />} />
                  <Route path="nuevo-empleado" element={<NuevoEmpleado />} />
                  <Route path="nuevo-producto" element={<NuevoProducto />} />
                  <Route path="/admin/ajustes" element={<AjustesAdmin />} />
                  <Route
                    path="/admin/estado-pedidos"
                    element={<EstadoPedidosAdmin />}
                  />
                  <Route
                    path="/admin/editar-producto"
                    element={<EditarProducto />}
                  />
                  <Route path="/admin/centros" element={<Centros />} />
                </Route>

                {/* Ruta del empleado de la cafetería */}
                {/* Detalle (Sin layout) */}
                <Route path="/producto/:id" element={<DetalleProducto />} />
                <Route path="/empleado" element={<EstadoPedidos />} />
                <Route
                  path="/empleado/configuracion"
                  element={<ConfiguracionEmpleado />}
                />
              </Routes>
            </BrowserRouter>
          </CarritoProvider>
        </EmpleadosProvider>
      </ProductosProvider>
    </ThemeProvider>
  );
}

export default App;
