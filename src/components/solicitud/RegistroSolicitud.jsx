import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registrarSolicitud } from '../../services/solicitudService';
import { registrarContacto } from "../../services/contactoService";
import { obtenerMarcas } from '../../services/marcaService';
import { obtenerTipoSolicitudes } from '../../services/tipoSolicitudService';
import { Modal, Button } from 'react-bootstrap';
import * as validators from '../../utils/validators';
import { validateTelefono } from "../../utils/validators";

/**
 * Componente para registrar una solicitud con contactos.
 * Permite seleccionar una marca, tipo de solicitud, agregar contactos y registrar la solicitud.
 * @component
 */
const RegistroSolicitud = () => {
    const [formData, setFormData] = useState({
        marcaId: '',
        tipoSolicitudId: '',
        nombreContacto: '',
        numeroContacto: '',
        fechaEnvio: new Date(),
        contactos: [],
    });

    const [marcas, setMarcas] = useState([]);
    const [tiposSolicitud, setTiposSolicitud] = useState([]);
    const [nuevoContacto, setNuevoContacto] = useState({ nombreContacto: '', numeroContacto: '' });
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    /**
     * Carga los datos iniciales de marcas y tipos de solicitud.
     * Utiliza un hook useEffect para ejecutar la carga de datos una sola vez.
     */
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const [marcasRes, tiposRes] = await Promise.all([obtenerMarcas(), obtenerTipoSolicitudes()]);
                setMarcas(marcasRes || []);
                setTiposSolicitud(tiposRes || []);
            } catch (error) {
                console.error('Error al obtener datos:', error);
                setMarcas([]);
                setTiposSolicitud([]);
            }
        };
        cargarDatos();
    }, []);

    /**
     * Maneja los cambios en los campos del formulario.
     * @param {Object} e - El evento del cambio.
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    /**
     * Maneja el cambio en el selector de la fecha de envío.
     * @param {Date} date - La nueva fecha seleccionada.
     */
    const handleDateChange = (date) => {
        setFormData((prevData) => ({
            ...prevData,
            fechaEnvio: date
        }));
    };

    /**
     * Agrega un nuevo contacto al estado de la solicitud.
     * Valida que el nombre y número de contacto no estén vacíos.
     */
    const handleAddContacto = () => {
        if (!nuevoContacto.nombreContacto || !nuevoContacto.numeroContacto) return;

        setFormData((prevData) => ({
            ...prevData,
            contactos: [...prevData.contactos, nuevoContacto]
        }));

        setNuevoContacto({ nombreContacto: '', numeroContacto: '' }); // Reset
        setShowModal(false);
    };

    /**
     * Elimina un contacto de la lista de contactos.
     * @param {number} index - El índice del contacto a eliminar.
     */
    const handleRemoveContacto = (index) => {
        setFormData((prevData) => ({
            ...prevData,
            contactos: prevData.contactos.filter((_, i) => i !== index)
        }));
    };

    /**
     * Maneja el envío del formulario de solicitud y registros de contactos.
     * Registra la solicitud y los contactos asociados en el backend.
     * @param {Object} e - El evento de envío del formulario.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await registrarSolicitud(formData);
            if (!response.data) throw new Error("Error en la respuesta del servidor");

            const solicitudId = response.data.id;

            await Promise.all(
                formData.contactos.map(contacto =>
                    registrarContacto({
                        solicitudId,
                        nombreContacto: contacto.nombreContacto,
                        numeroContacto: contacto.numeroContacto
                    })
                )
            );

            alert('Solicitud y contactos registrados con éxito');
            navigate('/');
        } catch (error) {
            console.error('Error al registrar la solicitud y contactos:', error);
        }
    };

    /**
     * Maneja los cambios en el campo de número de contacto, validando el número ingresado.
     * @param {Object} event - El evento de cambio.
     */
    const handleInputChange = (event) => {
        const { name, value } = event.target;

        if (name === 'numeroContacto') {
            if (value.length <= 9 && validateTelefono(value)) {
                setFormData((prevData) => ({
                    ...prevData,
                    [name]: value
                }));
            }
        }
    };

    return (
        <div className="container bg-dark text-light p-4 rounded shadow">
            <h2 className="text-center mb-4">Registrar Solicitud</h2>
            <form onSubmit={handleSubmit} className="bg-secondary p-4 rounded">

                {/* Marca */}
                <div className="mb-3">
                    <label className="form-label">Marca:</label>
                    <select name="marcaId" value={formData.marcaId} onChange={handleChange} className="form-control" required>
                        <option value="">Seleccione una marca</option>
                        {marcas.length > 0 ? (
                            marcas.map((marca) => (
                                <option key={marca.id} value={marca.id}>{marca.descripcion}</option>
                            ))
                        ) : (
                            <option disabled>Cargando...</option>
                        )}
                    </select>
                </div>

                {/* Tipo de Solicitud */}
                <div className="mb-3">
                    <label className="form-label">Tipo de Solicitud:</label>
                    <select name="tipoSolicitudId" value={formData.tipoSolicitudId} onChange={handleChange} className="form-control" required>
                        <option value="">Seleccione un tipo de solicitud</option>
                        {tiposSolicitud.length > 0 ? (
                            tiposSolicitud.map((tipo) => (
                                <option key={tipo.id} value={tipo.id}>{tipo.descripcion}</option>
                            ))
                        ) : (
                            <option disabled>Cargando...</option>
                        )}
                    </select>
                </div>

                {/* Nombre de Contacto */}
                <div className="mb-3">
                    <label className="form-label">Nombre del Contacto:</label>
                    <input
                        type="text"
                        name="nombreContacto"
                        value={formData.nombreContacto}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                {/* Número de Contacto */}
                <div className="mb-3">
                    <label className="form-label">Número de Contacto:</label>
                    <input
                        type="text"
                        name="numeroContacto"
                        value={formData.numeroContacto}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                    />
                </div>

                {/* Fecha de Envío */}
                <div className="mb-3">
                    <label className="form-label">Fecha de Envío:</label>
                    <DatePicker
                        selected={formData.fechaEnvio}
                        onChange={handleDateChange}
                        className="form-control"
                        dateFormat="yyyy-MM-dd"
                        required
                    />
                </div>

                {/* Contactos Añadidos */}
                <div className="mb-3">
                    <h5>Contactos Añadidos:</h5>
                    <ul className="list-group">
                        {formData.contactos.map((contacto, index) => (
                            <li key={index} className="list-group-item bg-dark text-light d-flex justify-content-between">
                                {contacto.nombreContacto} - {contacto.numeroContacto}
                                <button type="button" className="btn btn-danger btn-sm" onClick={() => handleRemoveContacto(index)}>Eliminar</button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Botón para agregar contacto */}
                <div className="text-center mt-3">
                    <Button variant="btn btn-primary w-100" onClick={() => setShowModal(true)}>Añadir Contacto</Button>
                </div>

                {/* Botón para registrar solicitud */}
                <div className="text-center mt-3">
                    <button type="submit" className="btn btn-success w-100">Registrar Solicitud</button>
                </div>
            </form>

            {/* Modal para agregar contacto */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Contacto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label className="form-label">Nombre del Contacto:</label>
                        <input type="text" value={nuevoContacto.nombreContacto}
                               onChange={(e) => setNuevoContacto({ ...nuevoContacto, nombreContacto: e.target.value })}
                               className="form-control" required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Número de Contacto:</label>
                        <input type="text" value={nuevoContacto.numeroContacto} onChange={(e) => setNuevoContacto({ ...nuevoContacto, numeroContacto: e.target.value })} className="form-control" required />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
                    <Button variant="primary" onClick={handleAddContacto}>Añadir</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default RegistroSolicitud;
