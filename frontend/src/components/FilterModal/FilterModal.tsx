import React, { useState } from 'react';
import Dropdown from '../Dropdown/Dropdown';
import styles from './FilterModal.module.css';

interface DropdownOption {
  value: string;
  label: string;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
  jobOptions: DropdownOption[];
  keySkills: string[];
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, onApply, jobOptions, keySkills }) => {
  const [selectedJobName, setSelectedJobName] = useState<DropdownOption | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<DropdownOption | null>(null);
  const [selectedKeySkills, setSelectedKeySkills] = useState<string[]>([]);
  const [selectedYOE, setSelectedYOE] = useState<number | null>(null);
  const [selectedPIVAccess, setSelectedPIVAccess] = useState<boolean | null>(null);
  const [selectedClearances, setSelectedClearances] = useState<boolean | null>(null);

  const handleApply = () => {
    const filters = {
      jobName: selectedJobName,
      jobId: selectedJobId,
      keySkills: selectedKeySkills,
      yoe: selectedYOE,
      pivAccess: selectedPIVAccess,
      clearances: selectedClearances,
    };
    onApply(filters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Filter Candidates</h3>
        <Dropdown
          options={jobOptions}
          selectedOption={selectedJobName}
          onOptionSelect={setSelectedJobName}
          placeholder="Job Title"
        />
        <Dropdown
          options={jobOptions}
          selectedOption={selectedJobId}
          onOptionSelect={setSelectedJobId}
          placeholder="Job ID"
        />
        <div className={styles.filterSection}>
          <label>Years of Experience (YOE)</label>
          <input
            type="number"
            value={selectedYOE ?? ''}
            onChange={(e) => setSelectedYOE(e.target.value ? parseInt(e.target.value) : null)}
          />
        </div>
        <div className={styles.filterSection}>
          <label>Key Skills</label>
          {keySkills.map(skill => (
            <label key={skill}>
              <input
                type="checkbox"
                value={skill}
                checked={selectedKeySkills.includes(skill)}
                onChange={(e) => {
                  const newSelectedKeySkills = e.target.checked
                    ? [...selectedKeySkills, skill]
                    : selectedKeySkills.filter(s => s !== skill);
                  setSelectedKeySkills(newSelectedKeySkills);
                }}
              />
              {skill}
            </label>
          ))}
        </div>
        <div className={styles.filterSection}>
          <label>PIV Access</label>
          <select
            value={selectedPIVAccess !== null ? String(selectedPIVAccess) : ''}
            onChange={(e) => setSelectedPIVAccess(e.target.value ? e.target.value === 'true' : null)}
          >
            <option value="">Any</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
        <div className={styles.filterSection}>
          <label>Clearances</label>
          <select
            value={selectedClearances !== null ? String(selectedClearances) : ''}
            onChange={(e) => setSelectedClearances(e.target.value ? e.target.value === 'true' : null)}
          >
            <option value="">Any</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
        <button onClick={handleApply}>Apply</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default FilterModal;