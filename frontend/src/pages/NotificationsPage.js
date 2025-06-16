// frontend/src/pages/NotificationsPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faEnvelopeOpen, faTrashAlt, faBell } from '@fortawesome/free-solid-svg-icons';
import { getAllNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } from '../api/api';
import '../styles/NotificationsPage.css'; // Crea este archivo CSS
import { faPaw } from '@fortawesome/free-solid-svg-icons';
const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const data = await getAllNotifications();
            setNotifications(data);
        } catch (err) {
            setError('Error al cargar las notificaciones.');
            console.error('Error al cargar notificaciones:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await markNotificationAsRead(id);
            // Actualiza el estado local para reflejar el cambio
            setNotifications(prev => 
                prev.map(notif => 
                    notif.id === id ? { ...notif, leida: true } : notif
                )
            );
        } catch (err) {
            console.error('Error al marcar notificación como leída:', err);
            // Opcional: mostrar un toast o mensaje de error
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllNotificationsAsRead();
            // Actualiza todas las notificaciones no leídas como leídas
            setNotifications(prev => 
                prev.map(notif => 
                    notif.leida === false ? { ...notif, leida: true } : notif
                )
            );
        } catch (err) {
            console.error('Error al marcar todas como leídas:', err);
            // Opcional: mostrar un toast o mensaje de error
        }
    };

    const handleDeleteNotification = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta notificación?')) {
            try {
                await deleteNotification(id);
                // Elimina la notificación del estado local
                setNotifications(prev => prev.filter(notif => notif.id !== id));
            } catch (err) {
                console.error('Error al eliminar notificación:', err);
                setError('Error al eliminar la notificación.');
                // Opcional: mostrar un toast o mensaje de error
            }
        }
    };

    if (loading) {
        return <div className="notifications-container">Cargando notificaciones...</div>;
    }

    if (error) {
        return <div className="notifications-container error-message">{error}</div>;
    }

    const hasUnread = notifications.some(notif => !notif.leida);

    return (
        <div className="notifications-container">
            <h1><FontAwesomeIcon icon={faBell} /> Mis Notificaciones</h1>

            {notifications.length === 0 ? (
                <p className="no-notifications-message">No tienes notificaciones en este momento.</p>
            ) : (
                <>
                    <div className="notification-actions">
                        {hasUnread && (
                            <button 
                                onClick={handleMarkAllAsRead} 
                                className="btn-mark-all-read"
                                title="Marcar todas como leídas"
                            >
                                <FontAwesomeIcon icon={faEnvelopeOpen} /> Marcar todas como leídas
                            </button>
                        )}
                        {/* Puedes añadir un botón para eliminar todas las leídas aquí si lo deseas */}
                        {/* <button className="btn-delete-read">Eliminar Leídas</button> */}
                    </div>

                    <ul className="notification-list">
                        {notifications.map(notif => (
                            <li key={notif.id} className={`notification-item ${notif.leida ? 'read' : 'unread'}`}>
                                <div className="notification-content">
                                    <p className="notification-message">{notif.mensaje}</p>
                                    <span className="notification-date">
                                        {new Date(notif.fecha_creacion).toLocaleString()}
                                    </span>
                                </div>
                                <div className="notification-actions-item">
                                    {!notif.leida && (
                                        <button 
                                            onClick={() => handleMarkAsRead(notif.id)} 
                                            className="btn-action btn-mark-read"
                                            title="Marcar como leída"
                                        >
                                            <FontAwesomeIcon icon={faCheckCircle} />
                                        </button>
                                    )}
                                    {notif.enlace && (
                                        <Link 
                                            to={notif.enlace} 
                                            className="btn-action btn-view-link"
                                            onClick={() => handleMarkAsRead(notif.id)} // Opcional: marca como leída al navegar
                                            title="Ver detalles"
                                        >
                                            <FontAwesomeIcon icon={faPaw} />
                                        </Link>
                                    )}
                                    <button 
                                        onClick={() => handleDeleteNotification(notif.id)} 
                                        className="btn-action btn-delete"
                                        title="Eliminar notificación"
                                    >
                                        <FontAwesomeIcon icon={faTrashAlt} />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default NotificationsPage;