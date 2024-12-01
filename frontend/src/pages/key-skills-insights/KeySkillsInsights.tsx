import React, { useState, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Dropdown from '../../components/Dropdown/Dropdown';
import styles from './KeySkillsInsights.module.css';
import legendStyles from './KeyInsightsLegend.module.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface DropdownOption {
  value: string;
  label: string;
}

interface Candidate {
  first_name: string;
  last_name: string;
  key_skills_model_evaluation: { [key: string]: number };
}

interface KeySkillsInsightsProps {
  candidates: Candidate[];
  keySkills: string[];
}

const KeySkillsInsights = ({ candidates, keySkills }: KeySkillsInsightsProps) => {
  const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(null);

  const dropdownOptions: DropdownOption[] = candidates.map(candidate => ({
    value: `${candidate.first_name} ${candidate.last_name}`,
    label: `${candidate.first_name} ${candidate.last_name}`
  }));

  const selectedCandidate = useMemo(() => {
    if (!selectedOption) return null;
    return candidates.find(candidate => `${candidate.first_name} ${candidate.last_name}` === selectedOption.value);
  }, [selectedOption, candidates]);

  const averageSkills = useMemo(() => {
    const skillSums: { [key: string]: number } = {};
    const skillCounts: { [key: string]: number } = {};

    candidates.forEach(candidate => {
      keySkills.forEach(skill => {
        if (candidate.key_skills_model_evaluation && candidate.key_skills_model_evaluation[skill] !== undefined) {
          skillSums[skill] = (skillSums[skill] || 0) + candidate.key_skills_model_evaluation[skill];
          skillCounts[skill] = (skillCounts[skill] || 0) + 1;
        }
      });
    });

    const averages: { [key: string]: number } = {};
    keySkills.forEach(skill => {
      averages[skill] = skillSums[skill] / skillCounts[skill];
    });

    return averages;
  }, [candidates, keySkills]);

  const chartData = useMemo(() => {
    if (!selectedCandidate) return null;

    return {
      labels: keySkills,
      datasets: [
        {
          label: 'Average',
          data: keySkills.map(skill => averageSkills[skill]),
          backgroundColor: '#939ba2',
          borderRadius: 5, // Round corners of histogram bins
        },
        {
          label: 'Selected Candidate',
          data: keySkills.map(skill => selectedCandidate.key_skills_model_evaluation?.[skill] || 0),
          backgroundColor: 'purple',
          borderRadius: 5, // Round corners of histogram bins
        }
      ]
    };
  }, [selectedCandidate, averageSkills, keySkills]);

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow the chart to adjust its height based on the width
    plugins: {
      legend: {
        display: false, // Remove the legend
      },
      title: {
        display: false, // Remove the title
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <section className={styles.keySkillInsights}>
      <div className={styles.keySkillInsightsTop}>
        <h3>Key Skill Insights</h3>
        <div className={legendStyles.chartLegend}>
          <div className={legendStyles.legendItem}>
            <span className={legendStyles.legendColor} style={{ backgroundColor: '6c757d' }}></span>
            <span>Average</span>
          </div>
          <div className={legendStyles.legendItem}>
            <span className={legendStyles.legendColor} style={{ backgroundColor: 'purple' }}></span>
            <span>Candidate</span>
          </div>
        </div>
        <Dropdown options={dropdownOptions} selectedOption={selectedOption} onOptionSelect={setSelectedOption} placeholder="Candidate" className={legendStyles.candidateDropdown}/>
      </div>
      <div className={styles.chart}>
        {chartData ? <Bar data={chartData} options={options} /> : <p>Select a candidate to view the chart</p>}
      </div>
    </section>
  );
};

export default KeySkillsInsights;