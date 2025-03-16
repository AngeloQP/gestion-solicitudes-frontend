import axios from 'axios';

const API_URL = 'http://localhost:8081/contactos';

/**
 * Registra un nuevo contacto en el sistema.
 * @param {Object} contacto - El objeto que contiene la información del contacto.
 * @param {string} contacto.nombreContacto - El nombre del contacto.
 * @param {string} contacto.numeroContacto - El número de contacto.
 * @returns {Promise} - La promesa de la solicitud HTTP.
 */
export const registrarContacto = (contacto) => {
    return axios.post(API_URL, contacto);
};

/**
 * Obtiene todos los contactos registrados en el sistema.
 * @returns {Promise} - La promesa de la solicitud HTTP con los datos de los contactos.
 */
export const obtenerContactos = () => {
    return axios.get(API_URL);
};

/**
 * Elimina un contacto del sistema.
 * @param {string} id - El ID del contacto a eliminar.
 * @returns {Promise} - La promesa de la solicitud HTTP.
 */
export const eliminarContacto = (id) => {
    return axios.delete(`${API_URL}/${id}`);
};

/**
 * Obtiene los contactos asociados a una solicitud específica.
 * @param {string} solicitudId - El ID de la solicitud de la cual se desean obtener los contactos.
 * @returns {Promise} - La promesa de la solicitud HTTP con los contactos asociados a la solicitud.
 */
export const obtenerContactosPorSolicitud = (solicitudId) => {
    return axios.get(`${API_URL}/${solicitudId}`);
};
