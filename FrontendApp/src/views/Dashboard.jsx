import { useContext } from 'react';
import { LoginContext } from '../context/LoginContext.jsx';
import {logoutUsuario} from "../services/loginService.js";

import {useNavigate} from "react-router-dom";

export default function Dashboard() {

    const { usuario,token,cerrarSesionContexto } = useContext(LoginContext);
    const navigate = useNavigate();

    const cerrarSesion = async () =>{

        try{
            await logoutUsuario(token);     //le digo al backend que destruya el token
            cerrarSesionContexto();         //borro todos los datos del front
            navigate('/login');

        }catch (error){
            console.error("Hubo un problema cerrando sesión", error);
        }

    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <h1 className="text-4xl font-bold text-blue-900 mb-4">¡Bienvenido al Panel de Control!</h1>
            {/* Si el usuario existe, mostramos su email */}
            <p className="text-lg text-gray-700 mb-8">
                Has iniciado sesión como: <span className="font-bold">{usuario?.email}</span>
            </p>

            <button
                onClick={cerrarSesion}
                className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition">

                Cerrar Sesión
            </button>
        </div>
    );
}