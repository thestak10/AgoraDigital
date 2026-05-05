import { useContext } from 'react';
import { LoginContext } from '../context/LoginContext.jsx';

export default function Dashboard() {

    const { usuario } = useContext(LoginContext);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <h1 className="text-4xl font-bold text-blue-900 mb-4">¡Bienvenido al Panel de Control!</h1>
            {/* Si el usuario existe, mostramos su email */}
            <p className="text-lg text-gray-700 mb-8">
                Has iniciado sesión como: <span className="font-bold">{usuario?.email}</span>
            </p>

            <button className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition">
                Cerrar Sesión
            </button>
        </div>
    );
}