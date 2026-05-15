import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { LoginContext } from '../context/LoginContext';

export default function Facturacion() {
    const { token } = useContext(LoginContext);
    const [facturas, setFacturas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [descargandoId, setDescargandoId] = useState(null);
    const [enviandoId, setEnviandoId] = useState(null);

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

    const descargarFactura = async (id_factura) => {
        setDescargandoId(id_factura);
        try {
            const respuesta = await axios.get(`http://backendapp.test/api/facturas/${id_factura}/descargar`, {
                headers: { 'Authorization': `Bearer ${token}` },
                responseType: 'blob' // indicamos en la cabecera que el formato de la respuesta no es un JSON si no binario
            });

            // transformamos los datos binarios en un archivo Blob para su manejo con JavaScript.
            // createObjectURL genera una url temporal en el navegador
            const url = window.URL.createObjectURL(new Blob([respuesta.data]));

            const enlace = document.createElement('a');
            enlace.href = url; //asignamos la url temporal al elemento <a>

            // con el atributo HTML5 'download' forzamos al navegador a descargar el archivo y le indicamos elnombre que tendrá pdf
            enlace.setAttribute('download', `Factura_Agora_${id_factura.toString().padStart(4, '0')}.pdf`); // padStart completa con ceros a la izquierda.

            document.body.appendChild(enlace); //añadimos el enlace al html

            enlace.click(); //forzamos el click para que se haga la descarga del archivo

            enlace.parentNode.removeChild(enlace);  //borramos el enlace de descarga y la url que generamos en la memoria de navegador.
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Error al descargar:", error);
            alert("Error al descargar el PDF.");
        } finally {
            setDescargandoId(null);
        }
    };

    const enviarFactura = async (id_factura) => {
        setEnviandoId(id_factura);
        try {
            await axios.post(`http://backendapp.test/api/facturas/${id_factura}/enviar`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            alert("Factura enviada por correo con éxito");

        } catch (error) {

            console.error("Error al enviar:", error);
            alert("Error al enviar el correo.");

        } finally {
            setEnviandoId(null);
        }
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
                                            <div className="flex justify-center gap-2">
                                                {/* Botón Descargar */}
                                                <button
                                                    onClick={() => descargarFactura(factura.id_factura)}
                                                    disabled={descargandoId === factura.id_factura}
                                                    className="text-gray-600 hover:text-[#172554] bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-colors disabled:opacity-50"
                                                    title="Descargar PDF"
                                                >
                                                    {descargandoId === factura.id_factura ? (
                                                        <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                                                    ) : (
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                                    )}
                                                </button>

                                                <button
                                                    onClick={() => enviarFactura(factura.id_factura)}
                                                    disabled={enviandoId === factura.id_factura}
                                                    className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 p-2 rounded-lg transition-colors disabled:opacity-50"
                                                    title="Enviar por Correo"
                                                >
                                                    {enviandoId === factura.id_factura ? (
                                                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                                    ) : (
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                                    )}
                                                </button>
                                            </div>
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