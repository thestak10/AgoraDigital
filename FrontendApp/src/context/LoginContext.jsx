/* eslint-disable react-refresh/only-export-components */ /*Elimino el error de resfresco rapido en LoginContext, no afecta nada tener o no esta linea, el codigo sigue funcionando, solo es para que no salga la linea roja de error */
import { createContext, useState } from 'react';

export const LoginContext = createContext(); //creamos el contenedor donde viaja LoginProvider

export const LoginProvider = ({children}) => {    //componente que inyecta los datos del useState (memoria de React) y localstorage (memoria del navegador)

    //recogemmos los datos de (localStorage) por si el usuario ya estaba logueado y lo metemos en la memoria de React, asi nos aseguramos que al recargar la pagina el usuario no se deslogue automaticamnete por borrado de memoria la refrescar
    const tokenGuardado = localStorage.getItem('token');
    const usuarioGuardado = JSON.parse(localStorage.getItem('usuario'));

    //asignamos los datos anteriores en la memoria de React
    const [token, setToken] = useState(tokenGuardado);
    const [usuario, setUsuario] = useState(usuarioGuardado);


    //funcion que guarda los datos del login
    const guardarLogin = (datosDelServidor) => {

        const usuarioCompleto = {
            ...datosDelServidor.user,           //operador spread (visto en clase) id_usuario, email_usuario, rol_usuario
            perfil: datosDelServidor.perfil_usuario //trae la info del perfil (nombre y apelidos).
        };

        //guardo en localstorage el token y los datos del usuario para asegurar la permanencia aunque se refesque la pagina
        localStorage.setItem('token', datosDelServidor.access_token);
        localStorage.setItem('usuario', JSON.stringify(usuarioCompleto));

        //guardamos los datos en la memoria del servidor
        setToken(datosDelServidor.access_token);
        setUsuario(usuarioCompleto);
    };

    //funcion pra elimminar sesion
    const cerrarSesionContexto = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        setToken(null);
        setUsuario(null);
    };

    return (
        <LoginContext.Provider value={{ token, usuario, guardarLogin,cerrarSesionContexto }}>
            {children}
        </LoginContext.Provider>
    );
};