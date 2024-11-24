import React from 'react';
import LogoBase from './LogoBase';
import SearchBar from './SearchBar';
import Notifications from './Notifications';
import TimeFrameSelect from './TimeFrameSelect';
import styles from './Top-bar.module.css';

const TopBar = () => {
  return (
    <header className={styles.topBar}>
      <LogoBase />
      <SearchBar />
      <TimeFrameSelect />
      <Notifications />
    </header>
  );
};

export default TopBar;