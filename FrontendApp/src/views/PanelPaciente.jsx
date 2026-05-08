import { useState, useEffect, useContext } from 'react';
import { LoginContext } from '../context/LoginContext';
import Navbar from '../components/Navbar';
import ProximaCita from '../components/ProximaCita';
import ListaHistorial from '../components/ListaHistorial';
import axios from "axios";
import {Navigate} from "react-router-dom";

export default function PanelPaciente() {

    const { token,usuario } = useContext(LoginContext);
    const [citas, setCitas] = useState([]);
    const [cargando, setCargando] = useState(true);

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (usuario && usuario.rol_usuario === 2) {     //comprobacion para que siendo un admin o proffesional no se pueda acceder al panel-profesional.
        return <Navigate to="/panel-profesional" />;
    }else if (usuario && usuario.rol_usuario === 1){
        return <Navigate to="/panel-admin" />;
    }

    useEffect(() => { //useEffect carga la pagina para que se muestren los datosd e las citas

        const obtenerCitas = async () => {

            try {

                const respuesta = await axios.get('http://backendapp.test/api/citas', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                setCitas(respuesta.data.datos || []);   //si laravel no manda nada guardamos una lista vacia para que no se rompa la web ya que si React lee un lista que es null pasaria

            } catch (error) {
                console.error("Error al traer citas:", error);

            } finally {
                setCargando(false);
            }
        };

        obtenerCitas();

    }, [token]); //si el token cambia, se vuelve a ejecutar el useEffect de nuevo (arry de dependencias)

    const ahora = new Date();

    const proxima = citas
        .filter(cita => cita.estado_cita === 'Pendiente' && new Date(cita.fecha_hora_cita) >= ahora)    //comprobamos que el estado de cita sea Pendiente y que su fecha sea igual o mayor a la fecha actual
        .sort((a, b) => new Date(a.fecha_hora_cita) - new Date(b.fecha_hora_cita))[0];      //ornedamos las citas y recogemos la primera de la lista que mostraremos en el componente de ProximaCita


    const historial = citas
        .filter(cita => cita.id_cita !== proxima?.id_cita)  //filtramos las que no sean citas proximas
        .sort((a, b) => new Date(b.fecha_hora_cita) - new Date(a.fecha_hora_cita));     //ordenamos por fecha la citas no proximas de forma descendente por eso ponemos b antes que a

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-10">
            <Navbar />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
                {cargando ? (
                    <div className="text-center py-20 text-[#172554] font-bold">Cargando tus sesiones...</div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                            <div className="lg:col-span-2">
                                <ProximaCita cita={proxima} />
                            </div>


                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                                <div className="w-full flex justify-between items-center mb-2">
                                    <h3 className="font-bold text-[#172554] text-xl">Mensajes</h3>
                                    <svg className="w-6 h-6 text-[#82ca9c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                    </svg>
                                </div>
                                <div className="text-center my-6">
                                    <span className="text-6xl font-bold text-[#82ca9c]">2</span>
                                    <p className="text-gray-500 mt-2 font-medium">mensajes sin leer</p>
                                </div>
                                <button className="w-full bg-[#172554] hover:bg-[#0f172a] text-white font-bold py-3 px-4 rounded-lg transition text-sm">
                                    Ver todos los mensajes
                                </button>
                            </div>
                        </div>

                        {/* Le pasamos el resto de citas a la lista */}
                        <ListaHistorial citas={historial} />
                    </>
                )}
            </main>
        </div>
    );
}