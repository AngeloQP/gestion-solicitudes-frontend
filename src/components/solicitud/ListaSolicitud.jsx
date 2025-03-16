import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerSolicitudes, eliminarSolicitud, exportarSolicitudes } from '../../services/solicitudService';
import { Modal, Button } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { format } from 'date-fns';

/**
 * Componente que muestra una lista de solicitudes con filtros y opciones de acción.
 *
 * Este componente permite visualizar las solicitudes, filtrarlas por fecha y tipo, eliminar solicitudes,
 * y exportarlas a un archivo CSV.
 *
 * @component
 * @example
 * return (
 *   <ListaSolicitudes />
 * )
 */
const ListaSolicitudes = () => {
    const [solicitudes, setSolicitudes] = useState([]); // Lista de solicitudes.
    const [contactos, setContactos] = useState([]); // Lista de contactos asociados a una solicitud.
    const [showModal, setShowModal] = useState(false); // Controla la visibilidad del modal de contactos.
    const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null); // Solicitud seleccionada para mostrar sus contactos.
    const [filtroFechaInicio, setFiltroFechaInicio] = useState(''); // Filtro de fecha de inicio.
    const [filtroFechaFin, setFiltroFechaFin] = useState(''); // Filtro de fecha de fin.
    const [filtroTipo, setFiltroTipo] = useState(''); // Filtro de tipo de solicitud.
    const navigate = useNavigate(); // Navegador para redirigir a otras vistas.

    /**
     * Columnas de la tabla de solicitudes.
     *
     * Cada columna tiene un nombre y un selector que indica cómo obtener el valor de cada celda.
     */
    const columns = [
        {
            name: 'Código',
            selector: row => row.codigo,
            cell: row => (
                <div>
                    <button className="btn btn-link text-dark p-0"
                            onClick={() => navigate(`/solicitud/${row.codigo}`)}>
                        {row.codigo}
                    </button>
                </div>
            ),
            sortable: true,
        },
        {
            name: 'Marca',
            selector: row => row.marcaDescripcion,
            sortable: true,
        },
        {
            name: 'Tipo de Solicitud',
            selector: row => row.tipoSolicitudDescripcion,
            sortable: true,
        },
        {
            name: 'Fecha de Envío',
            selector: row => format(new Date(row.fechaEnvio), 'dd-MM-yyyy'),
            sortable: true,
        },
        {
            name: 'Nombre de Contacto',
            selector: row => row.nombreContacto,
            sortable: true,
        },
        {
            name: 'Número de Contacto',
            selector: row => row.numeroContacto,
            sortable: true,
        },
        {
            name: 'Acciones',
            cell: row => (
                <div>
                    <button className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteSolicitud(row.id)}>Eliminar
                    </button>
                </div>
            ),
        }
    ];

    /**
     * Efecto que obtiene las solicitudes al montar el componente.
     *
     * Realiza una llamada a la API para obtener las solicitudes.
     */
    useEffect(() => {
        obtenerSolicitudes()
            .then((response) => setSolicitudes(response.data))
            .catch((error) => console.error('Error al obtener las solicitudes:', error));
    }, []);

    /**
     * Carga las solicitudes nuevamente desde la API.
     *
     * Este método se llama después de eliminar una solicitud para actualizar la lista.
     */
    const cargarSolicitudes = () => {
        obtenerSolicitudes()
            .then((response) => setSolicitudes(response.data))
            .catch((error) => console.error('Error al obtener las solicitudes:', error));
    };

    /**
     * Maneja la eliminación de una solicitud.
     *
     * Muestra una confirmación antes de eliminar la solicitud y luego actualiza la lista.
     *
     * @param {string} solicitudId - El ID de la solicitud a eliminar.
     * @returns {void}
     */
    const handleDeleteSolicitud = async (solicitudId) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta solicitud?')) {
            try {
                await eliminarSolicitud(solicitudId);
                alert('Solicitud eliminada correctamente');
                cargarSolicitudes();
            } catch (error) {
                console.error('Error al eliminar la solicitud:', error);
            }
        }
    };

    /**
     * Exporta las solicitudes a un archivo CSV.
     *
     * Realiza una llamada a la API para obtener las solicitudes y luego las exporta como un archivo CSV.
     *
     * @returns {void}
     */
    const handleExportarSolicitudes = async () => {
        try {
            const response = await exportarSolicitudes();
            const blob = new Blob([response.data], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'solicitudes.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error al exportar las solicitudes:', error);
        }
    };

    /**
     * Filtra las solicitudes basándose en los criterios de fecha y tipo.
     *
     * Filtra las solicitudes por fecha de envío y tipo de solicitud.
     *
     * @returns {Array} - Lista de solicitudes filtradas.
     */
    const solicitudesFiltradas = solicitudes.filter(solicitud => {
        const fechaEnvio = solicitud.fechaEnvio ? new Date(solicitud.fechaEnvio) : null;
        const inicio = filtroFechaInicio ? new Date(filtroFechaInicio) : null;
        const fin = filtroFechaFin ? new Date(filtroFechaFin) : null;
        const tipoSolicitud = solicitud.tipoSolicitudDescripcion?.toLowerCase() || '';

        return (
            (!inicio || (fechaEnvio && fechaEnvio >= inicio)) &&
            (!fin || (fechaEnvio && fechaEnvio <= fin)) &&
            (!filtroTipo || tipoSolicitud.includes(filtroTipo.toLowerCase()))
        );
    });

    return (
        <div className="container bg-dark text-light p-4 rounded shadow">
            <h2 className="text-center mb-4">Lista de Solicitudes</h2>
            <div className="d-flex justify-content-end mb-3">
                <button className="btn btn-success me-2" onClick={() => navigate('/solicitud/registro')}>Nueva
                    Solicitud
                </button>
                <button className="btn btn-primary" onClick={handleExportarSolicitudes}>Exportar CSV</button>
            </div>
            <div className="row mb-3">
                <div className="col-md-4">
                    <label className="form-label">Fecha Inicio:</label>
                    <input type="date" className="form-control" value={filtroFechaInicio}
                           onChange={(e) => setFiltroFechaInicio(e.target.value)} />
                </div>
                <div className="col-md-4">
                    <label className="form-label">Fecha Fin:</label>
                    <input type="date" className="form-control" value={filtroFechaFin}
                           onChange={(e) => setFiltroFechaFin(e.target.value)} />
                </div>
                <div className="col-md-4">
                    <label className="form-label">Tipo de Solicitud:</label>
                    <input type="text" className="form-control" value={filtroTipo}
                           onChange={(e) => setFiltroTipo(e.target.value)} />
                </div>
            </div>
            <div className="table-responsive">
                {solicitudesFiltradas.length === 0 ? (
                    <p style={{ textAlign: 'center' }}>No hay solicitudes disponibles.</p>
                ) : (
                    <DataTable
                        columns={columns}
                        data={solicitudesFiltradas}
                        defaultSortFieldId={1}
                    />
                )}
            </div>

            {/* Modal para mostrar los contactos asociados a una solicitud */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Contactos de la Solicitud {solicitudSeleccionada}</Modal.Title>
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

export default ListaSolicitudes;
