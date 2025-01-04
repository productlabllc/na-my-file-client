import { useState } from 'react';
import { Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
interface FAQAccordionProps {
  title?: string;
  details?: string;
}

function FAQAccordion({ title, details }: FAQAccordionProps) {
  //   const CustomExpandIcon = () => {
  //     return (
  //       <Box
  //         sx={{
  //           '.Mui-expanded & > .collapsIconWrapper': {
  //             display: 'none'
  //             // borderBottom: '2px solid #1976d2'
  //           },
  //           '.expandIconWrapper': {
  //             display: 'none'
  //           },
  //           '.Mui-expanded & > .expandIconWrapper': {
  //             display: 'block'
  //             // borderBottom: '2px solid #1976d2'
  //             // alignItems: 'revert'
  //           }
  //           //   '.Mui-expanded': {
  //           //     borderBottom:
  //           //   }
  //         }}
  //       >
  //         <div className="expandIconWrapper">-</div>
  //         <div className="collapsIconWrapper">+</div>
  //       </Box>
  //     );
  //   };
  const [expanded, setExpanded] = useState('');
  //   console.log(expanded);
  return (
    <Accordion
      className="w-full"
      expanded={expanded === 'exp1'}
      onChange={() => (expanded === 'exp1' ? setExpanded('') : setExpanded('exp1'))}
    >
      <AccordionSummary
        // sx={{
        //   '.Mui-expanded': {
        //     borderBottom: '2px solid #1976d2'
        //   }
        // }}
        sx={{
          borderBottom: expanded ? '1px solid black' : 'none', // Inline border style using sx
          transition: 'border 0.3s ease'
        }}
        expandIcon={
          expanded ? (
            <RemoveIcon className="lg:!d-text-body-lg-bold !m-text-body-lg-bold !text-secondary"></RemoveIcon>
          ) : (
            <AddIcon className="lg:!d-text-body-lg-bold !m-text-body-lg-bold !text-secondary"></AddIcon>
          )
        }
        aria-controls="panel1-content"
        id="panel1-header"
        // className={`${expanded ? '!border !border-blue-500' : ''} flex justify-between items-center`}
      >
        <Typography className="!m-text-body-lg-bold lg:!d-text-body-lg-bold lg:!max-w-[90%]">{title}</Typography>
      </AccordionSummary>
      <AccordionDetails className="!py-[24px]">
        <Typography className="!m-text-body-md lg:!d-text-body-md">{details}</Typography>
      </AccordionDetails>
    </Accordion>
  );
}

export default FAQAccordion;
