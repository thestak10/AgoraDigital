import axios from 'axios';

const API_URL = 'http://backendapp.test/api';

export const loginUsuario = async (email, password) => {

    try {
        const respuesta = await axios.post(`${API_URL}/login`, {
            email: email,
            password: password
        });

        // si laravel responde con el codigo 200 , devuelvo los datos (Token y usuario)
        return respuesta.data;

    } catch (error) {
        
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message || 'Error al iniciar sesión', { cause: error });
        }
        throw new Error('Error de conexión con el servidor', { cause: error });
    }
};