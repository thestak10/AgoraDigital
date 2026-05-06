import Navbar from '../components/Navbar';

export default function PanelProfesional() {


    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <main className="p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    Mi Panel de Profesional
                </h1>

                <div className="bg-white p-6 rounded-lg shadow">
                    <p>Aquí irán tus próximas sesiones, listadoi de pacientes...</p>
                </div>
            </main>
        </div>
    );
}