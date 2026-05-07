import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { LoginContext } from '../context/LoginContext';
import RegistroNuevoPaciente from './RegistroNuevoPaciente';
import AsignarCita from './AsignarCita';

export default function ListaPacientes() {

    const { token } = useContext(LoginContext);
    const [pacientes, setPacientes] = useState([]);
    const [totalPacientes, setTotalPacientes] = useState(0);
    const [cargando, setCargando] = useState(true);
    const [mostrarRegistro, setMostrarRegistro] = useState(false);
    const [pacienteParaCita, setPacienteParaCita] = useState(null);

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
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-[#172554]">Mis Pacientes</h2>
                    <span className="bg-[#82ca9c] text-white text-xs font-bold px-2 py-1 rounded-full">
                         {totalPacientes}
                    </span>
                </div>
                <button onClick={() => setMostrarRegistro(true)} className="bg-[#172554] hover:bg-[#0f172a] text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors shadow-sm flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    Añadir
                </button>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
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

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPacienteParaCita(paciente)}
                                    className="bg-[#172554] hover:bg-[#0f172a] text-white text-xs font-bold py-1.5 px-3 rounded-lg transition-colors shadow-sm">

                                    Nueva Cita
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-400 border border-dashed border-gray-300 p-4 rounded-lg text-center">
                        No tienes pacientes asignados.
                    </p>
                )}
            </div>
            <RegistroNuevoPaciente
                isOpen={mostrarRegistro}
                onClose={() => setMostrarRegistro(false)}
                onSuccess={(nuevoPaciente) => {
                    setPacientes([...pacientes, nuevoPaciente]);
                    setTotalPacientes(totalPacientes + 1);
                }}
            />
            <AsignarCita
                paciente={pacienteParaCita}
                onClose={() => setPacienteParaCita(null)}
            />
        </div>
    );
}