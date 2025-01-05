import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';

import Header from '../../layouts/Header/Header';
import BackButton from '../../components/BackButton/BackButton';
import FamilyMemberListItem from '../../components/FamilyMemberListItem/FamilyMemberListItem';
import ConfirmDelete from '../../components/ConfirmDelete/ConfirmDelete';

import { Box, Typography, Divider, Button, List, Dialog } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import FamilyMemberForm from '../../components/FamilyMemberForm/FamilyMemberForm';
import { useBoundStore } from '../../store/store';
import { FamilyMember } from '@namyfile/api-client';
import { useTranslation } from 'react-i18next';

function Profile() {
  const navigate = useNavigate();
  const { t } = useTranslation('user');

  const {
    addFamilyMember,
    getFamilyMembers,
    fetchFamilyMembers,
    removeFamilyMember,
    updateFamilyMember,
    getUserData,
    // useFetchUserData,
    getIsAddFamilyFormOpened,
    setIsAddFamilyFormOpened,
    setIsUpdateFamilyFormOpened,
    getIsUpdateFamilyFormOpened,
    loading
  } = useBoundStore();

  // const [userData, setUserData] = useState<{
  //   firstName: string;
  //   lastName: string;
  //   dateOfBirth: string;
  //   language: string;
  // } | null>(null);

  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    language: ''
  });

  const [spin, setSpin] = useState(false);
  const location = useLocation();

  const [familyData, setFamilyData] = useState<FamilyMember[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [member, setMember] = useState<FamilyMember | null>();
  // const [textForConfirmDelete, setTextForConfirmDelete] = useState(
  //   'Are you sure you want to delete this family member ?'
  // );
  const [updatedFamilyMembersTimestamp, setUpdatedFamilyMembersTimestamp] = useState<number>(Date.now());
  const isProfilePage = location.pathname.split('/').pop() === 'profile';

  const onClickDeleteOptionOpen = (memberToDelete: FamilyMember) => {
    setIsDeleteDialogOpen(true);
    setMember(memberToDelete);
    // setTextForConfirmDelete(
    //   `Are you sure you want to remove ${memberToDelete.FirstName} ${memberToDelete.LastName} from your family list?`
    // );
  };

  const closeAllDialogs = () => {
    setIsAddFamilyFormOpened(false);
    setIsUpdateFamilyFormOpened(false);
  };

  const closeAddFamilyMemberPopup = (familyMemberAdded: boolean = false) => {
    if (familyMemberAdded) {
      setUpdatedFamilyMembersTimestamp(Date.now());
    }
    closeAllDialogs();
  };

  const closeUpdateFamilyMemberPopup = (familyMemberUpdated: boolean = false) => {
    if (familyMemberUpdated) {
      setUpdatedFamilyMembersTimestamp(Date.now());
    }
    closeAllDialogs();
  };

  const handleDeleteFamilyMember = () => {
    if (isProfilePage) {
      if (member) {
        setIsUpdateFamilyFormOpened(true);
        setIsDeleteDialogOpen(false);
      }
    } else {
      if (member) removeFamilyMember(member.id);
      setIsDeleteDialogOpen(false);
    }
  };

  const onClickDeleteOptionClose = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleEditFamilyMember = (member: FamilyMember) => {
    setMember(member);
    if (member) setIsUpdateFamilyFormOpened(true);
  };

  const addNewFamilyMember = async (newFamilyMember: FamilyMember) => {
    addFamilyMember(newFamilyMember);
  };

  const updateFamilyMemberItem = async (updatedMember: FamilyMember) => {
    updateFamilyMember(updatedMember);
  };

  useEffect(() => {
    const userStoreData = getUserData();

    if (userStoreData !== null && !loading) {
      setUserData({
        firstName: userStoreData.FirstName ?? '',
        lastName: userStoreData.LastName ?? '',
        dateOfBirth: dayjs(userStoreData.DOB).add(1, 'day').format('MM/DD/YYYY') ?? '',
        language: userStoreData.LanguageIsoCode ?? ''
      });

      const familyMembers = getFamilyMembers();
      setFamilyData(familyMembers);

      if (userStoreData !== null) {
        setSpin(true);
      }
    }
  }, [loading, getFamilyMembers, getUserData]);

  useEffect(() => {
    const fetchData = async () => {
      setTimeout(async () => {
        await fetchFamilyMembers().then((result) => {
          setFamilyData(result);
        });
      }, 300);
    };
    fetchData();
  }, [updatedFamilyMembersTimestamp, fetchFamilyMembers, getFamilyMembers]);

  if (!spin) {
    return <CircularProgress />;
  }

  const handleOpenEditDialog = (member: FamilyMember) => {
    onClickDeleteOptionOpen(member);
  };

  // const handleOpenDialog = () => {
  //    setIsDeleteDialogOpen(true)
  // }

  return (
    <>
      <Header />
      <Box className="!mt-[130px] sm:!mt-[140px] sm:flex sm:justify-center w-[100%]">
        <Box className="!px-[16px] w-full sm:w-[600px] !mb-[40px]">
          <Box className="mb-[18px]">
            <BackButton text={t('returnButton')} />
          </Box>
          <Box className="mb-[24px]">
            <Typography className="!m-text-h5 lg:!d-text-h5 !mb-[16px]">{t('profileInfo')}</Typography>
            <Divider className="bg-black !mb-[24px]" />
            <Box className="flex justify-between !mb-[16px]">
              <Typography className="!m-text-body-md-bold lg:!d-text-body-md-bold">{t('clientFirstName')}</Typography>
              <Typography className="!m-text-body-md lg:!d-text-body-md">{userData.firstName}</Typography>
            </Box>
            <Box className="flex justify-between !mb-[16px]">
              <Typography className="!m-text-body-md-bold lg:!d-text-body-md-bold">{t('clientLastName')}</Typography>
              <Typography className="!m-text-body-md lg:!d-text-body-md">{userData.lastName}</Typography>
            </Box>
            <Box className="flex justify-between !mb-[16px]">
              <Typography className="!m-text-body-md-bold lg:!d-text-body-md-bold">{t('clientDOB')}</Typography>
              <Typography className="!m-text-body-md lg:!d-text-body-md">{userData.dateOfBirth}</Typography>
            </Box>
          </Box>
          <Box className="mb-[40px]">
            <Button
              className="!m-text-btn-md !d-text-btn-md !h-10 !min-w-[80px] !normal-case !bg-secondary"
              variant="contained"
              onClick={() => navigate('/edit-profile')}
            >
              {t('edit')}
            </Button>
          </Box>
          <Box>
            <Typography className="!m-text-h5 lg:!d-text-h5 !mb-[16px]">{t('familyMembers')}</Typography>
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
                      isProfilePage={isProfilePage}
                      handleOpenDialog={handleOpenEditDialog}
                    />
                  );
                })}
              </List>
            ) : (
              <Typography className="m-text-body-md lg:d-text-body-md mb-[24px]">{t('noFamilyMembers')}</Typography>
            )}

            <Box className="mb-[16px]">
              {/* Reusing this component for edit confirmation*/}
              <ConfirmDelete
                text={t('updateFAmilyMemberwillUpdateDocuments')}
                dialogTitle={t('deleteFamilyMemberDialogTitle')}
                isDeleteDialogOpen={isDeleteDialogOpen}
                onClickDeleteOptionClose={onClickDeleteOptionClose}
                handleDeleteOption={handleDeleteFamilyMember}
                isProfilePage={isProfilePage}
              />
            </Box>
            <Box className="mb-[40px]">
              <Button
                className="!m-text-btn-md !d-text-btn-md !h-10 !min-w-[80px] !normal-case !border-secondary !text-secondary"
                variant="outlined"
                onClick={() => setIsAddFamilyFormOpened(true)}
              >
                {t('addFamilyMember')}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
      <Dialog
        className="w-full"
        classes={{ paper: 'min-w-[90%] md:min-w-fit h-fit' }}
        open={getIsAddFamilyFormOpened()}
        onClose={closeAllDialogs}
      >
        <FamilyMemberForm
          title={t('addFamilyMember')}
          updateFamilyMemberList={addNewFamilyMember}
          closeFormFamilyWindow={closeAddFamilyMemberPopup}
        />
      </Dialog>
      <Dialog
        className="w-full"
        classes={{ paper: 'min-w-[90%] md:min-w-fit !h-fit' }}
        open={getIsUpdateFamilyFormOpened()}
        onClose={closeAllDialogs}
      >
        <FamilyMemberForm
          member={member}
          title={t('editFamilyMember')}
          updateFamilyMemberList={updateFamilyMemberItem}
          closeFormFamilyWindow={closeUpdateFamilyMemberPopup}
          submitButtonContent={t('save')}
        />
      </Dialog>
    </>
  );
}

export default Profile;
