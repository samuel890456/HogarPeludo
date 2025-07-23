import React from 'react';

/**
 * Componente de diálogo de confirmación reutilizable.
 * @param {object} props - Propiedades del componente.
 * @param {boolean} props.isOpen - Si el diálogo está abierto.
 * @param {string} props.title - Título del diálogo.
 * @param {string} props.message - Mensaje principal del diálogo.
 * @param {string} [props.confirmText="Confirmar"] - Texto del botón de confirmación.
 * @param {string} [props.cancelText="Cancelar"] - Texto del botón de cancelación.
 * @param {function} props.onConfirm - Callback cuando se confirma la acción.
 * @param {function} props.onCancel - Callback cuando se cancela la acción.
 * @param {boolean} [props.isLoading=false] - Indica si la acción de confirmación está en curso.
 */
const ConfirmationDialog = ({
    isOpen,
    title,
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    onConfirm,
    onCancel,
    isLoading = false
}) => {
    if (!isOpen) {
        return null; // No renderizar si no está abierto
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" aria-modal="true" role="dialog">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
                <p className="text-gray-700 mb-6">{message}</p>
                <div className="flex justify-center space-x-4">
                    <button
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full transition duration-300"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        {cancelText}
                    </button>
                    <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition duration-300"
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Cargando...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationDialog;