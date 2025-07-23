import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HeartIcon, 
  MapPinIcon, 
  CalendarIcon,
  UserIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

// Definir la URL base de uploads del backend
const UPLOADS_BASE_URL = 'http://localhost:5000/uploads/';

const MascotaCard = ({ mascota }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const getImageUrl = () => {
    if (imageError) {
      return '/images/nada.gif'; // Imagen por defecto
    }
    if (mascota.imagen_url) {
      // Si la imagen_url ya es una URL completa, usarla tal como está
      if (mascota.imagen_url.startsWith('http')) {
        return mascota.imagen_url;
      }
      // Si es solo el nombre del archivo, construir la URL completa
      return `${UPLOADS_BASE_URL}${mascota.imagen_url}`;
    }
    return '/images/nada.gif';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAgeText = (edad) => {
    if (!edad) return 'Edad no especificada';
    if (edad === 1) return '1 año';
    return `${edad} años`;
  };

  const getStatusColor = (disponible) => {
    if (disponible) {
      return 'bg-green-100 text-green-800';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={getImageUrl()}
          alt={mascota.nombre || 'Mascota'}
          onError={handleImageError}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-200"
            >
              {isLiked ? (
                <HeartSolidIcon className="w-6 h-6 text-red-500" />
              ) : (
                <HeartIcon className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(mascota.disponible)}`}>
            {mascota.disponible ? 'Disponible' : 'Adoptado'}
          </span>
        </div>

        {/* Fundación Info */}
        {mascota.fundacion && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center space-x-2 text-white">
              <UserIcon className="w-4 h-4" />
              <span className="text-sm font-medium">
                {mascota.fundacion.nombre || 'Fundación'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Name and Type */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {mascota.nombre || 'Sin nombre'}
            </h3>
            <p className="text-gray-600 capitalize">
              {mascota.tipo || 'Mascota'} • {mascota.raza || 'Raza no especificada'}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <CalendarIcon className="w-4 h-4 mr-2" />
            <span className="text-sm">
              {getAgeText(mascota.edad)}
            </span>
          </div>
          
          {mascota.ubicacion && (
            <div className="flex items-center text-gray-600">
              <MapPinIcon className="w-4 h-4 mr-2" />
              <span className="text-sm">
                {mascota.ubicacion}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        {mascota.descripcion && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {mascota.descripcion}
          </p>
        )}

        {/* Action Button */}
        <Link
          to={`/mascotas/${mascota.id}`}
          className="w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <EyeIcon className="w-5 h-5 mr-2" />
          Ver Detalles
        </Link>
      </div>
    </motion.div>
  );
};

export default MascotaCard;