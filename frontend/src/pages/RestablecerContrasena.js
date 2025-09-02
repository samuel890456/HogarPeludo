import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { restablecerContrasena } from '../api/api';

const RestablecerContrasena = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            setLoading(false);
            return;
        }

        try {
            await restablecerContrasena(token, { newPassword: password });
            setMessage('¡Tu contraseña ha sido restablecida con éxito! Serás redirigido al inicio de sesión.');
            setTimeout(() => {
                navigate('/iniciar-sesion');
            }, 3000);
        } catch (err) {
            console.error('Error al restablecer contraseña:', err);
            setError('No se pudo restablecer la contraseña. El enlace puede ser inválido o haber expirado.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl w-full">
                <div className="p-8 w-full md:w-1/2">
                    <h1 className="text-3xl font-bold text-center mb-2">Restablecer Contraseña</h1>
                    <p className="text-gray-600 text-center mb-6">
                        Ingresa tu nueva contraseña.
                    </p>

                    {message && <p className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 text-sm">{message}</p>}
                    {error && <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm">{error}</p>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="mb-4">
                            <label htmlFor="new-password" className="block text-gray-700 text-sm font-bold mb-2">Nueva Contraseña</label>
                            <input
                                id="new-password"
                                type="password"
                                placeholder="Mínimo 6 caracteres"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength="6"
                                aria-label="Nueva contraseña"
                                disabled={loading}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        
                        <div className="mb-6">
                            <label htmlFor="confirm-password" className="block text-gray-700 text-sm font-bold mb-2">Confirmar Contraseña</label>
                            <input
                                id="confirm-password"
                                type="password"
                                placeholder="Repite tu nueva contraseña"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength="6"
                                aria-label="Confirmar contraseña"
                                disabled={loading}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        
                        <button type="submit" className="btn-primary w-full" disabled={loading}>
                            {loading ? 'Restableciendo...' : 'Restablecer Contraseña'}
                        </button>
                    </form>

                    <p className="text-center text-gray-600 text-sm mt-4">
                        <Link to="/iniciar-sesion" className="text-orange-500 hover:text-orange-800">Volver al inicio de sesión</Link>
                    </p>
                </div>
                <div className="hidden md:block w-1/2 bg-cover bg-center rounded-r-lg" style={{ backgroundImage: 'url(/images/reset-password-illustration.png)' }}>
                    <div className="flex items-center justify-center h-full bg-black bg-opacity-50 rounded-r-lg">
                        <p className="text-white text-2xl font-bold">Asegura tu cuenta</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestablecerContrasena;