import { Box, Typography, Button, Divider, Icon } from '@mui/material';
// import ChecklistItemType from '../../types/ChecklistItemType';
import AddIcon from '@mui/icons-material/Add';
import EditDocumentIcon from '../../assets/icons/edit_document.svg';

import TooltipUI from '../TooltipUI/TooltipUI';
import { useNavigate, useLocation } from 'react-router-dom';
import { CaseCriterion, CaseFile, GetCaseResponse } from '@myfile/api-client';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { Constants } from '@myfile/api-client';
const CaseFileTypes: Constants['CaseFileStatus'] = {
  ACCEPTED: 'ACCEPTED',
  PENDING: 'PENDING',
  REJECT: 'REJECT',
  UNDER_REVIEW: 'UNDER_REVIEW'
};

interface ApplicationChecklistItemProps {
  caseCriterion: Exclude<GetCaseResponse['CaseCriteria'], undefined>[0];
  applicationType: string;
  caseFiles: Array<Array<CaseFile>>;
  checklistItemId: string;
}

function ApplicationChecklistItem({ caseCriterion, applicationType, checklistItemId }: ApplicationChecklistItemProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation('applications');

  const openCheckListItem = (criterion: CaseCriterion) => {
    // Case criteria defined here, check after cases have other then ALL checklist type
    const urlCheckListItemTitle = criterion.WorkflowStageCriterion?.CriterionGroupName?.toLowerCase()
      .split(' ')
      .join('-')
      .split('/')
      .join('-');

    navigate(`${location.pathname}/${urlCheckListItemTitle}/${criterion.id}`);
  };

  // const documents = caseFiles.find((ele) => ele[0].CaseCriterionId === caseCriterion.id) ?? [];
  // const documents = caseFiles;

  const criteria = caseCriterion;

  const criterionName = caseCriterion.Name;
  const criterionGroupName = caseCriterion.CriterionGroupName;
  const findAnyRejectDocumentStatus = useMemo(() => {
    // console.
    return criteria.CaseFiles?.find((file) => file.Status === CaseFileTypes.REJECT.toString());
  }, [criteria]);

  // console.log('criteria', criteria);
  return (
    <>
      <Box className="flex flex-row px-[16px] py-[24px]">
        <Box className="grow">
          {criteria.CaseFiles && criteria?.CaseFiles?.length < 1 && (
            <Typography className="!m-text-body-sm lg:!d-text-body-sm !text-primary !italic !mb-[12px]">
              {t('notStarted')}
            </Typography>
          )}
          {criteria.CaseFiles && criteria.CaseFiles.length > 0 && findAnyRejectDocumentStatus && (
            <Typography className="!m-text-body-sm lg:!d-text-body-sm !text-[#A81D35]  !italic !text- !mb-[12px]">
              {t('actionRequired')}
            </Typography>
          )}
          <Typography className="!mb-[16px] !m-text-body-md lg:!d-text-body-md ">
            {caseCriterion.WorkflowStageCriterion?.Name}
          </Typography>
          {criteria.CaseFiles && criteria.CaseFiles?.length > 0 ? (
            <Button
              variant="text"
              onClick={() => openCheckListItem(caseCriterion)}
              className="!text-secondary !py-[12px] !px-[10px] !normal-case"
            >
              <img className="!w-[20px] !h-[20px] mr-[8px]" src={EditDocumentIcon}></img>
              <Typography className="!m-text-btn-md md:!d-text-btn-md !text-center pt-[3px]">
                {t('reviewDocuments')}
              </Typography>
            </Button>
          ) : (
            <Button
              onClick={() => openCheckListItem(caseCriterion)}
              variant="outlined"
              className="!mr-2 !border-secondary !text-secondary !py-[12px] !px-[20px] !normal-case !flex !flex-row !items-center"
            >
              <AddIcon className="!text-[20px] mr-[8px]"></AddIcon>
              <Typography className="!m-text-btn-md md:!d-text-btn-md !text-center pt-[3px]">
                {t('addDocument')}
              </Typography>
            </Button>
          )}
        </Box>
        <Box className="!flex !items-center">
          <Icon id={checklistItemId}>info_outlined_icon</Icon>
          <TooltipUI
            anchorSelect={'#' + checklistItemId}
            place="left"
            // @ts-expect-error Argument of type '
            content={t(`tooltip.${applicationType}.${criterionGroupName!}_${criterionName!}`)}
          />
        </Box>
      </Box>
      <Divider></Divider>
    </>
  );
}

export default ApplicationChecklistItem;
