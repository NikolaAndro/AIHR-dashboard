import React, { useState } from 'react';
import Dropdown from '../../components/Dropdown/Dropdown';
import styles from './CandidateSummary.module.css';

const CandidateSummary = () => {
  const [selectedOption, setSelectedOption] = useState('Job 8456453');
  const options = ['Job 8456453', 'Job 5325825', 'Job 4354912', 'Job 8451354'];

  return (
    <section className={styles.candidatesSummary}>
      <div className={styles.candidatesSummaryTop}>
        <h3>Candidates Summary</h3>
        <Dropdown options={options} selectedOption={selectedOption} onOptionSelect={setSelectedOption} />
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
            <td><img src="static/Myles.png" className={styles.candidateProfileImg} alt="Mana Birgani" />Mana Birgani</td>
            <td>6</td>
            <td>71</td>
            <td>64</td>
            <td>63</td>
            <td className={styles.yes}>Yes</td>
            <td className={styles.permanent}>Permanent</td>
          </tr>
          <tr>
            <td><img src="static/Myles.png" className={styles.candidateProfileImg} alt="Mana Birgani" />Jose Urdaneta</td>
            <td>8</td>
            <td>95</td>
            <td>89</td>
            <td>48</td>
            <td className={styles.no}>No</td>
            <td className={styles.contract}>Contract</td>
          </tr>
          <tr>
            <td><img src="static/Myles.png" className={styles.candidateProfileImg} alt="Mana Birgani" />Nikola Andric</td>
            <td>4</td>
            <td>85</td>
            <td>91</td>
            <td>52</td>
            <td className={styles.yes}>Yes</td>
            <td className={styles.permanent}>Permanent</td>
          </tr>
          <tr>
            <td><img src="static/Myles.png" className={styles.candidateProfileImg} alt="Mana Birgani" />Mana Birgani</td>
            <td>6</td>
            <td>71</td>
            <td>64</td>
            <td>63</td>
            <td className={styles.yes}>Yes</td>
            <td className={styles.permanent}>Permanent</td>
          </tr>
          <tr>
            <td><img src="static/Myles.png" className={styles.candidateProfileImg} alt="Mana Birgani" />Jose Urdaneta</td>
            <td>8</td>
            <td>95</td>
            <td>89</td>
            <td>48</td>
            <td className={styles.no}>No</td>
            <td className={styles.contract}>Contract</td>
          </tr>
          <tr>
            <td><img src="static/Myles.png" className={styles.candidateProfileImg} alt="Mana Birgani" />Nikola Andric</td>
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