import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { LoginContext } from '../context/LoginContext';
import EditarCita from './EditarCita';
import EliminarCita from './EliminarCita.jsx';

export default function AgendaDiaria() {
    const { token } = useContext(LoginContext);
    const [citasHoy, setCitasHoy] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [citaEditando, setCitaEditando] = useState(null);
    const [citaBorrar, setBorrarCita] = useState(null);


    useEffect(() => {   //useEffect carga la pagina para que se muestren los datos de las citas
        if (!token) return;

        const obtenerAgenda = async () => {
            try {
                const respuesta = await axios.get('http://backendapp.test/api/citas', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                const ahora = new Date();   //recojo la fecha y hora actual a la que el profesional entra en su panel
                const fechaHoy = ahora.toISOString().split('T')[0]; //formateamos la fecha, pasamos la fecha a string separamos con split la fecha y hora convirtiendolo en un array y nos quedamos solo con la fecha.


                const citasProcesadas = (respuesta.data.datos || []).filter(cita => {   //cogemos la lista de citas que envia el bakend y si no devuelve nada usamos un array vacio

                        const esDeHoy = cita.fecha_hora_cita.startsWith(fechaHoy);  //comprobamos que la fechas coincidan
                        const horaCita = new Date(cita.fecha_hora_cita);
                        const esFutura = horaCita >= ahora;

                        return esDeHoy && esFutura; //si la cita es mas tarde o a la misma hora que la fecha actual, devolvemos la cita y de esta forma vemos las citas de ese dia
                    })
                    .sort((a, b) => new Date(a.fecha_hora_cita) - new Date(b.fecha_hora_cita)); //ordenamos las citas para que la primera sea la mas temprana.

                setCitasHoy(citasProcesadas);

            } catch (error) {
                console.error("Error al traer la agenda:", error);
            } finally {
                setCargando(false);
            }
        };

        obtenerAgenda();


        window.addEventListener('actualizar-agenda', obtenerAgenda); //capturamos el evento y se actualiza la agenda

        return () => window.removeEventListener('actualizar-agenda', obtenerAgenda);
    }, [token]);


    if (cargando) return <div className="text-sm text-gray-500">Cargando agenda...</div>;

    return (
        <div>
            <h2 className="text-xl font-bold text-[#172554] mb-4">Agenda Diaria</h2>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {citasHoy.length > 0 ? (
                    citasHoy.map((cita) => (

                        <div key={cita.id_cita} className="bg-white p-4 rounded-xl border-y border-r border-gray-200 border-l-4 border-l-[#82ca9c] shadow-sm flex justify-between items-center group hover:border-gray-300 transition-colors">

                            <div>
                                <span className="text-xs font-bold text-[#82ca9c] uppercase tracking-wider">
                                    {cita.modalidad_cita}
                                </span>

                                <h4 className="font-bold text-[#172554] text-lg mt-1">
                                    {new Date(cita.fecha_hora_cita).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </h4>

                                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                    <span className={`w-2 h-2 rounded-full ${
                                        cita.estado_cita === 'Cancelada' ? 'bg-red-500' :
                                            cita.estado_cita === 'Pendiente' ? 'bg-yellow-400' :
                                                'bg-green-400'
                                    }`}></span>
                                    {cita.estado_cita}
                                </p>

                                <span className="font-medium text-gray-700">
                                    {cita.paciente ? `- ${cita.paciente.nombre_paciente} ${cita.paciente.apellidos_paciente}` : '- Paciente no disponible'}
                                </span>
                            </div>

                            {/*Botones para modificar y eliminar citas*/}
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">

                                <button
                                    onClick={() => setCitaEditando(cita)}
                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Modificar cita">

                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                </button>


                                <button
                                    onClick={() => setBorrarCita(cita)}
                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Eliminar cita">

                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                            </div>

                        </div>
                    ))
                ) : (
                    <div className="bg-white p-6 rounded-xl border border-dashed border-gray-300 text-center text-gray-400 text-sm">
                        No tienes citas programadas para hoy.
                    </div>
                )}
            </div>

            <EditarCita
                cita={citaEditando}
                onClose={() => setCitaEditando(null)}
            />

            <EliminarCita
                cita={citaBorrar}
                onClose={() => setBorrarCita(null)}
                onExito={(idBorrado) => {
                    setCitasHoy(citasHoy.filter(c => c.id_cita !== idBorrado)); //hacemos que la cita desarezca al instante
                }}
            />

        </div>
    );
}