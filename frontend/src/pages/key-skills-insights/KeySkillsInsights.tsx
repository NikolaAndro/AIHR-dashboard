import React from 'react';
import styles from './KeySkillsInsights.module.css';
import legendStyles from './KeyInsightsLegend.module.css';

const KeySkillsInsights = () => {
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
        <div className={styles.keySelectWrapper}>
          <div className={styles.keySelect}>
            <div className={styles.keySelectTrigger}>
              <span>Nikola Andric</span>
              <div className={styles.arrow}></div>
            </div>
            <div className={styles.keyOptions}>
              <span className={`${styles.keyOption} ${styles.selected}`} data-value="job-8456453">Nikola Andric</span>
              <span className={styles.keyOption} data-value="job-5325825">Ernest Choi</span>
              <span className={styles.keyOption} data-value="job-4354912">Nikhil Sharma</span>
              <span className={styles.keyOption} data-value="job-8451354">Mana Birgani</span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.chart}>
        <p>Chart goes here</p>
      </div>
    </section>
  );
};

export default KeySkillsInsights;