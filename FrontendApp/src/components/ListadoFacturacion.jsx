import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { LoginContext } from '../context/LoginContext';

export default function Facturacion() {
    const { token } = useContext(LoginContext);
    const [facturas, setFacturas] = useState([]);
    const [cargando, setCargando] = useState(true);

    const obtenerFacturas = async () => {
        setCargando(true);
        try {
            const respuesta = await axios.get('http://backendapp.test/api/facturas', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setFacturas(respuesta.data.facturas);
        } catch (error) {
            console.error("Error al obtener las facturas:", error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        if (token) {
            obtenerFacturas();
        }
    }, [token]);

    //función para formatear la fecha a un formato español (DD/MM/YYYY)
    const formatearFecha = (fechaString) => {
        const opciones = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(fechaString).toLocaleDateString('es-ES', opciones);
    };

    return (
        <div className="p-8 animate-fade-in-up">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#172554] mb-2">Facturación</h1>
                <p className="text-gray-500">Historial completo de facturas emitidas a los pacientes.</p>
            </div>

            {cargando ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#172554]"></div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="p-4 font-bold text-[#172554]">N.º Factura</th>
                                <th className="p-4 font-bold text-[#172554]">Fecha</th>
                                <th className="p-4 font-bold text-[#172554]">Paciente</th>
                                <th className="p-4 font-bold text-[#172554]">DNI</th>
                                <th className="p-4 font-bold text-[#172554]">Método de Pago</th>
                                <th className="p-4 font-bold text-[#172554] text-right">Total</th>
                                <th className="p-4 font-bold text-[#172554] text-center">Acciones</th>
                            </tr>
                            </thead>
                            <tbody>
                            {facturas.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-gray-500">
                                        Aún no hay facturas registradas.
                                    </td>
                                </tr>
                            ) : (
                                facturas.map((factura) => (
                                    <tr key={factura.id_factura} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="p-4 text-gray-600 font-medium">FAC-{factura.id_factura.toString().padStart(4, '0')}</td>
                                        <td className="p-4 text-gray-600">{formatearFecha(factura.created_at)}</td>
                                        <td className="p-4 font-bold text-[#172554]">
                                            {factura.nombre_paciente_factura} {factura.apellidos_paciente_factura}
                                        </td>
                                        <td className="p-4 text-gray-600">{factura.dni_paciente_factura}</td>
                                        <td className="p-4">
                                                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
                                                    {factura.metodo_pago}
                                                </span>
                                        </td>
                                        <td className="p-4 font-bold text-green-600 text-right">
                                            {factura.precio_total} €
                                        </td>
                                        <td className="p-4 text-center">
                                            <button className="text-[#172554] hover:text-blue-700 bg-blue-50 hover:bg-blue-100 p-2 rounded-lg transition-colors" title="Descargar / Enviar PDF">
                                                <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}