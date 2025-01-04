import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, Tab, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

import Header from '../../layouts/Header/Header';
import TabApplications from '../../components/TabApplications/TabApplications';
import TabDocuments from '../../components/TabDocuments/TabDocuments';
import { useBoundStore } from '../../store/store';
import { useTranslation } from 'react-i18next';

function ClientDashboard() {
  const [activeTab, setActiveTab] = useState('documents');
  const [searchParams, setSearchParams] = useSearchParams();
  const { loading, useFetchUserData } = useBoundStore();

  const { t } = useTranslation('docs');

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
    searchParams.set('tab', newValue);
    setSearchParams({ tab: newValue });
  };

  const theme = useTheme();
  const isSmallAndUp = useMediaQuery(theme.breakpoints.up('sm'));

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
      searchParams.delete('tab');
    }
  }, [loading, searchParams, useFetchUserData]);

  return (
    <>
      <Header />
      <Box className="xl:flex xl:justify-center">
        <Box className="!px-[16px] sm:!px-[42px] pt-[78px] xl:!max-w-[1248px]">
          <Box className="pb-[24px] xl:!w-[1248px] ">
            <Tabs
              variant={isSmallAndUp ? 'standard' : 'fullWidth'}
              value={activeTab}
              onChange={handleChange}
              className="!w-full !sticky !top-0"
              TabIndicatorProps={{
                sx: {
                  backgroundColor: '#031553'
                }
              }}
            >
              <Tab
                className={
                  activeTab === 'documents'
                    ? '!text-secondary !m-text-btn-sm md:!d-text-btn-sm !border-b-secondary !normal-case'
                    : '!text-grey !m-text-btn-sm md:!d-text-btn-sm !normal-case'
                }
                label={t('documentsTab')}
                value="documents"
              />
              <Tab
                className={
                  activeTab === 'applications'
                    ? '!text-secondary !m-text-btn-sm md:!d-text-btn-sm !border-b-secondary !normal-case'
                    : '!text-grey !m-text-btn-sm md:!d-text-btn-sm !normal-case'
                }
                label={t('applicationsTab')}
                value="applications"
              />
            </Tabs>
          </Box>
          {activeTab === 'documents' && <TabDocuments />}
          {activeTab === 'applications' && <TabApplications />}
        </Box>
      </Box>
    </>
  );
}
export default ClientDashboard;
