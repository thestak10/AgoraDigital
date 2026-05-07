import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { LoginContext } from '../context/LoginContext';

export default function ListaPacientes() {
    const { token } = useContext(LoginContext);
    const [pacientes, setPacientes] = useState([]);
    const [totalPacientes, setTotalPacientes] = useState(0);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const obtenerPacientes = async () => {
            try {
                const respuesta = await axios.get('http://backendapp.test/api/pacientes', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                setPacientes(respuesta.data.datos || []);
                setTotalPacientes(respuesta.data.total_pacientes || 0);
            } catch (error) {
                console.error("Error al traer pacientes:", error);
            } finally {
                setCargando(false);
            }
        };

        if (token) obtenerPacientes();
    }, [token]);

    if (cargando) return <div className="text-sm text-gray-500">Cargando pacientes...</div>;

    return (
        <div>
            <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-bold text-[#172554]">Mis Pacientes</h2>
                <span className="bg-[#82ca9c] text-white text-xs font-bold px-2 py-1 rounded-full">
                    {totalPacientes}
                </span>
            </div>

            <div className="space-y-3">
                {pacientes.length > 0 ? (
                    pacientes.map((paciente) => (
                        <div key={paciente.id_paciente} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between hover:border-[#82ca9c] transition-colors">

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#172554] font-bold border-2 border-white shadow-sm">
                                    {paciente.nombre_paciente.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#172554] text-sm">
                                        {paciente.nombre_paciente} {paciente.apellidos_paciente}
                                    </h4>
                                    <p className="text-xs text-gray-500 mt-0.5">DNI: {paciente.dni_paciente}</p>
                                </div>
                            </div>

                            <button className="text-[#82ca9c] text-sm font-bold hover:text-[#172554] transition-colors">
                                Ver perfil
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-400 border border-dashed border-gray-300 p-4 rounded-lg text-center">
                        No tienes pacientes asignados.
                    </p>
                )}
            </div>
        </div>
    );
}