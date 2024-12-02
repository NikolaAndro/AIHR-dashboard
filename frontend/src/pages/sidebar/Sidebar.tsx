import React, { useState, useEffect } from 'react';
import styles from './Sidebar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faAngleDoubleLeft, faTachometerAlt, faUsers, faBuilding, faUserTie, faCalendarAlt, faUser, faCog } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const [userInfo, setUserInfo] = useState({ firstName: '', lastName: '',  title: '', image: '' });
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('/personal_info?user_id=0'); // Replace '0' with the actual user ID
        if (response.ok) {
          const data = await response.json();
          setUserInfo({
            firstName: data.firstName,
            lastName: data.lastName,
            title: data.title,
            image: data.image,
          });
        } else {
          const errorData = await response.json();
          console.error('Failed to fetch user info:', errorData); // Print the error data
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      <button className={styles.toggleButton} onClick={toggleSidebar}>
        {isCollapsed ? <FontAwesomeIcon icon={faBars} /> : <FontAwesomeIcon icon={faAngleDoubleLeft} />}
      </button>
      <div className={styles.userInfo}>
        <img src={userInfo.image || 'static/Myles.png'} alt={userInfo.firstName} className={styles.userImage} /> 
        <h3>{userInfo.firstName} {userInfo.lastName}</h3>
        <h4>{userInfo.title}</h4> 
      </div>
      <nav className={styles.nav}>
        <a href="#" className={`${styles.navLink} ${styles.active}`}><FontAwesomeIcon icon={faTachometerAlt} /> Dashboard</a>
        <a href="#" className={styles.navLink}><FontAwesomeIcon icon={faUsers} /> Employees</a>
        <a href="#" className={styles.navLink}><FontAwesomeIcon icon={faBuilding} /> Company</a>
        <a href="#" className={styles.navLink}><FontAwesomeIcon icon={faUserTie} /> Candidate</a>
        <a href="#" className={styles.navLink}><FontAwesomeIcon icon={faCalendarAlt} /> Calendar</a>
        <hr className={styles.divider} />
        <a href="#" className={styles.navLink}><FontAwesomeIcon icon={faUser} /> Profile</a>
        <a href="#" className={styles.navLink}><FontAwesomeIcon icon={faCog} /> Settings</a>
      </nav>
    </aside>
  );
};

export default Sidebar;