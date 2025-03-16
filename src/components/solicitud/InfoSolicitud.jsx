import React, { useState, useEffect } from 'react';
import { obtenerSolicitudPorCodigo } from '../../services/solicitudService';
import { obtenerContactosPorSolicitud } from '../../services/contactoService';
import { useParams } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

/**
 * Componente para mostrar la información de una solicitud y sus contactos asociados.
 *
 * Este componente obtiene los detalles de una solicitud mediante su código, y permite visualizar los contactos
 * asociados a la solicitud en un modal al hacer clic en un botón.
 *
 * @component
 * @example
 * return (
 *   <InfoSolicitud />
 * )
 */
const InfoSolicitud = () => {
    const { codigo } = useParams(); // Obtiene el código de la solicitud de los parámetros de la URL.
    const [solicitud, setSolicitud] = useState(null); // Almacena la información de la solicitud.
    const [contactos, setContactos] = useState([]); // Almacena los contactos asociados a la solicitud.
    const [showModal, setShowModal] = useState(false); // Controla la visibilidad del modal.

    /**
     * Efecto que obtiene la información de la solicitud utilizando su código.
     *
     * Al montar el componente, realiza una llamada a la API para obtener los detalles de la solicitud.
     */
    useEffect(() => {
        obtenerSolicitudPorCodigo(codigo)
            .then((response) => setSolicitud(response.data))
            .catch((error) => console.error('Error al obtener la solicitud:', error));
    }, [codigo]);

    /**
     * Maneja la visualización de los contactos asociados a la solicitud.
     *
     * Realiza una llamada a la API para obtener los contactos de la solicitud
     * y abre el modal con la lista de contactos.
     *
     * @param {string} solicitudId - El ID de la solicitud para obtener los contactos.
     * @returns {void}
     */
    const handleViewContacts = async (solicitudId) => {
        try {
            const response = await obtenerContactosPorSolicitud(solicitudId);
            setContactos(response.data);
            setShowModal(true);
        } catch (error) {
            console.error('Error al obtener los contactos de la solicitud:', error);
        }
    };

    return (
        <div className="container bg-dark text-light p-4 rounded shadow">
            <h2 className="text-center mb-4">Información de la Solicitud</h2>
            {solicitud ? (
                <div className="card bg-secondary text-white p-3">
                    <p><strong>Código:</strong> {solicitud.codigo}</p>
                    <p><strong>Marca:</strong> {solicitud.marcaDescripcion}</p>
                    <p><strong>Tipo de Solicitud:</strong> {solicitud.tipoSolicitudDescripcion}</p>
                    <p><strong>Fecha de Envío:</strong> {solicitud.fechaEnvio}</p>
                    <p><strong>Nombre de Contacto:</strong> {solicitud.nombreContacto}</p>
                    <p><strong>Número de Contacto:</strong> {solicitud.numeroContacto}</p>
                    <p>
                        <button className="btn btn-info btn-sm me-2"
                                onClick={() => handleViewContacts(solicitud.id)}>Ver Contactos Asociados
                        </button>
                    </p>
                </div>
            ) : (
                <p className="text-center">Cargando...</p>
            )}

            {/* Modal para mostrar los contactos asociados */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Contactos Asociados</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {contactos.length > 0 ? (
                        <ul className="list-group">
                            {contactos.map((contacto, index) => (
                                <li key={index} className="list-group-item bg-dark text-light">
                                    {contacto.nombreContacto} - {contacto.numeroContacto}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No hay contactos asociados.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default InfoSolicitud;
