import Navbar from '../components/Navbar';

export default function PanelPaciente() {


    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <main className="p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    Mi Panel de Paciente
                </h1>

                <div className="bg-white p-6 rounded-lg shadow">
                    <p>Aquí irán tus próximas citas y tareas de terapia...</p>
                </div>
            </main>
        </div>
    );
}