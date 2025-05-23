import React, { useState } from 'react';
import '../styles/MascotaForm.css';

const MascotaForm = ({ onSubmit, onCancel }) => {
    const [nombre, setNombre] = useState('');
    const [especie, setEspecie] = useState('');
    const [raza, setRaza] = useState('');
    const [edad, setEdad] = useState('');
    const [genero, setGenero] = useState('');
    const [tamaño, setTamaño] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [foto, setFoto] = useState(null);
    const [fotoPreview, setFotoPreview] = useState('');
    const [mostrarModal, setMostrarModal] = useState(false);

    const handleFotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFoto(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setFotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const usuario_id = localStorage.getItem("userId");
        if (!usuario_id) {
            setMostrarModal(true);
            return;
        }

        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('especie', especie);
        formData.append('raza', raza);
        formData.append('edad', edad);
        formData.append('genero', genero);
        formData.append('tamaño', tamaño);
        formData.append('descripcion', descripcion);
        formData.append('estado', 'Disponible');
        formData.append('usuario_id', usuario_id);
        if (foto) {
            formData.append('foto', foto);
        }

        console.log("Datos enviados desde el frontend:", Object.fromEntries(formData));
        onSubmit(formData);
    };

    return (
        <>
            {mostrarModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Debes estar autenticado</h3>
                        <p>Para publicar una mascota debes iniciar sesión o registrarte.</p>
                        <div className="modal-actions">
                            <button onClick={() => window.location.href = "../pages/registrarse"} className="modal-button">
                                Ir a registrarse
                            </button>
                            <button onClick={() => setMostrarModal(false)} className="modal-cancel">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="mascota-form">
                <div className="form-group">
                    <label htmlFor="nombre">Nombre</label>
                    <input
                        type="text"
                        id="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Nombre"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="especie">Especie</label>
                    <input
                        type="text"
                        id="especie"
                        value={especie}
                        onChange={(e) => setEspecie(e.target.value)}
                        placeholder="Especie"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="raza">Raza</label>
                    <input
                        type="text"
                        id="raza"
                        value={raza}
                        onChange={(e) => setRaza(e.target.value)}
                        placeholder="Raza"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="edad">Edad</label>
                    <input
                        type="number"
                        id="edad"
                        value={edad}
                        onChange={(e) => setEdad(Math.max(0, e.target.value))}
                        placeholder="Edad"
                        min="0"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="genero">Género</label>
                    <select
                        id="genero"
                        value={genero}
                        onChange={(e) => setGenero(e.target.value)}
                        required
                    >
                        <option value="">Selecciona el género</option>
                        <option value="Macho">Macho</option>
                        <option value="Hembra">Hembra</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="tamaño">Tamaño</label>
                    <select
                        id="tamaño"
                        value={tamaño}
                        onChange={(e) => setTamaño(e.target.value)}
                        required
                    >
                        <option value="">Selecciona el tamaño</option>
                        <option value="Pequeño">Pequeño</option>
                        <option value="Mediano">Mediano</option>
                        <option value="Grande">Grande</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="descripcion">Descripción</label>
                    <textarea
                        id="descripcion"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        placeholder="Descripción"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="foto">Foto de la mascota</label>
                    <input
                        type="file"
                        id="foto"
                        accept="image/*"
                        onChange={handleFotoChange}
                        required
                    />
                    {fotoPreview && (
                        <div className="image-preview">
                            <img src={fotoPreview} alt="Vista previa de la mascota" />
                        </div>
                    )}
                </div>

                <div className="form-buttons">
                    <button type="submit" className="submit-button">Publicar Mascota</button>
                    <button type="button" className="cancel-button" onClick={onCancel}>Cancelar</button>
                </div>
            </form>
        </>
    );
};

export default MascotaForm;
