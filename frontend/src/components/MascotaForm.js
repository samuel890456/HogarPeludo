//src/components/MascotaForm.js
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
        const usuario_id = localStorage.getItem("userId"); // Asegúrate de que el ID del usuario está en el almacenamiento local
        if (!usuario_id) {
            alert("Debes estar autenticado para publicar una mascota.");
            return;
        }
    
        const mascotaData = {
            nombre,
            especie,
            raza,
            edad,
            genero,
            tamaño,
            descripcion,
            foto,
            usuario_id, // Agregar el usuario_id
        };
    
        onSubmit(mascotaData);
    };
    

    return (
        <form onSubmit={handleSubmit} className="mascota-form">
            <div className="form-group">
                <label htmlFor="nombre">Nombre</label>
                <input
                    type="text"
                    id="nombre"
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="especie">Especie</label>
                <input
                    type="text"
                    id="especie"
                    placeholder="Especie"
                    value={especie}
                    onChange={(e) => setEspecie(e.target.value)}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="raza">Raza</label>
                <input
                    type="text"
                    id="raza"
                    placeholder="Raza"
                    value={raza}
                    onChange={(e) => setRaza(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label htmlFor="edad">Edad</label>
                <input
                    type="number"
                    id="edad"
                    placeholder="Edad"
                    value={edad}
                    onChange={(e) => setEdad(Math.max(0, e.target.value))}
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
                    placeholder="Descripción"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
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
    );
};

export default MascotaForm;