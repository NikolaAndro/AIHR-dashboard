import React from 'react';
import styles from './Notifications.module.css';

const Notifications = () => {
  return (
    <div className={styles.notifications}>
      <img src="static/notification-bell-icon.png" alt="Notifications" />
    </div>
  );
};

export default Notifications;