import axios from 'axios';

const API_URL = 'http://localhost:8081/tipoSolicitud';

/**
 * Obtiene todos los tipos de solicitud desde la API.
 * @returns {Promise<Array>} - Una promesa que resuelve en una lista de tipos de solicitud.
 * Si ocurre un error, se devuelve un arreglo vacío.
 */
export const obtenerTipoSolicitudes = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error al obtener los tipos de solicitud:', error);
        return [];
    }
};
