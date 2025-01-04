import { Box, ListItem, ListItemText, ListItemAvatar, ListItemButton, Typography } from '@mui/material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { FamilyMember } from '@myfile/api-client';
import dayjs from 'dayjs';

// {dayjs(userData.dateOfBirth).format('MM/DD/YYYY')}

interface FamilyMemberListItemProps {
  member: FamilyMember;
  onClickDeleteOptionOpen: (member: FamilyMember) => void;
  handleEditFamilyMember: (member: FamilyMember) => void;
  editAndDeleteIcons?: boolean;
  isProfilePage?: boolean;
  handleOpenDialog?: (member: FamilyMember) => void;
}

function FamilyMemberListItem({
  member,
  onClickDeleteOptionOpen,
  handleEditFamilyMember,
  editAndDeleteIcons,
  isProfilePage,
  handleOpenDialog
}: FamilyMemberListItemProps) {
  console.log(isProfilePage);
  return (
    <ListItem
      key={member.id}
      className="!py-[8px] !px-0 my-[8px] !border-2 !rounded-md flex"
      secondaryAction={
        !editAndDeleteIcons ? (
          <Box className="flex flex-row">
            {!isProfilePage && (
              <ListItemButton
                onClick={() => onClickDeleteOptionOpen(member)}
                className="!d-text-body-lg flex flex-row text-secondary"
              >
                <DeleteOutlineIcon />
              </ListItemButton>
            )}
            <ListItemButton
              onClick={() => {
                if (isProfilePage && handleOpenDialog) {
                  handleOpenDialog(member);
                } else {
                  handleEditFamilyMember(member);
                }
              }}
              className="!d-text-body-lg flex flex-row text-secondary"
            >
              <EditOutlinedIcon />
            </ListItemButton>
          </Box>
        ) : (
          <></>
        )
      }
    >
      <ListItemAvatar className="pl-[16px] !w-[20px]">
        <AccountCircleOutlinedIcon />
      </ListItemAvatar>
      <ListItemText className="flex flex-col flex-4 !w-3/4">
        <Typography className="pb-[4px] sm:!m-text-body-md !m-text-body-sm !w-3/4 !truncate !...">
          {member?.FirstName} {member?.LastName}
        </Typography>
        <Typography className="pb-[4px] sm:!m-text-body-md !m-text-body-sm w-3/4">
          {dayjs(member?.DOB).format('MM/DD/YYYY')}
        </Typography>
        <Typography className="pb-[4px] sm:!m-text-body-md !m-text-body-sm !w-3/4">{member?.Relationship}</Typography>
      </ListItemText>
    </ListItem>
  );
}

export default FamilyMemberListItem;
