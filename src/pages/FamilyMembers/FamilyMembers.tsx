import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';

import GlobalNavigation from '../../layouts/GlobalNavigation/GlobalNavigation';
import FamilyMembersBlock from '../../components/FamilyMembersBlock/FamilyMembersBlock';

import FamilyMember from '../../types/FamilyMember';
import { useBoundStore } from '../../store/store';

function AddFamilyMember() {
  const navigate = useNavigate();

  const { getFamilyMembers, setIsAddFamilyFormOpened } = useBoundStore();

  const [familyData, setFamilyData] = useState<FamilyMember[]>([
    ...getFamilyMembers()
  ]);

  useEffect(() => {
    const data = getFamilyMembers();
    setFamilyData([...data]);
  }, [getFamilyMembers()]);

  return (
    <>
      <Box className="fixed top-0 w-full">
        <GlobalNavigation />
      </Box>
      <Box>
        <Box className="!mt-[80px] sm:flex sm:justify-center w-[100%]">
          <Box className="!px-[16px] w-full sm:w-[600px] !mb-[40px]">
            <FamilyMembersBlock />
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
            Add family member
          </Button>

          <Button
            variant="contained"
            className={`!py-[16px] !w-[94%] md:!w-[660px] !h-10 !bg-secondary
               !m-text-btn-md !normal-case`}
            onClick={() => navigate('/client-dashboard')}
            type="submit"
            //   disabled={uploadedFiles.length < 1}
          >
            {familyData.length < 1 ? 'Skip' : 'Done'}
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default AddFamilyMember;
