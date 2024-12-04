import React, { useEffect, useState, useMemo } from 'react';
import Dropdown from '../../components/Dropdown/Dropdown';
import FilterModal from '../../components/FilterModal/FilterModal';
import styles from './CandidateSummary.module.css';
import { CommandBarButton } from '@fluentui/react';
import Modal from 'react-modal'; // Import the Modal component

Modal.setAppElement('#root'); 

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
  key_skills_model_evaluation: { [key: string]: number };
  resume_url?: string; // Assuming resume_url is the link to the PDF document
}

interface Job {
  id: string;
  job_title: string;
}

interface CandidateSummaryProps {
  setCandidates: React.Dispatch<React.SetStateAction<Candidate[]>>;
  setKeySkills: React.Dispatch<React.SetStateAction<string[]>>;
}

const CandidateSummary: React.FC<CandidateSummaryProps> = ({ setCandidates, setKeySkills }) => {
  const [selectedJobName, setSelectedJobName] = useState<DropdownOption | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<DropdownOption | null>(null);
  const [jobOptions, setJobOptions] = useState<Job[]>([]);
  const [filteredJobNames, setFilteredJobNames] = useState<DropdownOption[]>([]);
  const [filteredJobIds, setFilteredJobIds] = useState<DropdownOption[]>([]);
  const [candidates, setLocalCandidates] = useState<Candidate[]>([]);
  const [keySkills, setLocalKeySkills] = useState<string[]>([]);
  const [sortCriteria, setSortCriteria] = useState<DropdownOption | null>(null);

  // New state variables for modal
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);

  const sortOptions: DropdownOption[] = [
    { value: 'first_name', label: 'Candidate Name' },
    { value: 'years_of_experience', label: 'YOE' },
    { value: 'piv_access', label: 'PIV Access' },
    { value: 'clearances', label: 'Clearances' },
    { value: 'overall_model_score', label: 'Overall Score' },
    ...keySkills.map(skill => ({ value: skill, label: skill }))
  ];

  useEffect(() => {
    const fetchJobIds = async () => {
      try {
        const response = await fetch('/job_ids');
        if (response.ok) {
          const data = await response.json();
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
          console.error('Failed to fetch job IDs:', errorData);
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
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setLocalCandidates(data);
            setCandidates(data); // Pass candidates up to parent component
          } else {
            console.error('Expected an array of candidates');
          }
        } else {
          const errorData = await response.json();
          console.error('Failed to fetch candidate info:', errorData);
        }
      } catch (error) {
        console.error('Error fetching candidate info:', error);
      }
    };

    const fetchJobKeySkills = async () => {
      if (!selectedJobId) return;

      try {
        const response = await fetch(`/job_key_skills?job_id=${selectedJobId.value}`);
        if (response.ok) {
          const data = await response.json();
          setLocalKeySkills(data.key_skills);
          setKeySkills(data.key_skills); // Pass key skills up to parent component
        } else {
          const errorData = await response.json();
          console.error('Failed to fetch job key skills:', errorData);
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
    setLocalCandidates([]); // Clear the rows of the table
    setCandidates([]); // Clear the rows of the table in parent component
    setLocalKeySkills([]); // Clear key skills
    setKeySkills([]); // Clear key skills in parent component
  };

  // Handle row click to open modal
  const handleRowClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  };

  // Close modal with animation
  const closeModal = () => {
    setIsModalClosing(true); // Set modal closing state
    setTimeout(() => {
      setIsModalOpen(false);
      setIsModalClosing(false); // Reset modal closing state
      setSelectedCandidate(null);
    }, 200); // Match the duration of the unfoldOut animation
  };

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
      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <table className={styles.candidateTable}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Candidate Name</th>
                <th>YOE</th>
                {keySkills.map((skill, index) => (
                  <th key={index}>{skill}</th>
                ))}
                <th>PIV Access</th>
                <th>Clearances</th>
                <th>Overall Score</th>
              </tr>
            </thead>
          </table>
        </div>
        <div className={styles.tableBody}>
          <table className={styles.candidateTable}>
            <tbody>
              {sortedCandidates.map((candidate, index) => (
                <tr key={index} onClick={() => handleRowClick(candidate)}> {/* Attach handleRowClick */}
                  <td className={styles.candidateNameCell}>
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
                  <td>{candidate.overall_model_score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Modal for displaying candidate resume */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Candidate Resume"
          className={`${styles.modal} ${isModalClosing ? styles.fadeOut : ''}`} // Apply fade-out class conditionally
          overlayClassName={`${styles.overlay} ${isModalClosing ? styles.fadeOut : ''}`}
        >
          {selectedCandidate && (
            <div className={styles.resume}>
              <div className={styles.modalHeader}>
                <h2>{selectedCandidate.first_name} {selectedCandidate.last_name}</h2>
                
                <a onClick={closeModal} className={styles.modalCloseButton}>
                    <span className={styles.left}></span>
                    <span className={styles.right}></span>
                </a>
                
              </div>
              <iframe
                src={selectedCandidate.resume_url}
                width="100%"
                height="95%"
                title="Resume"
              />
              
            </div>
          )}
        </Modal>
      </div>
    </section>
  );
};

export default CandidateSummary;