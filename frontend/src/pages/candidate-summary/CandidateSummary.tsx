import React from 'react';
import styles from './CandidateSummary.module.css';

const CandidateSummary = () => {
  return (
    <section className={styles.candidatesSummary}>
      <div className={styles.candidatesSummaryTop}>
        <h3>Candidates Summary</h3>
        <div className={styles.jobSelectWrapper}>
          <div className={styles.jobSelect}>
            <div className={styles.jobSelectTrigger}>
              <span>Job 8456453</span>
              <div className={styles.arrow}></div>
            </div>
            <div className={styles.jobOptions}>
              <span className={`${styles.jobOption} ${styles.selected}`} data-value="job-8456453">Job 8456453</span>
              <span className={styles.jobOption} data-value="job-5325825">Job 5325825</span>
              <span className={styles.jobOption} data-value="job-4354912">Job 4354912</span>
              <span className={styles.jobOption} data-value="job-8451354">Job 8451354</span>
            </div>
          </div>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Candidate Name</th>
            <th>YOE</th>
            <th>MySQL</th>
            <th>Java</th>
            <th>Social Skills</th>
            <th>PIV Access</th>
            <th>Clearances</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><img src="../images/Myles.png" className={styles.candidateProfileImg} alt="Mana Birgani" />Mana Birgani</td>
            <td>6</td>
            <td>71</td>
            <td>64</td>
            <td>63</td>
            <td className={styles.yes}>Yes</td>
            <td className={styles.permanent}>Permanent</td>
          </tr>
          <tr>
            <td><img src="../images/Myles.png" className={styles.candidateProfileImg} alt="Mana Birgani" />Jose Urdaneta</td>
            <td>8</td>
            <td>95</td>
            <td>89</td>
            <td>48</td>
            <td className={styles.no}>No</td>
            <td className={styles.contract}>Contract</td>
          </tr>
          <tr>
            <td><img src="../images/Myles.png" className={styles.candidateProfileImg} alt="Mana Birgani" />Nikola Andric</td>
            <td>4</td>
            <td>85</td>
            <td>91</td>
            <td>52</td>
            <td className={styles.yes}>Yes</td>
            <td className={styles.permanent}>Permanent</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
};

export default CandidateSummary;