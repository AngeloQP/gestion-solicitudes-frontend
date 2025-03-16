import React, { useState, useEffect } from 'react';
import { obtenerContactos } from '../../services/contactoService';

/**
 * Componente que muestra la lista de contactos.
 *
 * Utiliza el hook `useState` para almacenar los contactos y `useEffect`
 * para obtener los contactos desde un servicio cuando el componente se monta.
 *
 * @component
 * @example
 * return (
 *   <ListaContactos />
 * )
 */
const ListaContactos = () => {
    // Estado para almacenar los contactos
    const [contactos, setContactos] = useState([]);

    /**
     * Efecto que obtiene los contactos al montar el componente.
     *
     * Llama a la función `obtenerContactos` para hacer una solicitud al backend
     * y actualizar el estado con los datos obtenidos.
     */
    useEffect(() => {
        obtenerContactos()
            .then((response) => setContactos(response.data))
            .catch((error) => console.error('Error al obtener los contactos:', error));
    }, []);

    return (
        <div className="container bg-dark text-light p-4 rounded shadow">
            <h2 className="text-center mb-4">Lista de Contactos</h2>
            <div className="table-responsive">
                <table className="table table-dark table-striped">
                    <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Número de Contacto</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {contactos.map((contacto) => (
                        <tr key={contacto.id}>
                            <td>{contacto.nombreContacto}</td>
                            <td>{contacto.numeroContacto}</td>
                            <td>
                                <button className="btn btn-danger btn-sm">Eliminar</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListaContactos;
