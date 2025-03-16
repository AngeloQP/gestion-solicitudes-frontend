import React, { useState } from 'react';
import { registrarContacto } from '../../services/contactoService';

/**
 * Componente para registrar un nuevo contacto.
 *
 * Este componente permite ingresar el nombre y número de contacto en un formulario y, al enviarlo, registra el nuevo contacto
 * a través de una API externa.
 *
 * @component
 * @example
 * return (
 *   <RegistroContacto />
 * )
 */
const RegistroContacto = () => {
    // Estado para almacenar los datos del contacto
    const [contacto, setContacto] = useState({
        nombreContacto: '',
        numeroContacto: ''
    });

    /**
     * Maneja los cambios en los campos del formulario.
     *
     * @param {Object} e - El evento de cambio del formulario.
     * @returns {void}
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setContacto((prevContacto) => ({
            ...prevContacto,
            [name]: value
        }));
    };

    /**
     * Maneja el envío del formulario.
     *
     * Llama a la función `registrarContacto` para registrar el nuevo contacto y, si tiene éxito, limpia el formulario.
     *
     * @param {Object} e - El evento de envío del formulario.
     * @returns {void}
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await registrarContacto(contacto);
            console.log('Contacto registrado:', response.data);
            setContacto({ nombreContacto: '', numeroContacto: '' });
        } catch (error) {
            console.error('Error al registrar el contacto:', error);
        }
    };

    return (
        <div className="container bg-dark text-light p-4 rounded shadow">
            <h3 className="text-center mb-4">Registrar Contacto</h3>
            <form onSubmit={handleSubmit} className="bg-secondary p-4 rounded">
                <div className="mb-3">
                    <label className="form-label">Nombre del Contacto:</label>
                    <input
                        type="text"
                        name="nombreContacto"
                        value={contacto.nombreContacto}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Número de Contacto:</label>
                    <input
                        type="text"
                        name="numeroContacto"
                        value={contacto.numeroContacto}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="text-center">
                    <button type="submit" className="btn btn-primary w-100">Agregar Contacto</button>
                </div>
            </form>
        </div>
    );
};

export default RegistroContacto;
