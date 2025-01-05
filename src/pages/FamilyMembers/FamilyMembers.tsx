import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// import { useAsync } from 'react-use';
// import { useApi } from '../../utils/use-api';

import { Box, Button } from '@mui/material';

import GlobalNavigation from '../../layouts/GlobalNavigation/GlobalNavigation';
import FamilyMembersBlock from '../../components/FamilyMembersBlock/FamilyMembersBlock';

import { FamilyMember } from '@namyfile/api-client';

import { useBoundStore } from '../../store/store';

function AddFamilyMember() {
  const navigate = useNavigate();
  const { t } = useTranslation('user');

  const {
    fetchFamilyMembers,
    isUpdateFamilyFormOpened,
    setIsAddFamilyFormOpened,
    isAddFamilyFormOpened,
    isDeleteDialogOpen
  } = useBoundStore();

  const [familyData, setFamilyData] = useState<FamilyMember[]>([]);

  useEffect(() => {
    if (!isAddFamilyFormOpened) {
      setTimeout(() => {
        fetchFamilyMembers().then((members) => {
          setFamilyData([...members]);
        });
      }, 300);
    }
  }, [isAddFamilyFormOpened, fetchFamilyMembers, isUpdateFamilyFormOpened, isDeleteDialogOpen]);
  // const refetchFamilyMembers = () => {
  //   retryFetchFamilyMembers();
  // };

  return (
    <>
      <Box className="fixed top-0 w-full">
        <GlobalNavigation />
      </Box>
      <Box>
        <Box className="!mt-[80px] md:flex md:justify-center w-[100%]">
          <Box className="!px-[16px] w-full md:w-[600px] !mb-[40px]">
            <FamilyMembersBlock
              skipNavigation={() => {
                navigate('/client-dashboard');
              }}
            />
          </Box>
        </Box>
        <Box
          sx={{ boxShadow: '0px -4px 4px -4px black' }}
          className="!fixed !py-[16px] !h-min-[70px] !z-20 bottom-0 w-full inset-x-0 !flex !flex-col !justify-center !bg-white !items-center"
        >
          <Button
            className="!mb-[16px] !w-[94%] md:!w-[660px] !h-10 !m-text-btn-md !normal-case !text-secondary !border-secondary"
            variant="outlined"
            onClick={() => setIsAddFamilyFormOpened(true)}
          >
            {t('addFamilyMember')}
          </Button>

          <Button
            variant="contained"
            className={
              familyData && familyData.length < 1
                ? '!py-[16px] !w-[94%] md:!w-[660px] !h-10 !m-text-btn-md md:!d-text-btn-md !normal-case'
                : `!py-[16px] !w-[94%] md:!w-[660px] !h-10 !bg-secondary
               !m-text-btn-md  md:!d-text-btn-md !normal-case`
            }
            onClick={() => navigate('/client-dashboard')}
            type="submit"
            disabled={familyData && familyData.length < 1}
          >
            {t('save')}
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default AddFamilyMember;
