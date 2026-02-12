import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Menu from './pages/Menu';
import DetalleProducto from './pages/DetalleProducto';
import Carrito from './pages/Carrito';
import Ajustes from './pages/Ajustes';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout'; // <--- IMPORTAR
import GestionPersonal from './pages/admin/GestionPersonal'; // <--- IMPORTAR
import { CarritoProvider } from './context/CarritoContext';
import { ThemeProvider } from './context/ThemeContext';
import AjustesAdmin from './pages/admin/AjustesAdmin'; // <--- IMPORTAR
import NuevoEmpleado from './pages/admin/NuevoEmpleado'; // <--- IMPORTAR
import GestionMenu from './pages/admin/GestionMenu';
import NuevoProducto from './pages/admin/NuevoProducto';
import PasarelaPago from './pages/PasarelaPago';
import { ProductosProvider } from './context/ProductosContext';
import { EmpleadosProvider } from './context/EmpleadosContext';
import EstadoPedidos from './pages/empleado/EstadoPedidos';
import ConfiguracionEmpleado from './pages/empleado/ConfiguracionEmpleado';
import MenuAdmin from './pages/admin/MenuAdmin';

function App() {
  return (
    <ThemeProvider>
      <ProductosProvider>
        <EmpleadosProvider>
          <CarritoProvider>
            <BrowserRouter>
              <Routes>
                {/* Rutas Públicas */}
                <Route path="/" element={<Login />} />
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
                  <Route path="ajustes" element={<AjustesAdmin />} />
                  <Route path="/admin/estado-pedidos" element={<EstadoPedidos />} />
                </Route>

                {/* Ruta del empleado de la cafetería */}


                {/* Detalle (Sin layout) */}
                <Route path="/producto/:id" element={<DetalleProducto />} />
                <Route path="/empleado" element={<EstadoPedidos />} />
                <Route path="/empleado/configuracion" element={<ConfiguracionEmpleado />} />
              </Routes>
            </BrowserRouter>
          </CarritoProvider>
        </EmpleadosProvider>
      </ProductosProvider>
    </ThemeProvider>
  );
}

export default App;