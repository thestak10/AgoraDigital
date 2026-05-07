import { useState, useContext } from 'react';
import axios from 'axios';
import { LoginContext } from '../context/LoginContext';

export default function AsignarCita({ paciente, onClose }) {

    const { token } = useContext(LoginContext);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');
    const [exito, setExito] = useState(false);


    if (!paciente) return null; // si no hay paciente seleccionado, no dibujamos la ventana

    const enviarFormulario = async (e) => {
        e.preventDefault();

        setCargando(true);
        setError('');

        const datosDelFormulario = Object.fromEntries(new FormData(e.target));

        try {
            await axios.post('http://backendapp.test/api/citas', datosDelFormulario, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setExito(true);
            window.dispatchEvent(new Event('actualizar-agenda'));   //actualizamos la agenda para que aparezca la nueva cita

        } catch (error) {
            if (error.response && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("Error al crear la cita.");
            }
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">

                <div className="bg-[#172554] p-4 flex justify-between items-center text-white">
                    <div>
                        <h3 className="font-bold text-lg">Programar Sesión</h3>
                        <p className="text-xs text-gray-300 mt-0.5">Para: {paciente.nombre_paciente} {paciente.apellidos_paciente}</p>
                    </div>

                    <button onClick={() => { setExito(false); onClose(); }} className="text-gray-300 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                {/* si hay exito, mostramos mensaje si no el formulario */}
                {exito ? (
                    <div className="p-8 text-center space-y-4">
                        <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <h3 className="text-2xl font-bold text-[#172554]">¡Cita Registrada!</h3>
                        <p className="text-gray-500">La sesión se ha añadido a tu agenda correctamente.</p>
                        <button
                            onClick={() => { setExito(false); onClose(); }}
                            className="mt-6 w-full py-2 bg-[#172554] hover:bg-[#0f172a] text-white font-bold rounded-lg transition-colors"
                        >
                            Cerrar
                        </button>
                    </div>
                ) : (
                    <form onSubmit={enviarFormulario} className="p-6">
                        {error && <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}
                        <input type="hidden" name="id_paciente" value={paciente.id_paciente} />

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-[#172554] mb-1">Fecha y Hora</label>
                                <input type="datetime-local" name="fecha_hora_cita" required className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#82ca9c] outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[#172554] mb-1">Modalidad de Sesión</label>
                                <select name="modalidad_cita" required className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#82ca9c] outline-none bg-white">
                                    <option value="Online">Online</option>
                                    <option value="Presencial">Presencial</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[#172554] mb-1">Estado de la Cita</label>
                                <select name="estado_cita" required className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#82ca9c] outline-none bg-white">
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="Completada">Completada</option>
                                    <option value="Cancelada">Cancelada</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end gap-3">
                            <button type="button" onClick={onClose} disabled={cargando} className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-lg transition-colors">Cancelar</button>
                            <button type="submit" disabled={cargando} className="px-6 py-2 bg-[#82ca9c] hover:bg-[#6ab385] text-white font-bold rounded-lg transition-colors disabled:opacity-50">
                                {cargando ? 'Guardando...' : 'Confirmar Cita'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}