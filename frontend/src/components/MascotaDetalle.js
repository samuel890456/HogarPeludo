// File: frontend/src/components/MascotaDetalle.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/MascotaDetalle.css';

const MascotaDetalle = () => {
  const { id } = useParams();
  const [mascota, setMascota] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/mascotas/${id}`)
      .then(res => setMascota(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!mascota) return <p>Cargando...</p>;

 return (
  <div className="detalle-container">
    <img className="detalle-img" src={`http://localhost:5000/uploads/${mascota.foto}`} alt={mascota.nombre} />
    <div className="detalle-info">
      <h1>{mascota.nombre}</h1>
      <p><strong>Raza:</strong> {mascota.raza}</p>
      <p><strong>Edad:</strong> {mascota.edad} años</p>
      <p><strong>Descripción:</strong> {mascota.descripcion}</p>
      <button
  onClick={() => {
    const usuarioId = localStorage.getItem('userId');
    fetch('http://localhost:5000/api/adopciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mascota_id: mascota.id, adoptante_id: usuarioId }),
    })
    .then(res => {
      if (!res.ok) throw new Error('Error al enviar solicitud');
      return res.json();
    })
    .then(data => alert("✅ Solicitud enviada al dueño"))
    .catch(err => alert("❌ Error enviando solicitud: " + err.message));
  }}
>
  Adoptar
</button>


    </div>
  </div>
);

};

export default MascotaDetalle;
