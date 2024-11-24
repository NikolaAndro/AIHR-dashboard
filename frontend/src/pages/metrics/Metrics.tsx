import React from 'react';
import styles from './Metrics.module.css';

const Metrics = () => {
  return (
    <section className={styles.metrics}>
      <div className={styles.metric}>
        <p>Offer Letters Sent</p>
        <h2>42</h2>
        <p className={styles.metricChange}>+10.0%</p>
      </div>
      <div className={styles.metric}>
        <p>Candidates Processed</p>
        <h2>345</h2>
        <p className={`${styles.metricChange} ${styles.down}`}>-4.0%</p>
      </div>
      <div className={styles.metric}>
        <p>Your Score</p>
        <h2>89</h2>
        <p className={styles.metricChange}>+6.5%</p>
      </div>
      <div className={styles.aiInsights}>
        <h3>AI Insights</h3>
        <ul>
          <li>Try adding more key skills to insights chart</li>
          <li>Utilize copilot to ask questions about resume data</li>
        </ul>
      </div>
    </section>
  );
};

export default Metrics;