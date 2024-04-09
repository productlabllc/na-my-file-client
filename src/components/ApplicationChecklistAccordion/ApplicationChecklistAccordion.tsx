import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChecklistGroupType from '../../types/ChecklistGroupType';
import ApplicationChecklistItem from '../ApplicationChecklistItem/ApplicationChecklistItem';

interface ApplicationChecklistAccordionProps {
  checklistType: ChecklistGroupType;
}

function ApplicationChecklistAccordion({
  checklistType
}: ApplicationChecklistAccordionProps) {
  return (
    <>
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon className="text-white" />}
          aria-controls="panel1-content"
          id="panel1-header"
          className="!bg-secondary !text-white"
        >
          <Typography className="!m-text-body-md-bold lg:!d-text-body-md-bold">
            {checklistType.category}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {checklistType.typeOfDocument.map((checklistItem) => (
            <ApplicationChecklistItem
              key={checklistItem.id}
              checklistItem={checklistItem}
            />
          ))}
        </AccordionDetails>
      </Accordion>
    </>
  );
}

export default ApplicationChecklistAccordion;
