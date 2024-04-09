import { useState, useEffect } from 'react';
import { Box, Icon, List, Typography, Dialog } from '@mui/material';

import ConfirmDelete from '../../components/ConfirmDelete/ConfirmDelete';
import FamilyMemberListItem from '../../components/FamilyMemberListItem/FamilyMemberListItem';
import FamilyMemberForm from '../FamilyMemberForm/FamilyMemberForm';
import TooltipUI from '../TooltipUI/TooltipUI';

import FamilyMember from '../../types/FamilyMember';
import { useBoundStore } from '../../store/store';

function FamilyMembersBlock() {
  const [textForConfirmDelete, setTextForConfirmDelete] = useState(
    'Are you sure you want to delete this family member ?'
  );
  const {
    addFamilyMember,
    getFamilyMembers,
    removeFamilyMember,
    updateFamilyMember,
    setIsAddFamilyFormOpened,
    getIsAddFamilyFormOpened,
    setIsUpdateFamilyFormOpened,
    getIsUpdateFamilyFormOpened
  } = useBoundStore();

  const [familyData, setFamilyData] = useState<FamilyMember[]>([
    ...getFamilyMembers()
  ]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [member, setMember] = useState<FamilyMember | null>();
  useEffect(() => {
    const data = getFamilyMembers();

    setFamilyData([...data]);
  }, [
    getFamilyMembers(),
    addFamilyMember,
    removeFamilyMember,
    updateFamilyMember
  ]);

  const closeAddFamilyMemberPopup = () => {
    setIsAddFamilyFormOpened(false);
  };

  const closeUpdateFamilyMemberPopup = () => {
    setIsUpdateFamilyFormOpened(false);
  };

  const addNewFamilyMember = (newFamilyMember: FamilyMember) => {
    console.log(newFamilyMember);
    addFamilyMember(newFamilyMember);
  };

  const onClickDeleteOptionOpen = (memberToDelete: FamilyMember) => {
    setIsDeleteDialogOpen(true);
    setMember(memberToDelete);
    setTextForConfirmDelete(
      `Are you sure you want to remove ${memberToDelete.firstName} ${memberToDelete.lastName} from your family list?`
    );
  };
  const onClickDeleteOptionClose = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteFamilyMember = () => {
    // setFamilyData(
    //   [...familyData].filter((familyMember) => familyMember.id !== member?.id)
    // );
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
  return (
    <div>
      <Box className="mb-[8px]">
        <Typography className="!m-text-h5 sm:!d-text-h5 !mr-[10px] !flex !items-center">
          Family member
          <Icon id="family-member-info" className="ml-[8px]">
            info_outlined_icon
          </Icon>
        </Typography>

        <TooltipUI
          anchorSelect="#family-member-info"
          place="bottom"
          content="Add your family member's information such as their first name, last name, date of birth, and relationship."
        />
      </Box>
      <Box>
        <Typography className="!m-text-body-md sm:!d-text-body-md">
          Add eligible family members who are currently living with you or are
          part of the household. The max number of family members you can add is
          (15). As a reminder, this is optional and you can fill this out at a
          later time.
        </Typography>
      </Box>
      <Box className="w-full pb-[100px] relative">
        {/* Show List of data items when the screen size is x-large and down */}
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
      </Box>
      <ConfirmDelete
        text={textForConfirmDelete}
        dialogTitle="family member"
        isDeleteDialogOpen={isDeleteDialogOpen}
        onClickDeleteOptionClose={onClickDeleteOptionClose}
        handleDeleteOption={handleDeleteFamilyMember}
      />{' '}
      <Dialog
        className="w-full"
        classes={{ paper: '!min-w-[90%] lg:!min-w-[50%] h-[82vh]' }}
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
        classes={{ paper: '!min-w-[90%] lg:!min-w-[50%] h-[82hv]' }}
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
    </div>
  );
}

export default FamilyMembersBlock;
