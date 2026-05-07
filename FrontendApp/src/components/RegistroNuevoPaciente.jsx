import { useState, useContext } from 'react';
import axios from 'axios';
import { LoginContext } from '../context/LoginContext';

export default function RegistroNuevoPaciente({ isOpen, onClose, onSuccess }) {

    const { token } = useContext(LoginContext);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const enviarFormulario = async (e) => {
        e.preventDefault();
        setCargando(true);
        setError('');

        const datosDelFormulario = Object.fromEntries(new FormData(e.target));

        try {
            // Enviamos esos datos directamente
            const respuesta = await axios.post('http://backendapp.test/api/pacientes', datosDelFormulario, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            onSuccess(respuesta.data.paciente);

        } catch (error) {
            if (error.response && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("Ocurrió un error al intentar crear el paciente.");
            }
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl overflow-hidden">
                <div className="bg-[#172554] p-4 flex justify-between items-center text-white">
                    <h3 className="font-bold text-lg">Registrar Nuevo Paciente</h3>
                    <button onClick={onClose} className="text-gray-300 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>


                <form onSubmit={enviarFormulario} className="p-6">

                    {error && (
                        <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Nombres y Apellidos */}
                        <div>
                            <label className="block text-sm font-bold text-[#172554] mb-1">Nombre</label>
                            <input type="text" name="nombre" required
                                   className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#82ca9c] focus:border-[#82ca9c] outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-[#172554] mb-1">Apellidos</label>
                            <input type="text" name="apellidos" required
                                   className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#82ca9c] focus:border-[#82ca9c] outline-none" />
                        </div>

                        {/* DNI y Teléfono */}
                        <div>
                            <label className="block text-sm font-bold text-[#172554] mb-1">DNI</label>
                            <input type="text" name="dni" required
                                   className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#82ca9c] focus:border-[#82ca9c] outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-[#172554] mb-1">Teléfono</label>
                            <input type="tel" name="telefono" required
                                   className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#82ca9c] focus:border-[#82ca9c] outline-none" />
                        </div>

                        {/* Dirección (Ocupa las dos columnas) */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-[#172554] mb-1">Dirección Completa</label>
                            <input type="text" name="direccion" required
                                   className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#82ca9c] focus:border-[#82ca9c] outline-none" />
                        </div>

                        {/* Credenciales de Acceso */}
                        <div className="md:col-span-2 mt-2 pt-4 border-t border-gray-100">
                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Datos de Acceso</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-[#172554] mb-1">Email</label>
                                    <input type="email" name="email" required
                                           className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#82ca9c] focus:border-[#82ca9c] outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-[#172554] mb-1">Contraseña (Asignada)</label>
                                    <input type="text" name="password" required minLength="6"
                                           className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#82ca9c] focus:border-[#82ca9c] outline-none"
                                           placeholder="Mínimo 6 caracteres" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <button type="button" onClick={onClose} disabled={cargando}
                                className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-lg transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" disabled={cargando}
                                className="px-6 py-2 bg-[#82ca9c] hover:bg-[#6ab385] text-white font-bold rounded-lg transition-colors shadow-md disabled:opacity-50">
                            {cargando ? 'Guardando...' : 'Guardar Paciente'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}