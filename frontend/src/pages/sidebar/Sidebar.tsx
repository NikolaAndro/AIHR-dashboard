import React from 'react';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.userInfo}>
        <img src="static/Myles.png" alt="Myles" className={styles.userImage} />
        <h3>Ernest</h3>
        <h4>Cloud Hiring Manager</h4>
      </div>
      <nav className={styles.nav}>
        <a href="#" className={`${styles.navLink} ${styles.active}`}><i className="fas fa-tachometer-alt"></i> Dashboard</a>
        <a href="#" className={styles.navLink}><i className="fas fa-dollar-sign"></i> Finance</a>
        <a href="#" className={styles.navLink}><i className="fas fa-users"></i> Employees</a>
        <a href="#" className={styles.navLink}><i className="fas fa-building"></i> Company</a>
        <a href="#" className={styles.navLink}><i className="fas fa-user-tie"></i> Candidate</a>
        <a href="#" className={styles.navLink}><i className="fas fa-calendar-alt"></i> Calendar</a>
        <hr className={styles.divider} />
        <a href="#" className={styles.navLink}><i className="fas fa-user"></i> Profile</a>
        <a href="#" className={styles.navLink}><i className="fas fa-cog"></i> Settings</a>
      </nav>
    </aside>
  );
};

export default Sidebar;