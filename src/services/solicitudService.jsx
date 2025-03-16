import axios from 'axios';

const API_URL = 'http://localhost:8081/solicitudes';

/**
 * Registra una nueva solicitud en el sistema.
 * @param {Object} solicitud - El objeto que contiene la información de la solicitud.
 * @param {string} solicitud.marcaId - El ID de la marca asociada a la solicitud.
 * @param {string} solicitud.tipoSolicitudId - El ID del tipo de solicitud.
 * @param {string} solicitud.nombreContacto - El nombre del contacto relacionado con la solicitud.
 * @param {string} solicitud.numeroContacto - El número de contacto relacionado con la solicitud.
 * @param {Date} solicitud.fechaEnvio - La fecha de envío de la solicitud.
 * @returns {Promise} - La promesa de la solicitud HTTP.
 */
export const registrarSolicitud = (solicitud) => {
    return axios.post(API_URL, solicitud);
};

/**
 * Obtiene todas las solicitudes registradas en el sistema.
 * @returns {Promise<Array>} - La promesa de la solicitud HTTP con la lista de solicitudes.
 */
export const obtenerSolicitudes = () => {
    return axios.get(API_URL);
};

/**
 * Obtiene una solicitud específica por su código.
 * @param {string} codigo - El código único de la solicitud.
 * @returns {Promise<Object>} - La promesa de la solicitud HTTP con los datos de la solicitud.
 */
export const obtenerSolicitudPorCodigo = (codigo) => {
    return axios.get(`${API_URL}/${codigo}`);
};

/**
 * Exporta las solicitudes registradas en el sistema.
 * @returns {Promise} - La promesa de la solicitud HTTP para exportar las solicitudes.
 */
export const exportarSolicitudes = () => {
    return axios.get(`${API_URL}/export`);
};

/**
 * Elimina una solicitud del sistema.
 * @param {string} id - El ID de la solicitud que se desea eliminar.
 * @returns {Promise} - La promesa de la solicitud HTTP para eliminar la solicitud.
 */
export const eliminarSolicitud = (id) => {
    return axios.delete(`${API_URL}/${id}`);
};
