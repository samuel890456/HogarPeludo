// src/components/ConfirmationDialog.js
import React from 'react';
import '../styles/ConfirmationDialog.css'; // Crearemos este CSS

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
        <div className="confirmation-dialog-overlay" aria-modal="true" role="dialog">
            <div className="confirmation-dialog-content">
                <h2 className="confirmation-dialog-title">{title}</h2>
                <p className="confirmation-dialog-message">{message}</p>
                <div className="confirmation-dialog-actions">
                    <button
                        className="btn-cancel"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        {cancelText}
                    </button>
                    <button
                        className="btn-confirm"
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