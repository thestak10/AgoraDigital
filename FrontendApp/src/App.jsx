import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./views/Login.jsx";
import Dashboard from './views/Dashboard';

function App() {
    return (
        //BrowserRouter es el componente que vigila la url del navegador
        <BrowserRouter>
            <Routes>
                {/* Si la URL es la raíz (/), redirigimos automáticamente al login */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* Puerta 1: La pantalla de Login */}
                <Route path="/login" element={<Login />} />

                {/* Puerta 2: El Dashboard */}
                <Route path="/dashboard" element={<Dashboard />} />

            </Routes>
        </BrowserRouter>
    );
}

export default App