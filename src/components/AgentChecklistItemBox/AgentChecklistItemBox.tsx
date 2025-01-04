import { Box, Typography, Button } from '@mui/material';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import { BaseCaseCriterion } from '@myfile/api-client';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

interface AgentChecklistItemBox {
  criterion: BaseCaseCriterion;
  checkListitemName: string | undefined;
  downloadDocuments: (criterion: BaseCaseCriterion) => void;
  navigateToChecklistItem: (e: React.SyntheticEvent<HTMLElement>, criterion: BaseCaseCriterion) => void;
  navigateToUploadGenerator: (e: React.SyntheticEvent<HTMLElement>, criterion: BaseCaseCriterion) => void;
  agentRole: string;
}

function AgentChecklistItemBox({
  agentRole,
  criterion,
  checkListitemName,
  downloadDocuments,
  navigateToChecklistItem,
  navigateToUploadGenerator
}: AgentChecklistItemBox) {
  const { t } = useTranslation('agent');
  const [caseFilesLength, setCaseFilesLength] = useState(0);

  useEffect(() => {
    if (criterion?.CaseFiles) {
      setCaseFilesLength(criterion?.CaseFiles?.length);
    }
  }, [criterion]);

  return (
    <Box
      key={criterion.id}
      onClick={(e: React.SyntheticEvent<HTMLElement>) => {
        navigateToChecklistItem(e, criterion);
      }}
      className="p-[16px] border-b-[1px] border-darkGreyBorder flex flex-row items-center justify-between"
    >
      <Typography className="!d-text-body-sm !text-wrap w-[40%]">
        {/* {criterion?.WorkflowStageCriterion?.Name} */}
        {checkListitemName}
      </Typography>
      <Box className="w-[60%] xl:w-[50%] flex flex-row items-center justify-between">
        <Button
          variant="text"
          onClick={(e) => {
            navigateToUploadGenerator(e, criterion);
          }}
          className={
            agentRole === 'Sponsor'
              ? '!d-text-btn-sm !normal-case !py-[12px] !min-w-[127px]'
              : `!text-secondary !normal-case !py-[12px] !d-text-btn-sm`
          }
          disabled={agentRole === 'Sponsor'}
        >
          <FileUploadOutlinedIcon className="mr-[8px]" />
          {t('noFilesInChecklistButton')}
        </Button>
        <Box
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Button
            variant="text"
            onClick={() => {
              downloadDocuments(criterion);
            }}
            className={
              caseFilesLength <= 0
                ? '!d-text-btn-sm !normal-case !py-[12px] !min-w-[127px]'
                : '!text-secondary !normal-case !py-[12px] !d-text-btn-sm'
            }
            disabled={caseFilesLength <= 0}
          >
            <FolderOutlinedIcon className="mr-[8px]" />
            {t('dowloadAll')}
          </Button>
        </Box>

        <Typography>{`${t('numberDocs')}${caseFilesLength}`}</Typography>
      </Box>
    </Box>
  );
}

export default AgentChecklistItemBox;
