import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFundacionById, getMascotasByUserIdPublic, getCalificacionesFundacion, getPromedioCalificacionFundacion, calificarFundacion } from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import MascotaCard from '../components/MascotaCard';
import { HeartIcon, MapPinIcon, PhoneIcon, EnvelopeIcon, GlobeAltIcon, UserGroupIcon, CurrencyDollarIcon, ClockIcon, DocumentTextIcon, LinkIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import useAuthStore from '../store/authStore';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const renderStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  for (let i = 0; i < fullStars; i++) {
    stars.push(<StarSolidIcon key={i} className="w-5 h-5 text-yellow-400" />);
  }
  if (hasHalfStar) {
    stars.push(<StarSolidIcon key="half" className="w-5 h-5 text-yellow-400 opacity-50" />);
  }
  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<StarSolidIcon key={`empty-${i}`} className="w-5 h-5 text-gray-300" />);
  }
  return stars;
};

const FundacionDetail = () => {
  const { id } = useParams();
  const [fundacion, setFundacion] = useState(null);
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const [calificaciones, setCalificaciones] = useState([]);
  const [promedio, setPromedio] = useState(0);
  const [miCalificacion, setMiCalificacion] = useState(null);
  const [comentario, setComentario] = useState('');
  const [puntuacion, setPuntuacion] = useState(5);
  const { isLoggedIn, user } = useAuthStore();

  useEffect(() => {
    const fetchFundacion = async () => {
      try {
        setLoading(true);
        const response = await getFundacionById(id);
        setFundacion(response);
        // Cargar mascotas asociadas
        if (response.usuario_id) {
          const mascotasResp = await getMascotasByUserIdPublic(response.usuario_id);
          setMascotas(mascotasResp);
        }
      } catch (err) {
        console.error('Error fetching fundacion:', err);
        setError('No se pudo cargar la información de la fundación.');
      } finally {
        setLoading(false);
      }
    };
    const fetchCalificaciones = async () => {
      try {
        const califs = await getCalificacionesFundacion(id);
        setCalificaciones(califs);
        if (isLoggedIn && user) {
          const micalif = califs.find(c => c.usuario_id === user.id);
          setMiCalificacion(micalif || null);
        }
      } catch {}
    };
    const fetchPromedio = async () => {
      try {
        const prom = await getPromedioCalificacionFundacion(id);
        setPromedio(prom);
      } catch {}
    };
    fetchFundacion();
    fetchCalificaciones();
    fetchPromedio();
  }, [id, isLoggedIn, user]);

  const handleCalificar = async (e) => {
    e.preventDefault();
    try {
      await calificarFundacion(id, puntuacion, comentario);
      setComentario('');
      setPuntuacion(5);
      setMiCalificacion({ puntuacion, comentario, usuario_nombre: user.nombre });
      // Recargar calificaciones y promedio
      const califs = await getCalificacionesFundacion(id);
      setCalificaciones(califs);
      const prom = await getPromedioCalificacionFundacion(id);
      setPromedio(prom);
      toast.success('¡Gracias por tu calificación!');
    } catch (err) {
      toast.error('Error al calificar la fundación.');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Cargando detalles de la fundación..." />;
  }
  if (error) {
    return <ErrorMessage message={error} />;
  }
  if (!fundacion) {
    return <div className="text-center text-lg text-gray-600 py-8">Lo sentimos, esta fundación no fue encontrada.</div>;
  }

  const promedioSeguro = Number.isFinite(promedio) ? promedio : parseFloat(promedio) || 0;

  return (
    <div className="max-w-4xl mx-auto my-8 bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="relative p-8 bg-gradient-to-br from-blue-500 to-purple-600 text-white flex flex-col md:flex-row items-center justify-center md:justify-start">
        <img src={fundacion.logo_url || '/paw-icon.png'} alt={fundacion.nombre} className="w-32 h-32 rounded-full border-4 border-white shadow-lg mb-4 md:mb-0 md:mr-8 object-cover" />
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold mb-2">{fundacion.nombre}</h1>
          <div className="flex items-center justify-center md:justify-start space-x-4 mb-2">
            {/* Calificación */}
            {promedioSeguro > 0 && (
              <span className="flex items-center">
                {renderStars(promedioSeguro)}
                <span className="ml-2 font-bold">{promedioSeguro.toFixed(1)}</span>
              </span>
            )}
            {/* Estado de aprobación */}
            {fundacion.aprobacion && (
              <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${fundacion.aprobacion === 'aprobada' ? 'bg-green-500' : fundacion.aprobacion === 'pendiente' ? 'bg-yellow-500' : 'bg-red-500'} text-white`}>
                {fundacion.aprobacion}
              </span>
            )}
          </div>
          <div className="mt-2 text-sm">
            {fundacion.fundacion_desde && <span className="mr-4"><strong>Desde:</strong> {fundacion.fundacion_desde}</span>}
            {fundacion.especialidad && <span><strong>Especialidad:</strong> {fundacion.especialidad}</span>}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 flex space-x-8 px-8 pt-4">
        <button className={`py-2 px-4 font-semibold ${activeTab === 'info' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`} onClick={() => setActiveTab('info')}>Información</button>
        <button className={`py-2 px-4 font-semibold ${activeTab === 'mascotas' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`} onClick={() => setActiveTab('mascotas')}>Mascotas</button>
        <button className={`py-2 px-4 font-semibold ${activeTab === 'calificaciones' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`} onClick={() => setActiveTab('calificaciones')}>Calificaciones</button>
      </div>

      {/* Tab Content */}
      <div className="p-8">
        {activeTab === 'info' && (
          <>
            <p className="mb-4 text-gray-700 leading-relaxed">{fundacion.descripcion}</p>
            
            {/* Sección de Contacto y Ubicación */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center"><MapPinIcon className="w-5 h-5 mr-2 text-orange-500" /> Ubicación y Contacto</h3>
                <div className="space-y-2 text-gray-700">
                  {fundacion.direccion && <p className="flex items-center"><MapPinIcon className="w-4 h-4 mr-2 text-gray-500" /> {fundacion.direccion}</p>}
                  {fundacion.horario && <p className="flex items-center"><ClockIcon className="w-4 h-4 mr-2 text-gray-500" /> Horario: {fundacion.horario}</p>}
                  {fundacion.telefono && <p className="flex items-center"><PhoneIcon className="w-4 h-4 mr-2 text-gray-500" /> <a href={`tel:${fundacion.telefono}`} className="text-blue-600 hover:underline">{fundacion.telefono}</a></p>}
                  {fundacion.email && <p className="flex items-center"><EnvelopeIcon className="w-4 h-4 mr-2 text-gray-500" /> <a href={`mailto:${fundacion.email}`} className="text-blue-600 hover:underline">{fundacion.email}</a></p>}
                  {fundacion.sitio_web && <p className="flex items-center"><GlobeAltIcon className="w-4 h-4 mr-2 text-gray-500" /> <a href={fundacion.sitio_web} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">{fundacion.sitio_web}</a></p>}
                  {fundacion.numero_registro_legal && <p className="flex items-center"><DocumentTextIcon className="w-4 h-4 mr-2 text-gray-500" /> Registro Legal: {fundacion.numero_registro_legal}</p>}
                </div>
              </div>
              
              {/* Redes Sociales */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center"><LinkIcon className="w-5 h-5 mr-2 text-orange-500" /> Redes Sociales</h3>
                <div className="flex space-x-4">
                  {fundacion.facebook && <a href={fundacion.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800"><img src="/icons/facebook.svg" alt="Facebook" className="w-8 h-8" /></a>}
                  {fundacion.instagram && <a href={fundacion.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800"><img src="/icons/instagram.svg" alt="Instagram" className="w-8 h-8" /></a>}
                  {fundacion.whatsapp && <a href={`https://wa.me/${fundacion.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800"><img src="/icons/whatsapp.svg" alt="WhatsApp" className="w-8 h-8" /></a>}
                </div>
              </div>
            </div>

            {/* Sección de Opciones de Colaboración */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center"><UserGroupIcon className="w-6 h-6 mr-2 text-orange-500" /> Opciones de Colaboración</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fundacion.acepta_voluntarios !== undefined && (
                  <p className="flex items-center"><UserGroupIcon className="w-4 h-4 mr-2 text-gray-500" /> ¿Acepta voluntarios? <span className="ml-2 font-semibold">{fundacion.acepta_voluntarios ? 'Sí' : 'No'}</span></p>
                )}
                {fundacion.acepta_donaciones !== undefined && (
                  <p className="flex items-center"><CurrencyDollarIcon className="w-4 h-4 mr-2 text-gray-500" /> ¿Acepta donaciones? <span className="ml-2 font-semibold">{fundacion.acepta_donaciones ? 'Sí' : 'No'}</span></p>
                )}
              </div>
            </div>

            {/* Mapa opcional */}
            {fundacion.ubicacion && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center"><MapPinIcon className="w-5 h-5 mr-2 text-orange-500" /> Ubicación en el Mapa</h3>
                <iframe
                  title="Mapa de ubicación"
                  width="100%"
                  height="250"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src={`https://www.google.com/maps?q=${encodeURIComponent(fundacion.ubicacion)}&output=embed`}
                  allowFullScreen
                  className="rounded-lg shadow-md"
                ></iframe>
              </div>
            )}

            {/* Botones de acción */}
            <div className="mt-8 flex flex-wrap gap-4">
              {fundacion.email && <a href={`mailto:${fundacion.email}`} className="btn-primary btn-icon"><EnvelopeIcon className="w-5 h-5 mr-2" /> Contactar</a>}
              {fundacion.telefono && <a href={`tel:${fundacion.telefono}`} className="btn-outline btn-icon"><PhoneIcon className="w-5 h-5 mr-2" /> Llamar</a>}
              {fundacion.acepta_voluntarios && <Link to="#" className="btn-secondary btn-icon"><UserGroupIcon className="w-5 h-5 mr-2" /> Quiero ser voluntario</Link>}
              {fundacion.acepta_donaciones && <Link to="#" className="btn-secondary btn-icon"><CurrencyDollarIcon className="w-5 h-5 mr-2" /> Donar</Link>}
            </div>
          </>
        )}
        {activeTab === 'mascotas' && (
          <>
            <h2 className="text-2xl font-bold mb-4">Mascotas publicadas</h2>
            {mascotas.length === 0 ? (
              <div className="text-gray-600">Esta fundación aún no ha publicado mascotas.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mascotas.map(mascota => (
                  <MascotaCard key={mascota.id} mascota={mascota} />
                ))}
              </div>
            )}
          </>
        )}
        {activeTab === 'calificaciones' && (
          <>
            <h2 className="text-2xl font-bold mb-4">Calificaciones y comentarios</h2>
            {isLoggedIn && !miCalificacion && (
              <form onSubmit={handleCalificar} className="mb-4 flex flex-col md:flex-row items-center gap-4">
                <label className="flex items-center gap-2">
                  <span className="text-sm">Tu puntuación:</span>
                  <select value={puntuacion} onChange={e => setPuntuacion(Number(e.target.value))} className="rounded border-gray-300 p-1">
                    {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} ⭐</option>)}
                  </select>
                </label>
                <input type="text" value={comentario} onChange={e => setComentario(e.target.value)} placeholder="Deja un comentario..." className="flex-1 rounded border-gray-300 p-2" />
                <button type="submit" className="btn-primary">Enviar</button>
              </form>
            )}
            {miCalificacion && (
              <div className="mb-4 text-green-700 text-sm">¡Gracias por calificar esta fundación!</div>
            )}
            <div className="space-y-2">
              {calificaciones.length === 0 ? (
                <div className="text-gray-500">Aún no hay calificaciones.</div>
              ) : (
                calificaciones.map((c, i) => (
                  <div key={i} className="bg-gray-50 rounded p-3 flex items-center gap-3">
                    <span className="font-bold text-orange-600">{c.usuario_nombre}</span>
                    <span className="text-yellow-500">{'★'.repeat(c.puntuacion)}{'☆'.repeat(5-c.puntuacion)}</span>
                    <span className="text-gray-700 flex-1">{c.comentario}</span>
                    <span className="text-xs text-gray-400">{new Date(c.fecha).toLocaleDateString()}</span>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FundacionDetail;