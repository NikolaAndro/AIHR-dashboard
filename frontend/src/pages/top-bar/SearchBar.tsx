import React from 'react';
import styles from './SearchBar.module.css';

const SearchBar = () => {
  return (
    <div className={styles.searchBarContainer}>
      <div className={styles.searchBarWrapper}>
        <i className="fas fa-search"></i>
        <input type="text" className={styles.searchBar} placeholder="Search..." />
      </div>
    </div>
  );
};

export default SearchBar;