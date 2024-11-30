import React, { useEffect, useState } from 'react';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const [userInfo, setUserInfo] = useState({ firstName: '', lastName: '',  title: '', image: '' });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('/personal_info?user_id=0'); // Replace '0' with the actual user ID
        console.log('Response:', response); // Print the response object

        if (response.ok) {
          const data = await response.json();
          console.log('User Info Data:', data); // Print the user info data
          console.log('User Info:', data.firstName, data.title, data.image); // Print the user info
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

  return (
    <aside className={styles.sidebar}>
      <div className={styles.userInfo}>
        <img src={userInfo.image || 'static/Myles.png'} alt={userInfo.firstName} className={styles.userImage} /> 
        <h3>{userInfo.firstName} {userInfo.lastName}</h3>
        <h4>{userInfo.title}</h4> 
      </div>
      <nav className={styles.nav}>
        <a href="#" className={`${styles.navLink} ${styles.active}`}><i className="fas fa-tachometer-alt"></i> Dashboard</a>
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