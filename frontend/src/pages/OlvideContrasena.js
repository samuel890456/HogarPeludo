import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { solicitarRestablecimientoContrasena } from '../api/api';

const OlvideContrasena = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        try {
            await solicitarRestablecimientoContrasena({ email });
            setMessage('Si tu correo electrónico está registrado, recibirás un enlace para restablecer tu contraseña.');
        } catch (err) {
            console.error('Error al solicitar restablecimiento:', err);
            setError('Error al procesar tu solicitud. Por favor, inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl w-full">
                <div className="p-8 w-full md:w-1/2">
                    <h1 className="text-3xl font-bold text-center mb-2">¿Olvidaste tu Contraseña?</h1>
                    <p className="text-gray-600 text-center mb-6">
                        Ingresa tu correo electrónico y te enviaremos un enlace para restablecerla.
                    </p>

                    {message && <p className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 text-sm">{message}</p>}
                    {error && <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm">{error}</p>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="mb-4">
                            <label htmlFor="email-forgot" className="block text-gray-700 text-sm font-bold mb-2">Correo Electrónico</label>
                            <input
                                id="email-forgot"
                                type="email"
                                placeholder="tu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                aria-label="Correo electrónico"
                                disabled={loading}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        
                        <button type="submit" className="btn-primary w-full" disabled={loading}>
                            {loading ? 'Enviando...' : 'Enviar Enlace'}
                        </button>
                    </form>

                    <p className="text-center text-gray-600 text-sm mt-4">
                        <Link to="/iniciar-sesion" className="text-orange-500 hover:text-orange-800">Volver al inicio de sesión</Link>
                    </p>
                </div>
                <div className="hidden md:block w-1/2 bg-cover bg-center rounded-r-lg" style={{ backgroundImage: 'url(/images/forgot-password-illustration.png)' }}>
                    <div className="flex items-center justify-center h-full bg-black bg-opacity-50 rounded-r-lg">
                        <p className="text-white text-2xl font-bold">Recupera el acceso a tu cuenta</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OlvideContrasena;