import React, { useEffect, useState, useMemo } from 'react';
import Dropdown from '../../components/Dropdown/Dropdown';
import FilterModal from '../../components/FilterModal/FilterModal';
import styles from './CandidateSummary.module.css';
import { CommandBarButton } from '@fluentui/react';

interface DropdownOption {
  value: string;
  label: string;
}

interface Candidate {
  first_name: string;
  last_name: string;
  years_of_experience: number;
  piv_access: boolean;
  clearances: boolean;
  image?: string;
  [key: string]: any; // To allow dynamic key access for key skills
}

interface Job {
  id: string;
  job_title: string;
}

const CandidateSummary = () => {
  const [selectedJobName, setSelectedJobName] = useState<DropdownOption | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<DropdownOption | null>(null);
  const [jobOptions, setJobOptions] = useState<Job[]>([]);
  const [filteredJobNames, setFilteredJobNames] = useState<DropdownOption[]>([]);
  const [filteredJobIds, setFilteredJobIds] = useState<DropdownOption[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [keySkills, setKeySkills] = useState<string[]>([]);
  const [sortCriteria, setSortCriteria] = useState<DropdownOption | null>(null);
  // const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  // const [filters, setFilters] = useState<any>({});

  const sortOptions: DropdownOption[] = [
    { value: 'first_name', label: 'Candidate Name' },
    { value: 'years_of_experience', label: 'YOE' },
    { value: 'piv_access', label: 'PIV Access' },
    { value: 'clearances', label: 'Clearances' },
    ...keySkills.map(skill => ({ value: skill, label: skill }))
  ];

  useEffect(() => {
    const fetchJobIds = async () => {
      try {
        const response = await fetch('/job_ids');
        console.log('Response:', response); // Print the response object

        if (response.ok) {
          const data = await response.json();
          console.log('Job Data:', data); // Print the job data
          if (data.job_data && data.job_data.length > 0) {
            setJobOptions(data.job_data);
            const jobNames = data.job_data.map((job: Job) => ({
              value: job.job_title,
              label: job.job_title
            }));
            const jobIds = data.job_data.map((job: Job) => ({
              value: job.id,
              label: job.id
            }));
            setFilteredJobNames(jobNames);
            setFilteredJobIds(jobIds);
          } else {
            console.error('No job data found');
          }
        } else {
          const errorData = await response.json();
          console.error('Failed to fetch job IDs:', errorData); // Print the error data
        }
      } catch (error) {
        console.error('Error fetching job IDs:', error);
      }
    };

    fetchJobIds();
  }, []);

  useEffect(() => {
    if (selectedJobName) {
      const filteredIds = jobOptions
        .filter(job => job.job_title === selectedJobName.value)
        .map(job => ({
          value: job.id,
          label: job.id
        }));
      setFilteredJobIds(filteredIds);
    } else {
      const jobIds = jobOptions.map((job: Job) => ({
        value: job.id,
        label: job.id
      }));
      setFilteredJobIds(jobIds);
    }
  }, [selectedJobName, jobOptions]);

  useEffect(() => {
    if (selectedJobId) {
      const filteredNames = jobOptions
        .filter(job => job.id === selectedJobId.value)
        .map(job => ({
          value: job.job_title,
          label: job.job_title
        }));
      setFilteredJobNames(filteredNames);
    } else {
      const jobNames = jobOptions.map((job: Job) => ({
        value: job.job_title,
        label: job.job_title
      }));
      setFilteredJobNames(jobNames);
    }
  }, [selectedJobId, jobOptions]);

  useEffect(() => {
    const fetchCandidateInfo = async () => {
      if (!selectedJobId) return;

      try {
        const response = await fetch(`/candidate_info?applied_position_id=${selectedJobId.value}`);
        console.log('Response:', response); // Print the response object

        if (response.ok) {
          const data = await response.json();
          console.log('Candidate Info Data:', data); // Print the user info data
          if (Array.isArray(data)) {
            setCandidates(data);
          } else {
            console.error('Expected an array of candidates');
          }
        } else {
          const errorData = await response.json();
          console.error('Failed to fetch candidate info:', errorData); // Print the error data
        }
      } catch (error) {
        console.error('Error fetching candidate info:', error);
      }
    };

    const fetchJobKeySkills = async () => {
      if (!selectedJobId) return;

      try {
        const response = await fetch(`/job_key_skills?job_id=${selectedJobId.value}`);
        console.log('Response:', response); // Print the response object

        if (response.ok) {
          const data = await response.json();
          console.log('Job Key Skills Data:', data); // Print the job key skills data
          setKeySkills(data.key_skills);
        } else {
          const errorData = await response.json();
          console.error('Failed to fetch job key skills:', errorData); // Print the error data
        }
      } catch (error) {
        console.error('Error fetching job key skills:', error);
      }
    };

    if (selectedJobId) {
      fetchCandidateInfo();
      fetchJobKeySkills();
    }
  }, [selectedJobId]);

  const sortedCandidates = useMemo(() => {
    if (!sortCriteria) return candidates;

    return [...candidates].sort((a, b) => {
      let valueA = a[sortCriteria.value];
      let valueB = b[sortCriteria.value];

      // Check if sorting by key skills
      if (keySkills.map(skill => skill.toLowerCase()).includes(sortCriteria.value.toLowerCase())) {
        valueA = a.key_skills_model_evaluation?.[sortCriteria.value] ?? 0;
        valueB = b.key_skills_model_evaluation?.[sortCriteria.value] ?? 0;
      } 
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return valueA.localeCompare(valueB); // Alphabetical sorting for strings
      } else if (typeof valueA === 'number' && typeof valueB === 'number') {
        return valueB - valueA; // Descending order for numbers
      } else if (typeof valueA === 'boolean' && typeof valueB === 'boolean') {
        return valueA === valueB ? 0 : valueA ? -1 : 1; // "Yes" first for boolean values
      } else if (typeof valueA === 'undefined' || typeof valueB === 'undefined') {
        return 0; // Handle undefined values
      } else {
        return 0;
      }
    });
  }, [sortCriteria, candidates, keySkills]);

  // useEffect(() => {
  //   if (filters.jobName || filters.jobId || (filters.keySkills && filters.keySkills.length > 0)) {
  //     const filteredCandidates = candidates.filter(candidate => {
  //       const matchesJobName = filters.jobName ? candidate.job_title === filters.jobName.value : true;
  //       const matchesJobId = filters.jobId ? candidate.job_id === filters.jobId.value : true;
  //       const matchesKeySkills = filters.keySkills && filters.keySkills.length > 0
  //         ? filters.keySkills.every((skill: string) => candidate[skill.toLowerCase()])
  //         : true;
  //       return matchesJobName && matchesJobId && matchesKeySkills;
  //     });
  //     setCandidates(filteredCandidates);
  //   }
  // }, [filters, candidates]);

  const resetSelections = () => {
    setSelectedJobName(null);
    setSelectedJobId(null);
    setSortCriteria(null); // Reset the sort criteria
    setFilteredJobNames(jobOptions.map((job: Job) => ({
      value: job.job_title,
      label: job.job_title
    })));
    setFilteredJobIds(jobOptions.map((job: Job) => ({
      value: job.id,
      label: job.id
    })));
    setCandidates([]); // Clear the rows of the table
  };

  // const handleApplyFilters = (filters: any) => {
  //   setFilters(filters);
  // };

  return (
    <section className={styles.candidatesSummary}>
      <div className={styles.candidatesSummaryTop}>
        <h3>Candidates Summary</h3>
        <Dropdown
          options={sortOptions}
          selectedOption={sortCriteria}
          onOptionSelect={setSortCriteria}
          placeholder="Sort by"
          className={styles.sortByDropdown} // Add custom class
        />
        <Dropdown
          options={filteredJobNames}
          selectedOption={selectedJobName}
          onOptionSelect={setSelectedJobName}
          placeholder="Job Title"
          className={styles.jobTitleDropdown} // Add custom class
        />
        <Dropdown
          options={filteredJobIds}
          selectedOption={selectedJobId}
          onOptionSelect={setSelectedJobId}
          placeholder="Job ID"
          className={styles.jobIdDropdown} // Add custom class
        />
        {/* <button onClick={() => setIsFilterModalOpen(true)}>Filter</button> */}
        {/* <button onClick={resetSelections}>Reset</button> */}
        <CommandBarButton
          role="button"
          styles={{
            icon: {
              color: '#FFFFFF'
            },
            iconDisabled: {
              color: '#BDBDBD !important'
            },
            root: {
              color: '#FFFFFF',
              background:
                'radial-gradient(109.81% 107.82% at 100.1% 90.19%, #0F6CBD 33.63%, #2D87C3 70.31%, #8DDDD8 100%)'
            },
            rootDisabled: {
              background: '#F0F0F0'
            }
          }}
          className={styles.clearChatBroom}
          iconProps={{ iconName: 'Broom' }}
          onClick={resetSelections}
          aria-label="reset button"
          disabled={candidates.length === 0 && !selectedJobName && !selectedJobId} // Disable button when candidates array is empty and no dropdowns are selected
        />
      </div>
      <table>
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>Candidate Name</th>
            <th>YOE</th>
            {keySkills.map((skill, index) => (
              <th key={index}>{skill}</th>
            ))}
            <th>PIV Access</th>
            <th>Clearances</th>
          </tr>
        </thead>
        <tbody>
          {sortedCandidates.slice(0, 6).map((candidate, index) => (
            <tr key={index}>
              <td>
                <img
                  src={candidate.image || 'static/Myles.png'}
                  className={styles.candidateProfileImg}
                  alt={candidate.first_name}
                />
                {candidate.first_name} {candidate.last_name}
              </td>
              <td>{candidate.years_of_experience}</td>
              {keySkills.map((skill, skillIndex) => (
                <td key={skillIndex}>
                  {candidate.key_skills_model_evaluation?.[skill] ?? ''}
                </td>
              ))}
              <td className={candidate.piv_access ? styles.yes : styles.no}>
                {candidate.piv_access ? 'Yes' : 'No'}
              </td>
              <td>{candidate.clearances}</td>
            </tr>
          ))}
          {Array.from({ length: 6 - candidates.length }).map((_, index) => (
            <tr key={`empty-${index}`}>
              <td colSpan={keySkills.length + 4}>&nbsp;</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
        jobOptions={jobOptions.map(job => ({ value: job.id, label: job.job_title }))}
        keySkills={keySkills}
      /> */}
    </section>
  );
};

export default CandidateSummary;