//src/pages/Mascotas.js
import React, { useState } from 'react';
import { getMascotas, createMascota } from '../api/api';
import MascotaCard from '../components/MascotaCard';
import MascotaForm from '../components/MascotaForm';
import '../styles/Mascotas.css';

const Mascotas = () => {
    const [mascotas, setMascotas] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [mostrarModal, setMostrarModal] = useState(false);
    const usuario_id = localStorage.getItem("userId");



    React.useEffect(() => {
        const usuario_id = localStorage.getItem("userId");
        if (!usuario_id) {
            setMostrarModal(true);
        }
    }, []);
    
    // Cargar las mascotas al iniciar
    React.useEffect(() => {
        const fetchMascotas = async () => {
            try {
                const data = await getMascotas();
                setMascotas(data);
            } catch (error) {
                console.error('Error al cargar las mascotas:', error);
            }
        };
        fetchMascotas();
    }, []);

    // Manejar la publicación de una nueva mascota
    const handlePublicarMascota = async (mascota) => {
        try {
            const nuevaMascota = await createMascota(mascota);
            setMascotas([...mascotas, nuevaMascota]); // Actualizar la lista de mascotas
            setShowForm(false); // Cerrar el formulario
        } catch (error) {
            console.error('Error al publicar la mascota:', error);
        }
    };

    return (

        <>
            {mostrarModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Debes estar autenticado</h3>
                        <p>Para publicar una mascota debes iniciar sesión o registrarte.</p>
                        <div className="modal-actions">
                        <button onClick={() => window.location.href = "/registrarse"} className="modal-button">
                                Ir a registrarse
                            </button>
                            <button onClick={() => setMostrarModal(false)} className="modal-cancel">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        
        <div className="mascotas">
            <h1>Mascotas Disponibles</h1>
                        <button
                className="btn-publicar"
                onClick={() => {
                    const usuario_id = localStorage.getItem("userId");
                    if (!usuario_id) {
                        setMostrarModal(true);
                    } else {
                        setShowForm(true);
                    }
                }}
            >
                Publicar Aquí
            </button>

            {showForm && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>¿TIENES UNA MASCOTA PARA DAR EN ADOPCIÓN?</h2>
                        <p>
                            En <strong>ADOPCIÓN sin hogar</strong> te ayudamos a que le puedas conseguir un hogar a los peludos que no lo tengan. Si tienes una mascota que estés dando en adopción también lo puedes hacer, pero antes de empezar ten en cuenta las siguientes recomendaciones:
                        </p>
                        <ul>
                            <li>Debes tomar las fotos con buena luz, enfocadas, con buena resolución y que se vea el perro o gato perfectamente.</li>
                            <li>Debes registrarte en <strong>ADOPCIÓN sin Hogar</strong> y suministrar datos de contacto claros, los cuales serán verificados por nosotros.</li>
                            <li>En caso que la información suministrada no esté completa o tenga errores, no se podrá ver publicada en la página.</li>
                        </ul>
                        <MascotaForm onSubmit={handlePublicarMascota} onCancel={() => setShowForm(false)} />
                    </div>
                </div>
            )}

            <div className="mascota-list">
                {mascotas.length > 0 ? (
                    mascotas.map(mascota => (
                        <MascotaCard key={mascota.id} mascota={mascota} />
                    ))
                ) : (
                    <p>No hay mascotas disponibles.</p>
                )}
            </div>
        </div>
        </>
    );
    
};

export default Mascotas;