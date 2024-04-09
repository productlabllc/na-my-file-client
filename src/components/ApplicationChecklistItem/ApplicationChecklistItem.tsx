import { Box, Typography, Button, Divider, Icon } from '@mui/material';
import ChecklistItemType from '../../types/ChecklistItemType';
import TooltipUI from '../TooltipUI/TooltipUI';
import { useNavigate, useLocation } from 'react-router-dom';

interface ApplicationChecklistItemProps {
  checklistItem: ChecklistItemType;
}

function ApplicationChecklistItem({
  checklistItem
}: ApplicationChecklistItemProps) {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location.pathname);
  const openCheckListItem = (checklistItem: ChecklistItemType) => {
    console.log(checklistItem);
    const urlCheckListItemTitle = checklistItem.docType
      .toLowerCase()
      .split(' ')
      .join('-');
    console.log(urlCheckListItemTitle);
    navigate(
      `${location.pathname}/${urlCheckListItemTitle}/${checklistItem.id}`
    );
  };

  return (
    <>
      <Box className="flex flex-row">
        <Box className="grow">
          <Typography className="!m-text-italic !italic !text-primary !mb-[8px]">
            {checklistItem.documents.length === 0 && 'Not yet started'}
          </Typography>
          <Typography className="!mb-[16px] !m-text-body-md lg:!d-text-body-md ">
            {checklistItem.title}
          </Typography>
          <Button
            onClick={() => openCheckListItem(checklistItem)}
            variant="outlined"
            className="sm:!mr-[16px] !flex-1 !m-text-btn-md lg:!d-text-btn-sm !mr-2 !border-secondary !text-secondary !h-[40px] !normal-case"
          >
            Upload this document
          </Button>
        </Box>
        <Box className="!flex !items-center">
          <Icon id="checklist-item">info_outlined_icon</Icon>
          <TooltipUI
            anchorSelect="#checklist-item"
            place="left"
            content={checklistItem.info}
          />
        </Box>
      </Box>
      <Divider className="!my-[12px] lg:!my-[16px]"></Divider>
    </>
  );
}

export default ApplicationChecklistItem;
