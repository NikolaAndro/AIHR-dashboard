import React, { useState } from 'react';
import Dropdown from '../../components/Dropdown/Dropdown';
import styles from './KeySkillsInsights.module.css';
import legendStyles from './KeyInsightsLegend.module.css';

interface DropdownOption {
  value: string;
  label: string;
}

const KeySkillsInsights = () => {
  const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(null);
  const options: string[] = ['Nikola Andric', 'Ernest Choi', 'Nikhil Sharma', 'Mana Birgani'];

  const dropdownOptions: DropdownOption[] = options.map(option => ({
    value: option,
    label: option
  }));

  return (
    <section className={styles.keySkillInsights}>
      <div className={styles.keySkillInsightsTop}>
        <h3>Key Skill Insights</h3>
        <div className={legendStyles.chartLegend}>
          <div className={legendStyles.legendItem}>
            <span className={legendStyles.legendColor} style={{ backgroundColor: 'lightgray' }}></span>
            <span>Average</span>
          </div>
          <div className={legendStyles.legendItem}>
            <span className={legendStyles.legendColor} style={{ backgroundColor: 'purple' }}></span>
            <span>Candidate</span>
          </div>
        </div>
        <Dropdown options={dropdownOptions} selectedOption={selectedOption} onOptionSelect={setSelectedOption} placeholder="Candidate"/>
      </div>
      <div className={styles.chart}>
        <p>Chart goes here</p>
      </div>
    </section>
  );
}

export default KeySkillsInsights;