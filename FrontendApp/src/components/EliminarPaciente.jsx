import React, { useState, useContext } from 'react';
import axios from 'axios';
import { LoginContext } from '../context/LoginContext';

export default function EliminarPaciente({ paciente, onClose, onExito }) {
    const { token } = useContext(LoginContext);
    const [cargando, setCargando] = useState(false);

    if (!paciente) return null;

    const confirmarBorrado = async () => {

        setCargando(true);

        try {

            await axios.delete(`http://backendapp.test/api/pacientes/${paciente.id_paciente}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            onExito(paciente.id_paciente);
            onClose();

        } catch (error) {
            console.error("Error al eliminar paciente:", error);
            alert(error.response?.data?.message || "Error al intentar eliminar al paciente.");
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden p-8 text-center border border-gray-100">

                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                </div>

                <h3 className="text-2xl font-bold text-[#172554] mb-3">¿Eliminar Paciente?</h3>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <p className="text-gray-700 font-medium">
                        {paciente.nombre_paciente} {paciente.apellidos_paciente}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">Esta acción es irreversible</p>
                </div>

                <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                    Al eliminar este paciente, se borrarán automáticamente su <b>cuenta de acceso</b>, su <b>historial clínico</b> y todas sus <b>citas programadas</b>.
                </p>

                <div className="flex gap-4">
                    <button
                        onClick={onClose}
                        disabled={cargando}
                        className="flex-1 py-3 px-4 text-gray-600 font-bold bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={confirmarBorrado}
                        disabled={cargando}
                        className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-200 transition-all disabled:opacity-50"
                    >
                        {cargando ? 'Eliminando...' : 'Eliminar Todo'}
                    </button>
                </div>
            </div>
        </div>
    );
}