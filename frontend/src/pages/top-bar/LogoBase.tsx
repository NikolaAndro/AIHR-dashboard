import React, { useContext } from 'react';
import styles from './LogoBase.module.css';
import { AppStateContext } from '../../state/AppProvider'

const LogoBase = () => {
  const appStateContext = useContext(AppStateContext)
  const ui = appStateContext?.state.frontendSettings?.ui

  return (
    <div className={styles.logoBase}>
      <div className={styles.logo}>
        <img src="static/aihr-logo_cropped.png" alt="AI{hR} Logo" />
      </div>
      <h1 className={styles.headerTitle}>{ui?.title}</h1>
    </div>
  );
};

export default LogoBase;