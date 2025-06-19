// frontend/src/pages/PublicarMascota.js
import React from 'react';
import MascotaForm from '../components/MascotaForm';
import '../styles/MascotaForm.css'; // Usará los estilos del formulario

const PublicarMascota = () => {
    return (
        <div className="page-container"> {/* Un contenedor general para la página si no quieres que el form sea full-width */}
            <MascotaForm />
        </div>
    );
};

export default PublicarMascota;