import Navbar from '../components/Navbar';
import {useContext} from "react";
import {LoginContext} from "../context/LoginContext.jsx";
import {Navigate} from "react-router-dom";

export default function PanelAdministrador() {
    const { token, usuario } = useContext(LoginContext);

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (usuario && usuario.rol_usuario === 3) {     //comprobacion de seguridad para que siendo un profesional o paciente no se pueda acceder al panel-admin.
        return <Navigate to="/panel-paciente"/>;
    }else if (usuario && usuario.rol_usuario === 2){
        return <Navigate to="/panel-profesional"/>
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <main className="p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    Mi Panel de Administrador
                </h1>

                <div className="bg-white p-6 rounded-lg shadow">
                    <p>Aquí ira la info que ve el admin</p>
                </div>
            </main>
        </div>
    );
}