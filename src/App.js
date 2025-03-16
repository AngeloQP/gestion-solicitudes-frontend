import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import RegistroSolicitud from './components/solicitud/RegistroSolicitud';
import ListaSolicitud from './components/solicitud/ListaSolicitud';
import InfoSolicitud from './components/solicitud/InfoSolicitud';
import ListaContactos from './components/contacto/ListaContactos';
import RegistroContacto from "./components/contacto/RegistroContacto";

function App() {
    return (
        <Router>
            <div className="container-fluid bg-dark text-light min-vh-100">
                <header className="bg-secondary text-center py-3 mb-4">
                    <h1 className="text-white">Gestión de Solicitudes</h1>
                </header>
                <main className="container bg-dark p-4 rounded shadow">
                    <Routes>
                        <Route path="/" element={<ListaSolicitud />} />
                        <Route path="/solicitud/registro" element={<RegistroSolicitud />} />
                        <Route path="/solicitud/:codigo" element={<InfoSolicitud />} />
                        <Route path="/contacto" element={<ListaContactos />} />
                        <Route path="/contacto/registro" element={<RegistroContacto />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;

// Estilos adicionales usando Bootstrap
const InputField = ({ label, type, name, value, onChange }) => (
    <div className="mb-3">
        <label className="form-label">{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="form-control"
            required
        />
    </div>
);

const Button = ({ children, onClick, type = "button", className = "btn btn-primary" }) => (
    <button
        type={type}
        onClick={onClick}
        className={className}
    >
        {children}
    </button>
);

const Table = ({ headers, data, renderRow }) => (
    <div className="table-responsive">
        <table className="table table-dark table-striped">
            <thead>
            <tr>
                {headers.map((header, index) => (
                    <th key={index}>{header}</th>
                ))}
            </tr>
            </thead>
            <tbody>
            {data.map((item, index) => renderRow(item, index))}
            </tbody>
        </table>
    </div>
);

export { InputField, Button, Table };
