import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import '../styles/MascotaCard.css';

const MascotaCard = ({ mascota }) => {
    const [mostrarModal, setMostrarModal] = useState(false);
    const navigate = useNavigate();

    const handleVerDetalles = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setMostrarModal(true);
        } else {
            navigate(`/mascotas/${mascota.id}`);
        }
    };

    return (
        <>
            {mostrarModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Debes estar autenticado</h3>
                        <p>Para ver los detalles de una mascota debes iniciar sesión o registrarte.</p>
                        <div className="modal-actions">
                            <button onClick={() => navigate('/registrarse')} className="modal-button">
                                Ir a registrarse
                            </button>
                            <button onClick={() => setMostrarModal(false)} className="modal-cancel">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="mascota-card">
                <img src={`http://localhost:5000/uploads/${mascota.foto}`} alt={mascota.nombre} />
                <h2>{mascota.nombre}</h2>
                <p>{mascota.especie} - {mascota.raza}</p>
                <p>Edad: {mascota.edad} años</p>
                <p>{mascota.descripcion}</p>
                <button onClick={handleVerDetalles} className="btn-primary">
                    Ver Detalles
                </button>
            </div>
        </>
    );
};

export default MascotaCard;
