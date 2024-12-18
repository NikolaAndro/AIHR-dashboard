import React, { useState, useEffect, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { Dialog, Stack, TextField } from '@fluentui/react';
import { CopyRegular } from '@fluentui/react-icons';
import { AppStateContext } from '../../state/AppProvider';
import Contoso from '../../assets/Contoso.svg';
import { HistoryButton, ShareButton } from '../../components/common/Button';
import TopBar from '../top-bar/Top-bar';
import Sidebar from '../sidebar/Sidebar';
import Metrics from '../metrics/Metrics';
import CandidateSummary from '../candidate-summary/CandidateSummary';
import KeySkillsInsights from '../key-skills-insights/KeySkillsInsights';
import styles from './Layout.module.css';

interface Candidate {
  first_name: string;
  last_name: string;
  years_of_experience: number;
  piv_access: boolean;
  clearances: boolean;
  image?: string;
  [key: string]: any; // To allow dynamic key access for key skills
  key_skills_model_evaluation: { [key: string]: number };
}

const Layout = () => {
  const [isSharePanelOpen, setIsSharePanelOpen] = useState<boolean>(false);
  const [copyClicked, setCopyClicked] = useState<boolean>(false);
  const [copyText, setCopyText] = useState<string>('Copy URL');
  const [shareLabel, setShareLabel] = useState<string | undefined>('Share');
  const [hideHistoryLabel, setHideHistoryLabel] = useState<string>('Hide chat history');
  const [showHistoryLabel, setShowHistoryLabel] = useState<string>('Show chat history');
  const [logo, setLogo] = useState('');
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<string>('Past Week');
  const appStateContext = useContext(AppStateContext);
  const ui = appStateContext?.state.frontendSettings?.ui;

  const handleShareClick = () => {
    setIsSharePanelOpen(true);
  };

  const handleSharePanelDismiss = () => {
    setIsSharePanelOpen(false);
    setCopyClicked(false);
    setCopyText('Copy URL');
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopyClicked(true);
  };

  const handleHistoryClick = () => {
    appStateContext?.dispatch({ type: 'TOGGLE_CHAT_HISTORY' });
  };

  const handleTimeFrameChange = (timeFrame: string) => {
    setSelectedTimeFrame(timeFrame);
  };

  useEffect(() => {
    if (!appStateContext?.state.isLoading) {
      setLogo(ui?.logo || Contoso);
    }
  }, [appStateContext?.state.isLoading]);

  useEffect(() => {
    if (copyClicked) {
      setCopyText('Copied URL');
    }
  }, [copyClicked]);

  useEffect(() => { }, [appStateContext?.state.isCosmosDBAvailable.status]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480) {
        setShareLabel(undefined);
        setHideHistoryLabel('Hide history');
        setShowHistoryLabel('Show history');
      } else {
        setShareLabel('Share');
        setHideHistoryLabel('Hide chat history');
        setShowHistoryLabel('Show chat history');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [keySkills, setKeySkills] = useState<string[]>([]);

  return (
    <div className={styles.layout}>
      <TopBar onTimeFrameChange={handleTimeFrameChange} />
      <div className={styles.mainContent}>
        <Sidebar />
        <div className={styles.content}>
          <Metrics selectedTimeFrame={selectedTimeFrame} />
          <CandidateSummary setCandidates={setCandidates} setKeySkills={setKeySkills} />
          <div className={styles.keySkillInsightsDialogContainer}>
            <KeySkillsInsights candidates={candidates} keySkills={keySkills} />
            <Outlet />
            <Dialog
              onDismiss={handleSharePanelDismiss}
              hidden={!isSharePanelOpen}
              styles={{
                main: [
                  {
                    selectors: {
                      ['@media (min-width: 480px)']: {
                        maxWidth: '600px',
                        background: '#FFFFFF',
                        boxShadow: '0px 14px 28.8px rgba(0, 0, 0, 0.24), 0px 0px 8px rgba(0, 0, 0, 0.2)',
                        borderRadius: '8px',
                        maxHeight: '200px',
                        minHeight: '100px'
                      }
                    }
                  }
                ]
              }}
              dialogContentProps={{
                title: 'Share the web app',
                showCloseButton: true
              }}>
              <Stack horizontal verticalAlign="center" style={{ gap: '8px' }}>
                <TextField className={styles.urlTextBox} defaultValue={window.location.href} readOnly />
                <div
                  className={styles.copyButtonContainer}
                  role="button"
                  tabIndex={0}
                  aria-label="Copy"
                  onClick={handleCopyClick}
                  onKeyDown={e => (e.key === 'Enter' || e.key === ' ' ? handleCopyClick() : null)}>
                  <CopyRegular className={styles.copyButton} />
                  <span className={styles.copyButtonText}>{copyText}</span>
                </div>
              </Stack>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;