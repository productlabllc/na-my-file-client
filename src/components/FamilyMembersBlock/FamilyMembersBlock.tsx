import { useState, useCallback, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

import { useBoundStore } from '../../store/store';
import { FamilyMember } from '@namyfile/api-client';
import { useApi } from '../../utils/use-api';
import { useAsync } from 'react-use';
import { useTranslation } from 'react-i18next';
import { Box, List, Typography, Dialog, Button } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import ConfirmDelete from '../../components/ConfirmDelete/ConfirmDelete';
import FamilyMemberListItem from '../../components/FamilyMemberListItem/FamilyMemberListItem';
import FamilyMemberForm from '../FamilyMemberForm/FamilyMemberForm';

interface FamilyMembersBlock {
  skipNavigation: () => void;
  skipNavigationText?: string;
}

function FamilyMembersBlock({ skipNavigation, skipNavigationText }: FamilyMembersBlock) {
  const {
    addFamilyMember,
    removeFamilyMember,
    updateFamilyMember,
    setIsAddFamilyFormOpened,
    setIsUpdateFamilyFormOpened,
    isAddFamilyFormOpened,
    isUpdateFamilyFormOpened,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen
  } = useBoundStore();

  // const navigate = useNavigate();

  const [member, setMember] = useState<FamilyMember | null>();
  const { t } = useTranslation('user');
  const [textForConfirmDelete, setTextForConfirmDelete] = useState(t('familyMemberRemoveWarning'));

  const api = useApi();

  const getFamilyMembers = useCallback(async () => {
    setTimeout(() => {
      api.getFamilyMembers().then((value) => {
        setFamilyMembers(value);
      });
    }, 300);
  }, [api]);

  const { value } = useAsync(() => api.getFamilyMembers());

  const [familyMembers, setFamilyMembers] = useState(value ?? []);

  const closeAddFamilyMemberPopup = () => {
    setIsAddFamilyFormOpened(false);
  };

  const closeUpdateFamilyMemberPopup = () => {
    setIsUpdateFamilyFormOpened(false);
  };

  const addNewFamilyMember = (newFamilyMember: FamilyMember) => {
    addFamilyMember(newFamilyMember);
  };

  const onClickDeleteOptionOpen = (memberToDelete: FamilyMember) => {
    setIsDeleteDialogOpen(true);
    setMember(memberToDelete);
    setTextForConfirmDelete(
      `${t('familyMembreRemoveBegining')} ${memberToDelete.FirstName} ${memberToDelete.LastName} ${t(
        'familyMembreRemoveEnding'
      )}`
    );
  };
  const onClickDeleteOptionClose = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteFamilyMember = () => {
    if (member) removeFamilyMember(member.id);

    setIsDeleteDialogOpen(false);
  };

  const handleEditFamilyMember = (member: FamilyMember) => {
    setMember(member);
    if (member) setIsUpdateFamilyFormOpened(true);
  };

  const updateFamilyMemberItem = (updatedMember: FamilyMember) => {
    updateFamilyMember(updatedMember);
  };

  useEffect(() => {
    if ((!isAddFamilyFormOpened && !isDeleteDialogOpen && !isUpdateFamilyFormOpened) || !value) {
      getFamilyMembers();
    }
  }, [getFamilyMembers, isUpdateFamilyFormOpened, isAddFamilyFormOpened, isDeleteDialogOpen, value]);

  return (
    <div>
      <Box className="mb-[16px]">
        <Typography className="!m-text-h5 md:!d-text-h5 !mr-[10px] !flex !items-center">
          {t('addFamilyMembers')}
        </Typography>
      </Box>
      <Box>
        <Typography className="!m-text-body-md md:!d-text-body-md !mb-[16px]">
          {t('familyMemberDisclamerParagraphOne')}
        </Typography>
        <Typography className="!m-text-body-md md:!d-text-body-md">{t('familyMemberDisclamerParagraphTwo')}</Typography>
      </Box>
      {familyMembers && familyMembers.length === 0 ? (
        <Box className="mt-[24px] flex justify-end">
          <Button
            onClick={skipNavigation}
            className="!m-text-btn-sm md:!d-text-btn-sm !normal-case !text-secondary !px-[10px] !py-[13px]"
            variant="text"
          >
            {skipNavigationText ? skipNavigationText : t('skipFamilyMember')}
            <ArrowForwardIosIcon className="!text-secondary sm:!m-text-btn-md !m-text-btn-sm !ml-[4px]"></ArrowForwardIosIcon>
          </Button>
        </Box>
      ) : (
        <Box className="w-full pb-[100px] mt-[24px] relative">
          {/* Show List of data items when the screen size is x-large and down */}
          <List dense className="w-full">
            {familyMembers?.map((member) => {
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
        </Box>
      )}
      <ConfirmDelete
        text={textForConfirmDelete}
        dialogTitle={t('familyMemberRemoveApplication')}
        isDeleteDialogOpen={isDeleteDialogOpen}
        onClickDeleteOptionClose={onClickDeleteOptionClose}
        handleDeleteOption={handleDeleteFamilyMember}
      />{' '}
      <Dialog
        className="w-full"
        classes={{ paper: 'min-w-[90%] md:min-w-fit !h-fit' }}
        open={isAddFamilyFormOpened}
        onClose={closeAddFamilyMemberPopup}
      >
        <FamilyMemberForm
          updateFamilyMemberList={addNewFamilyMember}
          closeFormFamilyWindow={closeAddFamilyMemberPopup}
          title="Add family member"
        />
      </Dialog>
      <Dialog
        className="w-full"
        classes={{ paper: 'min-w-[90%] md:min-w-fit !h-fit' }}
        open={isUpdateFamilyFormOpened}
        onClose={closeUpdateFamilyMemberPopup}
      >
        <FamilyMemberForm
          member={member}
          updateFamilyMemberList={updateFamilyMemberItem}
          closeFormFamilyWindow={closeUpdateFamilyMemberPopup}
          title={t('editFamilyMember')}
          submitButtonContent={t('save')}
        />
      </Dialog>
    </div>
  );
}

export default FamilyMembersBlock;
