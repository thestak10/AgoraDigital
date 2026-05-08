import { useContext } from 'react';
import { LoginContext } from '../context/LoginContext';
import {Navigate} from "react-router-dom";
import Navbar from '../components/Navbar';
import ListaPacientes from '../components/ListaPacientes';
import AgendaDiaria from '../components/AgendaDiaria';

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
                {/* Cabecera del panel */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#172554]">Panel del Profesional</h1>
                    <p className="text-gray-500 mt-2">
                        Bienvenido/a, {usuario?.perfil?.nombre_usuario || 'Doctor'}. Aquí tienes el resumen de tu consulta.
                    </p>
                </div>

                {/* Grid principal de 3 columnas */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* COLUMNA 1: Agenda Diaria (Próximamente) */}
                    <div className="space-y-6">
                        <div className="space-y-6">
                            <AgendaDiaria />
                        </div>
                    </div>

                    {/* COLUMNA 2: Mis Pacientes + Notas Clínicas */}
                    <div className="space-y-8">
                        {/* Nuestro nuevo componente de lista */}
                        <ListaPacientes />

                        {/* Caja de Notas Clínicas (Tal cual tu diseño) */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="font-bold text-[#172554] text-lg mb-4">Notas Clínicas</h3>
                            <textarea
                                className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#82ca9c] focus:ring-1 focus:ring-[#82ca9c] transition-colors resize-none h-32"
                                placeholder="Escribe tus notas clínicas aquí..."
                            ></textarea>
                            {/* Botón invertido para que el menta destaque */}
                            <button className="mt-4 w-full bg-[#82ca9c] hover:bg-[#6ab385] text-white font-bold py-2 px-4 rounded-lg transition text-sm">
                                Guardar Nota
                            </button>
                        </div>

                    </div>

                    {/* COLUMNA 3: Calendario (Próximamente) */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-[#172554] mb-4">Calendario</h2>
                        <div className="bg-white p-10 rounded-xl border border-dashed border-gray-300 text-center text-gray-400 h-64 flex items-center justify-center">
                            En construcción...
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}