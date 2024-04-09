import FamilyMemberForm from '../../components/FamilyMemberForm/FamilyMemberForm';
import GlobalNavigation from '../../layouts/GlobalNavigation/GlobalNavigation';

import { Box } from '@mui/material';

import { useNavigate } from 'react-router-dom';
import { useBoundStore } from '../../store/store';
import FamilyMember from '../../types/FamilyMember';

function AddFamilyMember() {
  const navigate = useNavigate();
  const { addFamilyMember } = useBoundStore();
  const closeFormFamilyWindow = () => {
    navigate(-1);
  };

  const addNewFamilyMember = (newFamilyMember: FamilyMember) => {
    console.log(newFamilyMember);
    addFamilyMember(newFamilyMember);
  };

  return (
    <>
      <Box className="fixed top-0 w-full !z-20">
        <GlobalNavigation />
      </Box>
      <FamilyMemberForm
        updateFamilyMemberList={addNewFamilyMember}
        closeFormFamilyWindow={closeFormFamilyWindow}
      />
    </>
  );
}

export default AddFamilyMember;
