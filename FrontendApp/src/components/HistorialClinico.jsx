import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { LoginContext } from '../context/LoginContext';

export default function ModalHistorial({ paciente, onClose }) {

    const { token } = useContext(LoginContext);
    const [historial, setHistorial] = useState([]);
    const [nuevaNota, setNuevaNota] = useState('');
    const [cargando, setCargando] = useState(false);
    const [guardando, setGuardando] = useState(false);

    const obtenerHistorial = async () => {
        setCargando(true);
        try {
            const respuesta = await axios.get(`http://backendapp.test/api/historial/${paciente.id_paciente}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setHistorial(respuesta.data?.datos || []);
        } catch (error) {
            console.error("Error al obtener historial:", error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        if (paciente && token) {
            obtenerHistorial();
        }
    }, [paciente, token]);


    const guardarNota = async () => {
        if (!nuevaNota.trim()) return; // No guardar si está vacío

        setGuardando(true);
        try {
            await axios.post('http://backendapp.test/api/historial', {
                id_paciente: paciente.id_paciente,
                contenido_cifrado: nuevaNota
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setNuevaNota('');
            obtenerHistorial(); // recargamos la lista para ver la nueva nota

        } catch (error) {
            console.error("Error al guardar nota:", error);
        } finally {
            setGuardando(false);
        }
    };

    if (!paciente) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl flex flex-col h-[80vh] overflow-hidden animate-fade-in-up">

                <div className="bg-[#172554] p-5 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold">Historial Clínico</h2>
                        <p className="text-sm text-blue-200">Paciente: {paciente.nombre_paciente} {paciente.apellidos_paciente}</p>
                    </div>
                    <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <div className="flex-1 p-6 overflow-y-auto bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300">
                    {cargando ? (
                        <p className="text-center text-gray-500 my-10 animate-pulse">Cargando historial seguro... 🔐</p>
                    ) : historial.length > 0 ? (
                        <div className="space-y-4">
                            {historial.map((nota) => (
                                <div key={nota.id_historial} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="flex items-center gap-2 mb-2 text-xs text-gray-500 font-bold">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                        {new Date(nota.fecha_modificacion).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' })}
                                    </div>
                                    <p className="text-[#172554] whitespace-pre-wrap leading-relaxed">
                                        {nota.contenido_cifrado}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-white rounded-xl border-2 border-dashed border-gray-200">
                            <p className="text-gray-400">Aún no hay notas en el historial de este paciente.</p>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t bg-white">
                    <label className="block text-sm font-bold text-[#172554] mb-2">Añadir nueva nota a la sesión de hoy</label>
                    <textarea
                        value={nuevaNota}
                        onChange={(e) => setNuevaNota(e.target.value)}
                        placeholder="Escribe aquí las observaciones clínicas..."
                        className="w-full border border-gray-300 rounded-xl p-3 h-24 focus:ring-2 focus:ring-[#82ca9c] focus:border-[#82ca9c] outline-none resize-none mb-3"
                    ></textarea>
                    <div className="flex justify-end">
                        <button
                            onClick={guardarNota}
                            disabled={!nuevaNota.trim() || guardando}
                            className="bg-[#82ca9c] hover:bg-[#6bb986] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-2.5 px-6 rounded-xl transition-colors shadow-sm flex items-center gap-2"
                        >
                            {guardando ? 'Guardando...' : 'Guardar Nota'}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}