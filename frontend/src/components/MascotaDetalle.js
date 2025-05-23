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
      <button className="btn-adoptar">Adoptar</button>
    </div>
  </div>
);

};

export default MascotaDetalle;
