import { ListItem, ListItemText, ListItemAvatar, Typography } from '@mui/material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import dayjs from 'dayjs';

// import FamilyMemberType from '../../types/FamilyMemberType';
import { FamilyMember } from '@namyfile/api-client';

interface FamilyMemberListItemProps {
  member: FamilyMember;
}

function FamilyMemberListItemNoAction({ member }: FamilyMemberListItemProps) {
  return (
    <ListItem key={member.id} className="!py-[8px] !px-0 my-[8px] !border-2 !rounded-md flex">
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

export default FamilyMemberListItemNoAction;
