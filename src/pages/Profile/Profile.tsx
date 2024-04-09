import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

import Header from '../../layouts/Header/Header';
import BackButton from '../../components/BackButton/BackButton';
import FamilyMemberListItem from '../../components/FamilyMemberListItem/FamilyMemberListItem';
import ConfirmDelete from '../../components/ConfirmDelete/ConfirmDelete';

import { Box, Typography, Divider, Button, List, Dialog } from '@mui/material';
import FamilyMemberForm from '../../components/FamilyMemberForm/FamilyMemberForm';
import FamilyMember from '../../types/FamilyMember';
import { useBoundStore } from '../../store/store';

function Profile() {
  const navigate = useNavigate();
  const {
    addFamilyMember,
    getFamilyMembers,
    removeFamilyMember,
    updateFamilyMember,
    getUser,
    updateUser,
    getIsAddFamilyFormOpened,
    setIsAddFamilyFormOpened,
    setIsUpdateFamilyFormOpened,
    getIsUpdateFamilyFormOpened
  } = useBoundStore();

  useEffect(() => {
    const familyData = getFamilyMembers();

    setFamilyData([...familyData]);
  }, [
    getFamilyMembers(),
    addFamilyMember,
    removeFamilyMember,
    updateFamilyMember
  ]);

  useEffect(() => {
    const userData = getUser();
    setUserData(userData);
  }, [getUser, updateUser, updateFamilyMember]);

  const [userData, setUserData] = useState(getUser());
  const [familyData, setFamilyData] = useState<FamilyMember[]>([
    ...getFamilyMembers()
  ]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [member, setMember] = useState<FamilyMember | null>();
  const [textForConfirmDelete, setTextForConfirmDelete] = useState(
    'Are you sure you want to delete this family member ?'
  );

  const onClickDeleteOptionOpen = (memberToDelete: FamilyMember) => {
    setIsDeleteDialogOpen(true);
    setMember(memberToDelete);
    setTextForConfirmDelete(
      `Are you sure you want to remove ${memberToDelete.firstName} ${memberToDelete.lastName} from your family list?`
    );
  };

  const closeAddFamilyMemberPopup = () => {
    setIsAddFamilyFormOpened(false);
  };

  const closeUpdateFamilyMemberPopup = () => {
    setIsUpdateFamilyFormOpened(false);
  };

  const handleDeleteFamilyMember = () => {
    if (member) removeFamilyMember(member.id);

    setIsDeleteDialogOpen(false);
  };

  const onClickDeleteOptionClose = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleEditFamilyMember = (member: FamilyMember) => {
    setMember(member);
    if (member) setIsUpdateFamilyFormOpened(true);
  };

  const addNewFamilyMember = (newFamilyMember: FamilyMember) => {
    console.log(newFamilyMember);
    addFamilyMember(newFamilyMember);
  };

  const updateFamilyMemberItem = (updatedMember: FamilyMember) => {
    updateFamilyMember(updatedMember);
  };
  return (
    <>
      <Header />
      <Box className="!mt-[130px] sm:!mt-[140px] sm:flex sm:justify-center w-[100%]">
        <Box className="!px-[16px] w-full sm:w-[600px] !mb-[40px]">
          <Box className="mb-[18px]">
            <BackButton text="Return to dashboard" />
          </Box>
          <Box className="mb-[24px]">
            <Typography className="!m-text-h5 lg:!d-text-h5 !mb-[16px]">
              Profile info
            </Typography>
            <Divider className="bg-black !mb-[24px]" />
            <Box className="flex justify-between !mb-[16px]">
              <Typography className="!m-text-body-md-bold lg:!d-text-body-md-bold">
                First Name
              </Typography>
              <Typography className="!m-text-body-md lg:!d-text-body-md">
                {userData.firstName}
              </Typography>
            </Box>
            <Box className="flex justify-between !mb-[16px]">
              <Typography className="!m-text-body-md-bold lg:!d-text-body-md-bold">
                Last Name
              </Typography>
              <Typography className="!m-text-body-md lg:!d-text-body-md">
                {userData.lastName}
              </Typography>
            </Box>
            <Box className="flex justify-between !mb-[16px]">
              <Typography className="!m-text-body-md-bold lg:!d-text-body-md-bold">
                Date of birth
              </Typography>
              <Typography className="!m-text-body-md lg:!d-text-body-md">
                {dayjs(userData.dateOfBirth).format('MM/DD/YYYY')}
              </Typography>
            </Box>
          </Box>
          <Box className="mb-[40px]">
            <Button
              className="!m-text-btn-md !d-text-btn-md !h-10 !min-w-[80px] !normal-case !bg-secondary"
              variant="contained"
              onClick={() => navigate('/edit-profile')}
            >
              Edit
            </Button>
          </Box>
          <Box>
            <Typography className="!m-text-h5 lg:!d-text-h5 !mb-[16px]">
              Family members
            </Typography>
            <Divider className="bg-black !mb-[16px]" />
            {familyData.length > 0 ? (
              <List dense className="w-full">
                {familyData.map((member) => {
                  return (
                    <FamilyMemberListItem
                      key={member.id}
                      member={member}
                      onClickDeleteOptionOpen={onClickDeleteOptionOpen}
                      handleEditFamilyMember={handleEditFamilyMember}
                    />
                  );
                })}
              </List>
            ) : (
              <Typography className="m-text-body-md lg:d-text-body-md mb-[24px]">
                There is no family members added here.
              </Typography>
            )}

            <Box className="mb-[16px]">
              <ConfirmDelete
                text={textForConfirmDelete}
                dialogTitle="family member"
                isDeleteDialogOpen={isDeleteDialogOpen}
                onClickDeleteOptionClose={onClickDeleteOptionClose}
                handleDeleteOption={handleDeleteFamilyMember}
              />
            </Box>
            <Box className="mb-[40px]">
              <Button
                className="!m-text-btn-md !d-text-btn-md !h-10 !min-w-[80px] !normal-case !border-secondary !text-secondary"
                variant="outlined"
                onClick={() => setIsAddFamilyFormOpened(true)}
              >
                Add family member
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
      <Dialog
        className="w-full"
        classes={{ paper: '!min-w-[90%] lg:!min-w-[50%] h-fit' }}
        open={getIsAddFamilyFormOpened()}
        onClose={closeAddFamilyMemberPopup}
      >
        <FamilyMemberForm
          updateFamilyMemberList={addNewFamilyMember}
          closeFormFamilyWindow={closeAddFamilyMemberPopup}
        />
      </Dialog>
      <Dialog
        className="w-full"
        classes={{ paper: '!min-w-[90%] lg:!min-w-[50%] h-[82vh]' }}
        open={getIsUpdateFamilyFormOpened()}
        onClose={closeUpdateFamilyMemberPopup}
      >
        <FamilyMemberForm
          member={member}
          updateFamilyMemberList={updateFamilyMemberItem}
          closeFormFamilyWindow={closeUpdateFamilyMemberPopup}
          submitButtonContent="Save"
        />
      </Dialog>
    </>
  );
}

export default Profile;
