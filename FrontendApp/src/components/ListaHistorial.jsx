export default function ListaHistorial() {
    return (
        <div className="mt-10">
            <h2 className="text-2xl font-bold text-[#172554] mb-6">Próximas Citas</h2>

            {/* Aquí iteraremos sobre las citas con un map */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg text-[#172554]">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-800">Cargando tus citas...</h4>
                        <p className="text-sm text-gray-500">Conectando con el servidor</p>
                    </div>
                </div>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                    Pendiente
                </span>
            </div>
        </div>
    );
}