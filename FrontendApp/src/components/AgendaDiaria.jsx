import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { LoginContext } from '../context/LoginContext';

export default function AgendaDiaria() {
    const { token } = useContext(LoginContext);
    const [citasHoy, setCitasHoy] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        if (!token) return;

        const obtenerAgenda = async () => {
            try {
                const respuesta = await axios.get('http://backendapp.test/api/citas', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                //fecha de hoy en formato YYYY-MM-DD
                const hoy = new Date().toISOString().split('T')[0];

                // 2. Filtramos la lista para quedarnos solo con las que empiezan por la fecha de hoy
                const citasFiltradas = (respuesta.data.datos || []).filter(cita =>
                    cita.fecha_hora_cita.startsWith(hoy)
                );

                setCitasHoy(citasFiltradas);
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
            <div className="space-y-3">
                {citasHoy.length > 0 ? (
                    citasHoy.map((cita) => (
                        <div key={cita.id_cita} className="bg-white p-4 rounded-xl border-y border-r border-gray-200 border-l-4 border-l-[#82ca9c] shadow-sm">
                            <span className="text-xs font-bold text-[#82ca9c] uppercase tracking-wider">
                                {cita.modalidad_cita}
                            </span>
                            <h4 className="font-bold text-[#172554] text-lg mt-1">
                                {/* extraigo la hora de la cita */}
                                {new Date(cita.fecha_hora_cita).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </h4>
                            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                <span className={`w-2 h-2 rounded-full ${cita.estado_cita === 'Pendiente' ? 'bg-yellow-400' : 'bg-green-400'}`}></span>
                                {cita.estado_cita}
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="bg-white p-6 rounded-xl border border-dashed border-gray-300 text-center text-gray-400 text-sm">
                        No tienes citas programadas para hoy.
                    </div>
                )}
            </div>
        </div>
    );
}