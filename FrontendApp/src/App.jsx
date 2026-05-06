import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./views/Login.jsx";
import Dashboard from './views/Dashboard';
import RutaProtegida from "./components/RutaProtegida.jsx";
import PanelPaciente from "./views/PanelPaciente.jsx";
import PanelProfesional from "./views/PanelProfesional.jsx";

function App() {
    return (
        //BrowserRouter es el componente que vigila la url del navegador
        <BrowserRouter>
            <Routes>
                {/* Si la URL es la raíz (/), redirigimos automáticamente al login */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* ruta 1: pantalla de login */}
                <Route path="/login" element={<Login />} />

                {/* ruta 2: dashboard protegida */}
                <Route path="/dashboard"
                       element={
                            <RutaProtegida>
                                <Dashboard/>
                            </RutaProtegida>
                }/>

                {/* ruta para paciente rol 3 */}
                <Route
                    path="/panel-paciente"
                    element={
                        <RutaProtegida rolesPermitidos={[3]}>
                            <PanelPaciente/>
                        </RutaProtegida>
                    }
                />

                {/* ruta para profesionales rol 2*/}
                <Route
                    path="/panel-profesional"
                    element={
                        <RutaProtegida rolesPermitidos={[2]}>
                            <PanelProfesional/>
                        </RutaProtegida>
                    }
                />

                {/* rutas para administradores rol 1 */}
                <Route
                    path="/panel-admin"
                    element={
                        <RutaProtegida rolesPermitidos={[1]}>
                            {/*<PanelAdmin />*/}
                        </RutaProtegida>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App