import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../context/LoginContext';
import { logoutUsuario } from '../services/loginService';

export default function Navbar() {
    const { usuario, token, cerrarSesionContexto } = useContext(LoginContext);
    const navigate = useNavigate();

    console.log("Nav usuario", usuario);
    const cerrarSesion = async () => {
        try {

            await logoutUsuario(token);     //le digo al backend que destruya el token
            cerrarSesionContexto();         //borro todos los datos del front
            navigate('/login');

        } catch (error) {
            console.error("Hubo un problema cerrando sesión", error);
        }
    };

    return (
        <nav className="bg-[#172554] text-white p-4 shadow-md flex justify-between items-center">

            <div className="text-xl font-bold">
                PsicoMálaga
            </div>

            <div className="flex items-center gap-4">
                <span className="text-sm">Hola, {usuario?.perfil?.nombre_usuario} {usuario?.perfil?.apellidos_usuario}</span>

                <button
                    onClick={cerrarSesion}
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition text-sm font-semibold">

                    Cerrar Sesión
                </button>
            </div>
        </nav>
    );
}