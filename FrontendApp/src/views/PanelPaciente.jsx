import React from 'react';
import Navbar from '../components/Navbar';
import ProximaCita from '../components/ProximaCita';
import ListaHistorial from '../components/ListaHistorial';

export default function PanelPaciente() {

    const citaDestacada = null;

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-10">

            <Navbar />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

                    <div className="lg:col-span-2">
                        <ProximaCita cita={citaDestacada} />
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
                        <button className="w-full bg-[#172554] hover:bg-[#0f172a] text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-md text-sm">
                            Ver todos los mensajes
                        </button>
                    </div>
                </div>

                <ListaHistorial/>

            </main>
        </div>
    );
}