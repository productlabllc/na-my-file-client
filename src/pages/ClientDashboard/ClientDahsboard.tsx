import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, Tab, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

import Header from '../../layouts/Header/Header';
import TabApplications from '../../components/TabApplications/TabApplications';
import TabDocuments from '../../components/TabDocuments/TabDocuments';
// import { useAuth } from 'react-oidc-context';
// import { DefaultApi as Api } from '@myfile/api-client';

function ClientDashboard() {
  // const auth = useAuth();
  // (async () => {
  //   const headers = { Authorization: `Bearer ${auth.user?.id_token}` };
  //   const api = new Api({
  //     baseOptions: { headers }
  //   });
  //   const user = await api.getUser();
  //   console.log(user);
  // })();

  const [activeTab, setActiveTab] = useState('documents');
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
      searchParams.delete('tab');
    }
  }, [searchParams]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    console.log(event);
    setActiveTab(newValue);
    searchParams.set('tab', newValue);
    setSearchParams({ tab: newValue });
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
                activeTab === 'documents'
                  ? '!text-secondary !d-text-btn-md !border-b-secondary !normal-case'
                  : '!text-grey !d-text-btn-md !normal-case'
              }
              label="Documents"
              value="documents"
            />
            <Tab
              className={
                activeTab === 'applications'
                  ? '!text-secondary !d-text-btn-md !border-b-secondary !normal-case'
                  : '!text-grey !d-text-btn-md !normal-case'
              }
              label="Applications"
              value="applications"
            />
          </Tabs>
        </Box>
        {activeTab === 'documents' && <TabDocuments />}
        {activeTab === 'applications' && <TabApplications />}
      </Box>
    </>
  );
}
export default ClientDashboard;
