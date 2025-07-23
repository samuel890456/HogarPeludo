// frontend/src/pages/PublicarMascota.js
import React from 'react';
import MascotaForm from '../components/MascotaForm';


const PublicarMascota = () => {
    return (
        <div className="container mx-auto p-4"> {/* Un contenedor general para la página si no quieres que el form sea full-width */}
            <MascotaForm />
        </div>
    );
};

export default PublicarMascota;