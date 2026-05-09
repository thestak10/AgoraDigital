import { useState, useContext } from 'react';
import axios from 'axios';
import { LoginContext } from '../context/LoginContext';

export default function ConfirmarEliminar({ cita, onClose, onExito }) {
    const { token } = useContext(LoginContext);
    const [cargando, setCargando] = useState(false);


    if (!cita) return null;

    const confirmarBorrado = async () => {
        setCargando(true);
        try {

            await axios.delete(`http://backendapp.test/api/citas/${cita.id_cita}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            onExito(cita.id_cita); //pasamos el Id a la agenda para que lo borre
            onClose(); //cerramos la ventana

        } catch (error) {
            console.error("Error al eliminar la cita:", error);
            alert("Hubo un problema al intentar eliminar la cita.");
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-sm overflow-hidden p-6 text-center transform transition-all">

                <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </div>

                <h3 className="text-xl font-bold text-[#172554] mb-2">¿Eliminar Cita?</h3>

                <p className="text-gray-500 text-sm mb-6">
                    Estás a punto de cancelar la cita de <br/>
                    <b>{cita.paciente ? `${cita.paciente.nombre_paciente} ${cita.paciente.apellidos_paciente}` : 'este paciente'}</b> a las <b>{new Date(cita.fecha_hora_cita).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</b>. <br/>
                    Esta acción no se puede deshacer.
                </p>

                <div className="flex gap-3 justify-center">
                    <button
                        onClick={onClose}
                        disabled={cargando}
                        className="px-4 py-2 text-gray-600 font-bold bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors w-1/2"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={confirmarBorrado}
                        disabled={cargando}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors w-1/2"
                    >
                        {cargando ? 'Borrando...' : 'Sí, eliminar'}
                    </button>
                </div>
            </div>
        </div>
    );
}