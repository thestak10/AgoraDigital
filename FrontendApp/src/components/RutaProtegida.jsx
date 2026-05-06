import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { LoginContext } from '../context/LoginContext';


export default function RutaProtegida({ children }) {

    const { token } = useContext(LoginContext); //Comprobamos que el usuario tenga el token

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;    //si tenemos token mostramos el componente hijo
}