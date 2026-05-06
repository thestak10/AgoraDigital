import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./views/Login.jsx";
import Dashboard from './views/Dashboard';
import RutaProtegida from "./components/RutaProtegida.jsx";

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

            </Routes>
        </BrowserRouter>
    );
}

export default App