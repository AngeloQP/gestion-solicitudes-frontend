import axios from 'axios';

const API_URL = 'http://localhost:8081/marca';

/**
 * Obtiene todas las marcas desde la API.
 * @returns {Promise<Array>} - Una promesa que resuelve en una lista de marcas.
 * Si ocurre un error, se devuelve un arreglo vacío.
 */
export const obtenerMarcas = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error al obtener las marcas:', error);
        return [];
    }
};
