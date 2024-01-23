import React, { useEffect } from 'react';
import useModalState from '@/shared/store/modal';
import styles from './styles/DefaultModal.module.css';
import { ModalAlertTypeOption } from '@/types/common';

const AlertModal = ({ alert }: { alert: ModalAlertTypeOption }) => {
  const { hideAlert } = useModalState();

  useEffect(() => {
    if (alert.timeout) {
      setTimeout(() => {
        hideAlert(alert.id ?? '');
      }, alert.timeout);
    }
  });

  return (
    <div className={styles.container}>
      <span>{alert.content}</span>
      {alert.showButton && <button onClick={hideAlert.bind(null, alert.id ?? '')}>{alert.buttonText ?? '확인'}</button>}
    </div>
  );
};

export default AlertModal;
