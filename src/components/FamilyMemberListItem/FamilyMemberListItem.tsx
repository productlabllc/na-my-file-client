import {
  Box,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemButton,
  Typography
} from '@mui/material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import FamilyMember from '../../types/FamilyMember';

interface FamilyMemberListItemProps {
  member: FamilyMember;
  onClickDeleteOptionOpen: (member: FamilyMember) => void;
  handleEditFamilyMember: (memberId: string) => void;
}

function FamilyMemberListItem({
  member,
  onClickDeleteOptionOpen,
  handleEditFamilyMember
}: FamilyMemberListItemProps) {
  return (
    <ListItem
      key={member.id}
      className="!py-[8px] !px-0 my-[8px] !border-2 !rounded-md flex"
      secondaryAction={
        <Box className="flex flex-row w-[100px]">
          <ListItemButton
            onClick={() => onClickDeleteOptionOpen(member)}
            className="!d-text-body-lg flex flex-row text-secondary"
          >
            <DeleteOutlineIcon />
          </ListItemButton>
          <ListItemButton
            onClick={() => handleEditFamilyMember(member.id)}
            className="!d-text-body-lg flex flex-row text-secondary"
          >
            <EditOutlinedIcon />
          </ListItemButton>
        </Box>
      }
    >
      <ListItemAvatar className="pl-[16px] !w-[20px]">
        <AccountCircleOutlinedIcon />
      </ListItemAvatar>
      <ListItemText className="flex flex-col flex-4 !w-3/4">
        <Typography className="pb-[4px] sm:!m-text-body-md !m-text-body-sm !w-3/4 !truncate !...">
          {member?.firstName} {member?.lastName}
        </Typography>
        <Typography className="pb-[4px] sm:!m-text-body-md !m-text-body-sm w-3/4">
          {member?.dateOfBirth}
        </Typography>
        <Typography className="pb-[4px] sm:!m-text-body-md !m-text-body-sm !w-3/4">
          {member?.relationship}
        </Typography>
      </ListItemText>
    </ListItem>
  );
}

export default FamilyMemberListItem;
