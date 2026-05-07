export default function ProximaCita({ cita }) {

    //si el paciente no tiene citas
    if (!cita) {
        return (
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center h-full min-h-[150px]">
                <div className="bg-gray-100 p-3 rounded-full text-gray-400 mb-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                </div>
                <h3 className="text-gray-500 font-bold text-lg">No hay citas próximas</h3>
                <p className="text-gray-400 text-sm mt-1">Cuando tengas una nueva sesión programada, aparecerá aquí.</p>
            </div>
        );
    }

    //si el paciente tiene citas
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow h-full">
            <div className="flex items-start gap-5">
                <div className="bg-[#82ca9c]/20 p-4 rounded-xl text-[#82ca9c]">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                </div>
                <div>
                    <h3 className="text-[#82ca9c] font-bold text-xs uppercase tracking-widest mb-1">
                        Tu Próxima Cita
                    </h3>
                    <p className="text-xl font-bold text-[#172554]">
                        Sesión {cita.modalidad_cita}
                    </p>
                    <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        {new Date(cita.fecha_hora_cita).toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    );
}