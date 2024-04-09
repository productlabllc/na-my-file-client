import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Box } from '@mui/material';

import FamilyMember from '../../types/FamilyMember';
import { useBoundStore } from '../../store/store';

import FamilyMemberForm from '../../components/FamilyMemberForm/FamilyMemberForm';
import GlobalNavigation from '../../layouts/GlobalNavigation/GlobalNavigation';

function FamilyMemberEditId() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getFamilyMembers, updateFamilyMember } = useBoundStore();

  const familyMember = useMemo(
    () => getFamilyMembers().find((member) => member.id === id),
    [id, getFamilyMembers()]
  );

  const closeFormFamilyWindow = () => {
    navigate(-1);
  };

  const updateFamilyMemberList = (newFamilyMember: FamilyMember) => {
    updateFamilyMember(newFamilyMember);
  };

  return (
    <>
      <Box className="fixed top-0 w-full">
        <GlobalNavigation />
      </Box>
      <FamilyMemberForm
        member={familyMember}
        updateFamilyMemberList={updateFamilyMemberList}
        closeFormFamilyWindow={closeFormFamilyWindow}
        submitButtonContent="Save"
      />
    </>
  );
}

export default FamilyMemberEditId;
