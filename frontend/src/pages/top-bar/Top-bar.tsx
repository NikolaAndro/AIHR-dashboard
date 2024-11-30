import React from 'react';
import LogoBase from './LogoBase';
import SearchBar from './SearchBar';
import Notifications from './Notifications';
import TimeFrameSelect from './TimeFrameSelect';
import styles from './Top-bar.module.css';
import { useState } from 'react';

const TopBar = ({ onTimeFrameChange }: { onTimeFrameChange: (timeFrame: string) => void }) => {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('Past Week');

  const handleTimeFrameChange = (timeFrame: string) => {
    setSelectedTimeFrame(timeFrame);
    onTimeFrameChange(timeFrame);
  };

  return (
    <header className={styles.topBar}>
      <LogoBase />
      <SearchBar />
      <TimeFrameSelect selectedTimeFrame={selectedTimeFrame} onTimeFrameChange={handleTimeFrameChange} />
      <Notifications />
    </header>
  );
};
export default TopBar;

