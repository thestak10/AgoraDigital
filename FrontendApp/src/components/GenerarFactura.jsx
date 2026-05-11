import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { LoginContext } from '../context/LoginContext';

export default function GenerarFactura({ paciente, onClose, onSuccess }) {
    const { token } = useContext(LoginContext);

    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [datosFactura, setDatosFactura] = useState(null);
    const [metodoPago, setMetodoPago] = useState('Transferencia');


    const consultarDeuda = async () => {
        setCargando(true);
        try {
            const respuesta = await axios.get(`http://backendapp.test/api/facturas/pendientes/${paciente.id_paciente}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setDatosFactura(respuesta.data);
        } catch (error) {
            console.error("Error al consultar deudas:", error);
        } finally {
            setCargando(false);
        }
    };

    const generarFactura = async () => {
        setGuardando(true);
        try {
            await axios.post('http://backendapp.test/api/facturas', {
                id_paciente: paciente.id_paciente,
                metodo_pago: metodoPago
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            onSuccess();
            onClose();

        } catch (error) {
            console.error("Error al guardar la factura:", error);
        } finally {
            setGuardando(false);
        }
    };

    useEffect(() => {
        if (paciente && token) {
            consultarDeuda();
        }
    }, [paciente, token]);

    if (!paciente) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">

                <div className="bg-[#172554] p-5 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold">Generar Factura</h2>
                        <p className="text-sm text-blue-200">{paciente.nombre_paciente} {paciente.apellidos_paciente}</p>
                    </div>
                    <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div className="p-6">
                    {cargando ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#172554] mx-auto mb-4"></div>
                            <p className="text-gray-500">Calculando sesiones pendientes...</p>
                        </div>
                    ) : datosFactura?.cantidad_sesiones === 0 ? (
                        <div className="text-center py-8">
                            <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <h3 className="font-bold text-lg text-[#172554]">Todo al día</h3>
                            <p className="text-gray-500 mt-2">Este paciente no tiene citas pendientes de facturar.</p>
                            <button onClick={onClose} className="mt-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-xl transition-colors">
                                Volver
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                                <h3 className="font-bold text-[#172554] mb-3 border-b border-blue-200 pb-2">Resumen de Facturación</h3>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600">Sesiones pendientes:</span>
                                    <span className="font-bold text-[#172554]">{datosFactura?.cantidad_sesiones}</span>
                                </div>
                                <div className="flex justify-between items-center text-lg">
                                    <span className="text-gray-600">Total a cobrar:</span>
                                    <span className="font-bold text-green-600">{datosFactura?.precio_total} €</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-[#172554] mb-2">Método de Pago</label>
                                <select
                                    value={metodoPago}
                                    onChange={(e) => setMetodoPago(e.target.value)}
                                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#82ca9c] outline-none bg-white"
                                >
                                    <option value="Transferencia">Transferencia Bancaria</option>
                                    <option value="Efectivo">Efectivo</option>
                                    <option value="Tarjeta">Tarjeta de Crédito / Débito</option>
                                    <option value="Bizum">Bizum</option>
                                </select>
                            </div>

                            <button
                                onClick={generarFactura}
                                disabled={guardando}
                                className="w-full bg-[#172554] hover:bg-[#0f172a] disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                            >
                                {guardando ? 'Procesando...' : 'Confirmar y Guardar Factura'}
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}