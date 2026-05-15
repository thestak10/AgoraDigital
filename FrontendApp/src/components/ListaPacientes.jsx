import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { LoginContext } from '../context/LoginContext';
import RegistroNuevoPaciente from './RegistroNuevoPaciente';
import AsignarCita from './AsignarCita';
import EliminarPaciente from './EliminarPaciente';
import HistorialClinico from './HistorialClinico.jsx';
import GenerarFactura from './GenerarFactura.jsx'

export default function ListaPacientes({ onFacturaGuardada }) {

    const { token } = useContext(LoginContext);
    const [pacientes, setPacientes] = useState([]);
    const [totalPacientes, setTotalPacientes] = useState(0);
    const [cargando, setCargando] = useState(true);
    const [mostrarRegistro, setMostrarRegistro] = useState(false);
    const [pacienteParaCita, setPacienteParaCita] = useState(null);
    const [pacienteAEliminar, setPacienteAEliminar] = useState(null);
    const [pacienteHistorial, setPacienteHistorial] = useState(null);
    const [pacienteParaFacturar, setPacienteParaFacturar] = useState(null);


    const [pacienteExpandidoId, setPacienteExpandidoId] = useState(null);
    const toggleExpandir = (id) => {    //funcion que abre y cierra el menu despegable para cada paciente
        // Si haces clic en el que ya está abierto, lo cierra (lo pone en null)
        // Si haces clic en uno nuevo, guarda su ID para abrirlo
        setPacienteExpandidoId(pacienteExpandidoId === id ? null : id); //si se hace click en el que está abierto lo cierra y si no guarda la id_paciente para abrirlo
    };

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
                        <div key={paciente.id_paciente}
                             onClick={() => toggleExpandir(paciente.id_paciente)}
                             className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col hover:border-[#82ca9c] transition-all cursor-pointer">

                            <div className="flex items-center justify-between">
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
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setPacienteParaCita(paciente);
                                        }}
                                        className="bg-[#172554] hover:bg-[#0f172a] text-white text-xs font-bold py-1.5 px-3 rounded-lg transition-colors shadow-sm">
                                        Nueva Cita
                                    </button>

                                    <button
                                        onClick={(e) =>{
                                            e.stopPropagation();
                                            setPacienteAEliminar(paciente);
                                        }}
                                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Eliminar paciente">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                </div>
                            </div>

                            {pacienteExpandidoId === paciente.id_paciente && (
                                <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3 animate-fade-in-down">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setPacienteParaFacturar(paciente);
                                        }}
                                        className="flex-1 bg-gray-50 hover:bg-gray-100 text-[#172554] border border-gray-200 text-sm font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors">

                                        Generar Factura
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setPacienteHistorial(paciente);
                                        }}
                                        className="flex-1 bg-gray-50 hover:bg-gray-100 text-[#172554] border border-gray-200 text-sm font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                                    >
                                        Historial Clínico
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                ):(
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

            <EliminarPaciente
                paciente={pacienteAEliminar}
                onClose={() => setPacienteAEliminar(null)}
                onExito={(id) => {

                    setPacientes(pacientes.filter(p => p.id_paciente !== id));  //actualizamos la lista de los pacientes
                    window.dispatchEvent(new Event('actualizar-agenda'));   //actualizamos la agenda tambien por si tenia citas el dia en el que se eliminan
                }}
            />
            <HistorialClinico
                paciente={pacienteHistorial}
                onClose={() => setPacienteHistorial(null)}
            />

            <GenerarFactura
                paciente={pacienteParaFacturar}
                onClose={() => setPacienteParaFacturar(null)}
                onSuccess={() => {
                    if (onFacturaGuardada) {
                        onFacturaGuardada(); //sumamos +1 en el panel profesional para que se recarge el componete
                    }
                }}
            />

        </div>
    );
}