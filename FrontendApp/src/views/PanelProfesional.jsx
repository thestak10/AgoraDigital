import { useContext } from 'react';
import { LoginContext } from '../context/LoginContext';
import {Navigate} from "react-router-dom";
import Navbar from '../components/Navbar';
import ListaPacientes from '../components/ListaPacientes';
import AgendaDiaria from '../components/AgendaDiaria';
import AgendaCalendario from '../components/AgendaCalendario.jsx';
import ListadoFacturacion from '../components/ListadoFacturacion.jsx';

export default function PanelProfesional() {
    const { token, usuario } = useContext(LoginContext);

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (usuario && usuario.rol_usuario === 3) {     //comprobacion para que siendo un admin o paciente no se pueda acceder al panel-profesional.
        return <Navigate to="/panel-paciente"/>;
    }else if (usuario && usuario.rol_usuario === 1){
        return <Navigate to="/panel-admin"/>
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-10">

            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#172554]">Panel del Profesional</h1>
                    <p className="text-gray-500 mt-2">
                        Bienvenido/a, {usuario?.perfil?.nombre_usuario || 'Doctor'}. Aquí tienes el resumen de tu consulta.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">


                        <div className="space-y-6">

                            <AgendaDiaria />

                        </div>


                    <div className="space-y-8">

                        <ListaPacientes />

                    </div>


                    <AgendaCalendario />

                </div>
                <div className="col-span-full mt-6">
                    <ListadoFacturacion />
                </div>



            </main>
        </div>
    );
}