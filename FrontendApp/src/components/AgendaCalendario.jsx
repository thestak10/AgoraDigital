import  { useState, useEffect, useContext } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import { LoginContext } from '../context/LoginContext';
import 'react-calendar/dist/Calendar.css';
import '../CalendarioPersonalizado.css';
import EditarCita from './EditarCita';
import EliminarCita from './EliminarCita.jsx';

export default function AgendaCalendario() {

    const { token } = useContext(LoginContext);
    const [citas, setCitas] = useState([]);

    const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());     //aqui guardamos el dia que pulsa el profesional, por defecto es el dia actual
    const [cargando, setCargando] = useState(false);

    // Estados para los modales
    const [citaEditando, setCitaEditando] = useState(null);
    const [citaABorrar, setCitaABorrar] = useState(null);

    useEffect(() => {
    const obtenerCitas = async () => {  //nos traemos las citas del backend

        if (!token) return;
        setCargando(true);

        try {
            const respuesta = await axios.get('http://backendapp.test/api/citas', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setCitas(respuesta.data?.datos || []);

        } catch (error) {
            console.error("Error en calendario:", error);
        } finally {
            setCargando(false);
        }
    };

        obtenerCitas();

        window.addEventListener('actualizar-agenda', obtenerCitas);
        return () => window.removeEventListener('actualizar-agenda', obtenerCitas);

    }, [token]);

    const diferenciaMilisegundos = fechaSeleccionada.getTimezoneOffset() * 60000;   //getTimezoneOffset devuelve la diferencia en minutos de la hora del ordenador y la UTC (tiempo universal coordinado) que es con la que trabaja JavaScript, y esos minutos lo pasamos a milisigundos por eso multiiplicamos por 60000
    const fechaLocal = new Date(fechaSeleccionada.getTime() - diferenciaMilisegundos);   //fechaSeleccionada.getTime() devuelve los milisegundos actuales en UTC, al restarle la diferencia conseguimos la fecha actual de la zona horaria de españa, por que si son las 01:00 del dia 10 en mi casa y la hora en el UTC son las 23:00 del dia 9, haciendo esta resta conseguimos que la fecha en formato universal sea la del dia 10

    const fechaFormateada = fechaLocal.toISOString().split('T')[0];     //damos formato a la fecha como hemos hecho anteriormente en otros componentes

    const citasDelDia = citas       //filtramos para mostrar las citas del dia seleccionado
        .filter(cita => cita && cita.fecha_hora_cita?.startsWith(fechaFormateada))
        .sort((a, b) => new Date(a.fecha_hora_cita) - new Date(b.fecha_hora_cita));

    const marcarDiasConCitas = ({ date, view }) => {    //funcion con la que pintamos en el calendario los dias donde tenemos citas

        if (view === 'month') { //si el calendario muestra los dias del mes

            const diferenciaMilisegundos = date.getTimezoneOffset() * 60000;    //formateamos la fecha y hora como antes
            const fechaDelCuadradito = new Date(date.getTime() - diferenciaMilisegundos).toISOString().split('T')[0];

            const tieneCitas = citas.some(cita => cita && cita.fecha_hora_cita?.startsWith(fechaDelCuadradito));    //some es como filter pero devuelve true o false, si tiene citas ese dia aplicamos el estio css para que se pinte el dia.
            if (tieneCitas) {
                return 'dia-con-citas';
            }
        }
        return null;
    };


    return (
        <div className="flex flex-col gap-6 mt-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-[#172554] mb-4 text-center">Explorar Calendario</h2>
                <div className="flex justify-center custom-calendar-container">
                    <Calendar
                        onChange={setFechaSeleccionada}
                        value={fechaSeleccionada}
                        className="border-none"
                        tileClassName={marcarDiasConCitas}
                    />
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-xl font-bold text-[#172554]">
                        Sesiones del {fechaSeleccionada.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </h2>
                    <div className="bg-[#172554] text-white text-xs font-bold px-3 py-1 rounded-full">
                        {citasDelDia.length}
                    </div>
                </div>

                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-50 [scrollbar-gutter:stable]" >
                    {cargando ? (
                        <div className="text-center py-10 animate-pulse">
                            <p className="text- font-bold">Cargando tu agenda...</p>
                        </div>
                    ) : citasDelDia.length > 0 ? (
                        citasDelDia.map((cita) => (
                            <div key={cita.id_cita} className="group bg-gray-50 hover:bg-white hover:shadow-md border border-gray-100 p-4 rounded-xl transition-all duration-300 flex justify-between items-center">
                                <div className="flex gap-4 items-center">
                                    <span className="text-[#172554] font-bold text-lg">
                                        {new Date(cita.fecha_hora_cita).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <div>
                                        <p className="font-bold text-[#172554]">
                                            {cita.paciente ? `${cita.paciente.nombre_paciente} ${cita.paciente.apellidos_paciente}` : 'Paciente'}
                                        </p>
                                        <div className="flex gap-2 mt-1">
                                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-gray-200 text-gray-600 rounded">
                                                {cita.modalidad_cita}
                                            </span>
                                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                                                cita.estado_cita === 'Completada' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                                            }`}>
                                                {cita.estado_cita}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => setCitaEditando(cita)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                    </button>
                                    <button onClick={() => setCitaABorrar(cita)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl">
                            <p className="text-gray-400">No hay sesiones para este día.</p>
                        </div>
                    )}
                </div>
            </div>

            <EditarCita
                cita={citaEditando} onClose={() =>
                setCitaEditando(null)} />

            <EliminarCita
                cita={citaABorrar}
                onClose={() => setCitaABorrar(null)}
                onExito={(id) => setCitas(citas.filter(c => c.id_cita !== id))}
            />
        </div>

    );
}


