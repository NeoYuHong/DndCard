import React from 'react';
import styles from '@/styles/ConfirmModal.module.css';

export const ConfirmModal = ({
    onConfirm,
    onDeny,
    children,
}) => (
    <div className={styles.ConfirmModal}>
        <h1>{children}</h1>
        <div>
            <button onClick={onConfirm}>Yes</button>
            <button onClick={onDeny}>No</button>
        </div>
    </div>
);