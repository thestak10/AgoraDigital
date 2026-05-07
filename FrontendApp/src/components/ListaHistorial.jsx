export default function ListaHistorial({ citas }) {

    if (!citas || citas.length === 0) {
        return (
            <div className="mt-10">
                <h2 className="text-2xl font-bold text-[#172554] mb-6">Historial de Sesiones</h2>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center text-gray-500">
                    Aún no tienes sesiones en tu historial.
                </div>
            </div>
        );
    }

    const colorEstado = (estado) => { //colores de los distintos estados
        switch (estado) {
            case 'Completada': return 'bg-green-100 text-green-700';
            case 'Cancelada': return 'bg-red-100 text-red-700';
            case 'Pendiente': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="mt-10">
            <h2 className="text-2xl font-bold text-[#172554] mb-6">Historial de Sesiones</h2>

            <div className="space-y-4">
                {citas.map((cita) => (
                    <div key={cita.id_cita} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 hover:border-[#82ca9c] transition-colors">

                        <div className="flex items-center gap-4">

                            <div className="bg-blue-50 p-3 rounded-lg text-[#172554]">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                            </div>

                            {/* Datos de la cita */}
                            <div>
                                <h4 className="font-bold text-gray-800">
                                    Sesión {cita.modalidad_cita}
                                </h4>
                                <p className="text-sm text-gray-500">
                                    {new Date(cita.fecha_hora_cita).toLocaleDateString()} a las {new Date(cita.fecha_hora_cita).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>

                        {/* Etiqueta de estado dinámica */}
                        <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${colorEstado(cita.estado_cita)}`}>
                            {cita.estado_cita}
                        </span>

                    </div>
                ))}
            </div>
        </div>
    );
}