import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ApplicationChecklistItem from '../ApplicationChecklistItem/ApplicationChecklistItem';
import { GetCaseResponse } from '@myfile/api-client';

import { CaseFile } from '@myfile/api-client';

interface ApplicationChecklistAccordionProps {
  caseCriteria: CaseCriteriaObject;
  groupTitle: string;
  applicationType: string;
  caseFiles: Array<Array<CaseFile>>;
}

type CaseCriteriaObject = { [key: string]: GetCaseResponse['CaseCriteria'] };

type CaseCriterion = Exclude<GetCaseResponse['CaseCriteria'], undefined>[0];

function ApplicationChecklistAccordion({
  caseCriteria,
  caseFiles,
  groupTitle,
  applicationType
}: ApplicationChecklistAccordionProps) {
  const createObjectOfOptionalChecklist = (data: CaseCriterion[]) => {
    const result: CaseCriteriaObject = {};
    data?.forEach((item) => {
      const criterionSubGroupName = `${item.CriterionSubGroupName}`;
      if (result[criterionSubGroupName]) {
        result[criterionSubGroupName]?.push(item);
      } else {
        result[criterionSubGroupName] = [item];
      }
    });

    return result;
  };

  return (
    <>
      <Accordion className="mb-[8px]" defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon className="text-white" />}
          aria-controls="panel1-content"
          id="panel1-header"
          className="!bg-secondary !text-white"
        >
          <Typography className="!m-text-body-md-bold lg:!d-text-body-md-bold">{groupTitle}</Typography>
        </AccordionSummary>
        <AccordionDetails className="!p-0 !m-0">
          {Object.keys(caseCriteria ?? {})?.map((stageFullfillmentType) => {
            // console.log('caseCreatin', caseCriterion);
            return (
              <Box>
                {stageFullfillmentType === 'REQUIRED' && (
                  <Box>
                    {caseCriteria[stageFullfillmentType]?.map((caseCriterion) => {
                      return (
                        <ApplicationChecklistItem
                          checklistItemId={'checklist-item-' + caseCriterion.id}
                          key={caseCriterion.id}
                          applicationType={applicationType}
                          caseFiles={caseFiles}
                          caseCriterion={caseCriterion as CaseCriterion}
                        />
                      );
                    })}
                  </Box>
                )}
                {stageFullfillmentType === 'OPTIONAL' && (
                  <Box>
                    {Object.entries(createObjectOfOptionalChecklist(caseCriteria[stageFullfillmentType] ?? [])).map(
                      (value) => {
                        return (
                          <Box>
                            {value[0] !== 'null' && (
                              <Box className="bg-black px-[16px] py-[24px] ">
                                <Typography className="!m-text-body-md lg:!d-text-body-md !text-white">
                                  {value[0]}
                                </Typography>
                              </Box>
                            )}
                            <Box>
                              {value[1]?.map((caseCriterion) => {
                                return (
                                  <ApplicationChecklistItem
                                    checklistItemId={'checklist-item-' + caseCriterion.id}
                                    key={caseCriterion.id}
                                    applicationType={applicationType}
                                    caseFiles={caseFiles}
                                    caseCriterion={caseCriterion as CaseCriterion}
                                  />
                                );
                              })}
                            </Box>
                          </Box>
                        );
                      }
                    )}
                  </Box>
                )}
              </Box>
            );
          })}
        </AccordionDetails>
      </Accordion>
    </>
  );
}

export default ApplicationChecklistAccordion;
