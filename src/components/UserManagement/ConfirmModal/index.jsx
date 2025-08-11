import React from 'react';
import './confirm.css';

export default function ConfirmModal({onClose, onConfirm}) {
    return (
        <div className="modal-Overlay">
            <div className="modalConfirm">
                <h3>Delete user</h3>
                <div className="modalButtons">
                    <button type="button" onClick={onConfirm}>OK</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}