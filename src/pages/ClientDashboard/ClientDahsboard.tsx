import { useState } from 'react';

import { Tabs, Tab, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

import Header from '../../layouts/Header/Header';
import TabApplications from '../../components/TabApplications/TabApplications';
import TabDocuments from '../../components/TabDocuments/TabDocuments';

function ClientDashboard() {
  const [activeTab, setActiveTab] = useState(1);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(event);
    setActiveTab(newValue);
  };

  const theme = useTheme();
  const isSmallAndUp = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <>
      <Header />
      <Box className="!px-[16px] sm:!px-[42px] pt-[78px]">
        <Box className="pb-[24px]">
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
                activeTab === 1
                  ? '!text-secondary !d-text-btn-md !border-b-secondary !normal-case'
                  : '!text-grey !d-text-btn-md !normal-case'
              }
              label="Documents"
              value={1}
            />
            <Tab
              className={
                activeTab === 2
                  ? '!text-secondary !d-text-btn-md !border-b-secondary !normal-case'
                  : '!text-grey !d-text-btn-md !normal-case'
              }
              label="Applications"
              value={2}
            />
          </Tabs>
        </Box>
        {activeTab === 1 && <TabDocuments />}
        {activeTab === 2 && <TabApplications />}
      </Box>
    </>
  );
}
export default ClientDashboard;
