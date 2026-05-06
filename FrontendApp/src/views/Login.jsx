import { useState,useContext } from 'react';
import logo from '../assets/logo.png';
import { loginUsuario } from '../services/loginService.js';
import { LoginContext } from '../context/LoginContext.jsx';

import { useNavigate } from 'react-router-dom';


export default function Login() {

    const [email, setEmail] = useState('');         //variables en las que guardaremos los datos del formulario del login
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { guardarLogin } = useContext(LoginContext); //exportamos la funcion guardarLogin para guardar los datos en useState y localStorage

    const navigate = useNavigate();
    const formularioLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Llamamos al loginService pasando el email y la contraseña del login

            const datosDelServidor = await loginUsuario(email, password);
            const rolDelUsuario = Number(datosDelServidor.user.rol_usuario);

            guardarLogin(datosDelServidor);

            console.log("El usuario completo es:", datosDelServidor.user);
            console.log("El rol detectado es:", rolDelUsuario);

            if (rolDelUsuario === 1) {
                navigate('/panel-admin');
            } else if (rolDelUsuario === 2) {
                navigate('/panel-profesional');
            } else if (rolDelUsuario === 3) {
                navigate('/panel-paciente');
            } else {

                setError('Rol de usuario no encontrado');
            }


        } catch (err) {
            // Si falla, guardamos el mensaje de error para mostrarlo en pantalla
            setError(err.message);
        }
    };

    return (
        <div className="flex min-h-screen font-sans">
            {/*contenedor de bienvenida */}
            <div className="hidden lg:flex w-1/2 bg-[#172554] text-white flex-col justify-center px-20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                <div className="relative z-10">
                    <h1 className="text-5xl font-bold mb-6 leading-tight">
                        Bienvenido a <br/>
                        <span className="text-[#82ca9c]">Ágora Digital</span>
                    </h1>
                    <p className="text-lg text-blue-200 max-w-md">
                        Gestiona tus citas, pacientes y consultas de forma centralizada.
                        Optimiza tu tiempo y ofrece la mejor atención psicológica.
                    </p>
                </div>

                <div className="absolute bottom-8 left-20 text-sm text-blue-300">
                    © 2026 Ágora Digital. Todos los derechos reservados.
                </div>
            </div>

            {/*contenedor del login */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-white px-8 md:px-20">

                <div className="w-full max-w-md">
                    <img src={logo} alt="Logo Ágora Digital" className="h-32 w-56 mb-10 object-contain" />

                    <h2 className="text-3xl font-bold text-gray-900 mb-2">¡Hola de nuevo!</h2>
                    <p className="text-gray-500 mb-8">
                        Acceso exclusivo para pacientes y profesionales.
                    </p>

                    {error && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md" role="alert">
                            <p>{error}</p>
                        </div>
                    )}
                    <form onSubmit={formularioLogin} className="space-y-6">

                        <div>
                            <input
                                type="email"
                                className="w-full py-2 border-b-2 border-gray-200 focus:border-[#172554] outline-none transition-colors text-gray-700 bg-transparent"
                                placeholder="Escribe aquí tu correo"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <input
                                type="password"
                                className="w-full py-2 border-b-2 border-gray-200 focus:border-[#172554] outline-none transition-colors text-gray-700 bg-transparent"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {/* Enlace recuperar contraseña, lo añado ya que es una de las cosas a mejorar en un futuro*/}
                        <div className="flex justify-end">
                            <a href="#" className="text-sm text-gray-500 hover:text-[#172554] font-medium transition-colors">
                                ¿Has olvidado tu contraseña?
                            </a>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#172554] hover:bg-[#0f172a] text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-md"
                        >
                            Iniciar Sesión
                        </button>

                    </form>
                </div>

            </div>
        </div>
    );
}