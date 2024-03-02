import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Icon,
  List,
  Tooltip,
  ClickAwayListener,
  Typography
} from '@mui/material';

import GlobalNavigation from '../../layouts/GlobalNavigation/GlobalNavigation';
import ConfirmDelete from '../../components/ConfirmDelete/ConfirmDelete';
import FamilyMemberForm from '../../components/FamilyMemberForm/FamilyMemberForm';
import FamilyMemberListItem from '../../components/FamilyMemberListItem/FamilyMemberListItem';

import FamilyMember from '../../types/FamilyMember';
import { useBoundStore } from '../../store/store';

function AddFamilyMember() {
  const navigate = useNavigate();
  const [textForConfirmDelete, setTextForConfirmDelete] = useState(
    'Are you sure you want to delete this family member ?'
  );
  const {
    addFamilyMember,
    getFamilyMembers,
    removeFamilyMember,
    updateFamilyMember
  } = useBoundStore();

  const [openFamilyToolTip, setOpenFamilyToolTip] = useState(false);
  const [familyData, setFamilyData] = useState<FamilyMember[]>([
    ...getFamilyMembers()
  ]);
  const [addFamilyWindow, setAddFamilyWindow] = useState(false);
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

  const closeFormFamilyWindow = () => {
    setAddFamilyWindow(false);
  };

  const handleFamilyTooltip = () => {
    setOpenFamilyToolTip((prev) => !prev);
  };

  const handleFamilyTootltipClose = () => {
    setOpenFamilyToolTip(false);
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

  const updateFamilyMemberList = (newFamilyMember: FamilyMember) => {
    // setFamilyData([newFamilyMember, ...familyData]);
    addFamilyMember(newFamilyMember);
  };

  const handleEditFamilyMember = (memberId: string) => {
    navigate(`/family-member/edit/${memberId}`);
  };

  return (
    <>
      <Box className="fixed top-0 w-full">
        <GlobalNavigation />
      </Box>
      {!addFamilyWindow ? (
        <Box>
          <Box className="!mt-[80px] sm:flex sm:justify-center w-[100%]">
            <Box className="!px-[16px] w-full sm:w-[600px] !mb-[40px]">
              <Box className="flex flex-row mb-[8px]">
                <Typography className="!m-text-h5 sm:!d-text-h5 !mr-[10px]">
                  Family member
                </Typography>
                <ClickAwayListener onClickAway={handleFamilyTootltipClose}>
                  <Tooltip
                    arrow
                    disableHoverListener
                    describeChild
                    title={
                      <Typography>
                        Select any family members or yourself that will be
                        attach to the document.
                      </Typography>
                    }
                    className="!h-[32px] !flex !items-center"
                    onClose={handleFamilyTooltip}
                    open={openFamilyToolTip}
                    disableFocusListener
                    placement="bottom"
                    PopperProps={{
                      disablePortal: true,
                      className: '!w-[270px] !opacity-100'
                    }}
                    classes={{ tooltip: '!text-red', popper: '!text-red' }}
                  >
                    <Icon onClick={handleFamilyTooltip}>info_outlined</Icon>
                  </Tooltip>
                </ClickAwayListener>
              </Box>
              <Box>
                <Typography className="!m-text-body-md sm:!d-text-body-md">
                  Add eligible family members who are currently living with you
                  or are part of the household. The max number of family members
                  you can add is (15). As a reminder, this is optional and you
                  can fill this out at a later time.
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
            </Box>
            <ConfirmDelete
              text={textForConfirmDelete}
              dialogTitle="family member"
              isDeleteDialogOpen={isDeleteDialogOpen}
              onClickDeleteOptionClose={onClickDeleteOptionClose}
              handleDeleteOption={handleDeleteFamilyMember}
            />
          </Box>
          <Box
            sx={{ boxShadow: '0px -4px 4px -4px black' }}
            className="!fixed !py-[16px] !h-min-[70px] !z-20 bottom-0 w-full inset-x-0 !flex !flex-col !justify-center !bg-white !items-center"
          >
            <Button
              className="!mb-[16px] !w-[94%] md:!w-[660px] !h-10 !m-text-btn-md !normal-case !text-secondary !border-secondary"
              variant="outlined"
              component="label"
              onClick={() => setAddFamilyWindow(true)}
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
      ) : (
        <FamilyMemberForm
          closeFormFamilyWindow={closeFormFamilyWindow}
          familyData={familyData}
          updateFamilyMemberList={updateFamilyMemberList}
        />
      )}
    </>
  );
}

export default AddFamilyMember;
