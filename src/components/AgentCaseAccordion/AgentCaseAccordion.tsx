import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  FormControl,
  Icon,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography
} from '@mui/material';
import { BaseCase, BaseCaseCriterion, Case, GetUser } from '@myfile/api-client';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TooltipUI from '../TooltipUI/TooltipUI';
import AgentNotesBox from '../AgentNotesBox/AgentNotesBox';
import AgentChecklistItemBox from '../AgentChecklistItemBox/AgentChecklistItemBox';
// import { convertAgentRoleIntoAgency } from '../../assets/agent-role/agent-role';
import { useApi } from '../../utils/use-api';
import { useNavigate } from 'react-router-dom';
import AgentDialogNotes from '../AgentDialogNotes/AgentDialogNotes';
import AgentDialogApprovedROIGroup from '../AgentDialogApprovedROIGroup/AgentDialogApprovedROIGroup';
import { rulesetsFileTypeExtractor } from '../../utils/extract-file-types-from-criterion-rulesets';
import ChecklistOutlinedIcon from '@mui/icons-material/ChecklistOutlined';
import { useState } from 'react';
import dayjs from 'dayjs';
import queryString from 'query-string';
import { useTranslation } from 'react-i18next';
import { useBoundStore } from '../../store/store';
import { useAsync } from 'react-use';
import { renderDeadline } from '../../utils/deadlineCalculatiom';

interface AgentCaseAccordionProps {
  caseItem: Case;
  expanded: boolean;
  user: GetUser;
  userId: string;
  agentRole: string;
  onExpand: (id: string) => void;
  refreshCases: () => void;
}

export default function AgentCaseAccordion({
  caseItem,
  expanded,
  onExpand,
  userId,
  agentRole,
  refreshCases,
  user
}: AgentCaseAccordionProps) {
  const api = useApi();

  const [openNotesDialog, setOpenNotesDialog] = useState(false);

  const [currentWorkStageId, setCurrentWorkflowStageId] = useState<string>();

  const [expandNotes, setExpandNotes] = useState(false);

  const [loadingSubmittedNote, setLoadingSubmittedNote] = useState(false);

  const [openROIApprovedDialog, setOpenROIApprovedDialog] = useState(false);

  const navigate = useNavigate();

  const { t } = useTranslation('agent');

  const { setShowToastMessageForAction, setToastAction } = useBoundStore();

  const handleStatus = async (e: SelectChangeEvent, caseItem: BaseCase) => {
    await api.updateCase({
      requestBody: { Status: e.target.value as 'OPEN' | 'CLOSED' },
      caseId: caseItem.id ?? ''
    });
    setToastAction('CHANGE_STATUS_OF_APPLICATION_TOAST');
    setShowToastMessageForAction(true);
    refreshCases();
  };

  const navigateToChecklistItem = (e: React.SyntheticEvent<HTMLElement>, criterion: BaseCaseCriterion) => {
    e.stopPropagation();
    navigate(`/client/${userId}/case/${criterion.CaseId}/checklist-item/${criterion.id}`);
  };

  const navigateToUploadGenerator = (e: React.SyntheticEvent<HTMLElement>, criterion: BaseCaseCriterion) => {
    e.stopPropagation();
    const fileTypes = rulesetsFileTypeExtractor((criterion!.RuleSets as string | undefined) ?? '[]');

    const queryData = { fileTypes };
    navigate(
      `/client/${userId}/case/${criterion.CaseId}/checklist-item/${
        criterion.id
      }/upload-generator?${queryString.stringify(queryData)}`
    );
  };

  const downloadFile = (url: string, filename: string): Promise<void> => {
    return new Promise((resolve) => {
      const a = window.document.createElement('a');
      a.href = url;
      a.download = filename;
      a.style.display = 'none';
      window.document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        window.document.body.removeChild(a);
        resolve();
      }, 100);
    });
  };

  const downloadDocuments = async (criterion: BaseCaseCriterion) => {
    if (!criterion.CaseFiles?.length) {
      console.log('No files to download');
      return;
    }

    try {
      await api.logCaseFilesDownload({
        requestBody: { caseFileIds: criterion.CaseFiles.map((file) => file.id) }
      });

      for (const caseFile of criterion.CaseFiles) {
        try {
          const response = await api.getGeneratedFileDownloadUrl({
            generatedFileId: caseFile.GeneratedFileId ?? '',
            userId,
            caseFileId: caseFile.id,
            disposition: 'attachment'
          });

          if (response.downloadUrl) {
            await downloadFile(response.downloadUrl, caseFile.GeneratedFile?.OriginalFilename ?? `file-${caseFile.id}`);
          } else {
            console.error(`Failed to get download URL for file: ${caseFile.id}`);
          }
        } catch (error) {
          console.error(`Error downloading file ${caseFile.id}:`, error);
        }
      }
      setToastAction('DOWNLOAD_ALL_DOCUMENTS_TOAST');
      setShowToastMessageForAction(true);
    } catch (error) {
      console.error('Error in downloadDocuments:', error);
    }
  };

  const handleOpenROIApprovedDialog = (e: React.SyntheticEvent<HTMLElement>, workflowStageId?: string) => {
    e.stopPropagation();
    setCurrentWorkflowStageId(workflowStageId);
    setOpenROIApprovedDialog(true);
  };

  const handleApprovedChecklist = async () => {
    /**
     * A checklist is approve if all its workflow stage criterion are approve
     * This action is going to approve all workflow stage criterion.
     */
    await api.approveChecklist({ caseId: caseItem.id, workflowStageId: currentWorkStageId! });
    setOpenROIApprovedDialog(false);
    setToastAction('SEND_NEW_CHECKLIST_TO_CLIENT_TOAST');
    setShowToastMessageForAction(true);
    refreshCases();
  };

  const { value } = useAsync(() => {
    return api.getActivitiesForUser({
      userId: userId,
      activityType: 'AGENT_APPROVE_DOCUMENT_CHECKLIST',
      take: 10
    });
  }, []);

  const handleNoteFieldChange = async (updatedNote: string) => {
    setLoadingSubmittedNote(true);

    await api.addCaseNote({
      requestBody: {
        NoteText: updatedNote,
        CaseId: caseItem.id ?? '',
        NoteAudienceScope: ''
      }
    });

    refreshCases();

    setOpenNotesDialog(false);
    setLoadingSubmittedNote(false);
    setToastAction('ADDED_NEW_NOTE_TOAST');
    setShowToastMessageForAction(true);
  };

  const handleOpenNotesDialog = (e: React.SyntheticEvent<HTMLElement>) => {
    e.stopPropagation();
    setOpenNotesDialog(true);
  };

  const expandNotesBox = (e: React.SyntheticEvent<HTMLElement>) => {
    e.stopPropagation();
    setExpandNotes(!expandNotes);
  };

  const criteriaGrouped = caseItem.CaseCriteria?.sort((a, b) => {
    const aPosition = a.WorkflowStageCriterion?.WorkflowStage?.StagePosition;
    const bPosition = b.WorkflowStageCriterion?.WorkflowStage?.StagePosition;
    return parseInt(aPosition ?? '0', 10) - parseInt(bPosition ?? '0', 10);
  })?.reduce(
    (acc, item) => {
      const id = item.WorkflowStageCriterion?.CaseWorkflowStageId ?? '';
      if (acc[id]) {
        acc[id].push(item);
      } else {
        acc[id] = [item];
      }
      return acc;
    },
    {} as Record<string, BaseCaseCriterion[]>
  );

  // const caseNotes = caseItem.CaseNotes?.reverse() ?? [];

  const caseNotes = () => {
    const reversed = [];
    if (caseItem.CaseNotes) {
      for (let i = caseItem.CaseNotes.length - 1; i >= 0; i--) {
        reversed.push(caseItem.CaseNotes[i]);
      }
      return reversed;
    }
  };

  const applicationStatus = caseItem.Status;

  const criteria = Object.values(criteriaGrouped ?? {}).map((items) => {
    return {
      items: items.sort((a, b) => parseInt(a.Index ?? '0', 10) - parseInt(b.Index ?? '0', 10)),
      isApprovedChecklist: items.every((criterion) => criterion.CriterionFulfillmentStatus === 'DONE')
    };
  });

  const currentApplicationStageIndex = criteria.findIndex((item) => !item.isApprovedChecklist);

  const currentApplicationStage =
    criteria[currentApplicationStageIndex]?.items?.[0]?.WorkflowStageCriterion?.WorkflowStage;

  const getBuildingUnit = (checkCase: Case) => {
    const findAttribute = checkCase?.CaseAttributes?.find((attribute) => {
      if (attribute.name === 'buildingUnit') {
        return attribute.value;
      }
    });
    return findAttribute?.value ? findAttribute.value : '';
  };

  return (
    <>
      <Accordion
        key={caseItem.id}
        id={caseItem.id}
        className="!border-[1px] !border-darkGreyBorder !shadow-none mb-[16px]"
        expanded={expanded}
        onClick={() => {
          onExpand(caseItem.id);
        }}
        TransitionProps={{ timeout: 70 }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
          sx={{
            borderBottom: '1px solid #ccc',
            flexDirection: 'row-reverse'
          }}
          classes={{ root: '!max-h-[80px] !bg-disabledText ' }}
          // className="!flex !justify-between !w-full"
        >
          <Box className="flex flex-row w-[99%] px-[32px]">
            <Box
              className="flex flex-col items-start justify-center w-[40%] px-[8px]
            "
            >
              <Typography className="!d-text-body-md-bold !trucate ...">
                {caseItem?.CaseType === 'PATH' ? t('PATHApplicationName') : t('HPDApplicationName')}
              </Typography>
              {caseItem?.CaseType === 'HPD' && getBuildingUnit(caseItem) && (
                <Typography className="!mt-[2px] !d-text-body-sm !truncate ...">{getBuildingUnit(caseItem)}</Typography>
              )}
              {/* <Typography></Typography> */}
            </Box>
            <Box className="flex flex-row items-center w-[40%] justify-start px-[8px]">
              <Typography className="!d-text-body-md-bold !mr-[4px] !truncate !...">
                {t('applicationStatus')}
              </Typography>
              <Icon id="agent-application-status">info_outlined_icon</Icon>
              <TooltipUI
                anchorSelect="#agent-application-status"
                place="top"
                content={t('applicationStatusTooltip')}
                onHover={true}
                booletpoint={false}
              />
              <FormControl
                sx={{
                  '& fieldset': { border: 'none' },
                  '& .MuiInputBase-input': {
                    color:
                      applicationStatus === 'OPEN' ? '#4C4E52' : applicationStatus === 'CLOSED' ? '#5B23B0' : 'black',
                    fontSize: '16px',
                    fontWeight: '700',
                    lineHeight: '24px'
                  }
                }}
              >
                <Select
                  disabled={
                    agentRole === 'Sponsor' ||
                    agentRole === 'DHS Employee' ||
                    agentRole === 'DHS Administrator' ||
                    agentRole === 'CBO Supervisor' ||
                    agentRole === 'CBO Staffer'
                  }
                  value={caseItem.Status}
                  onChange={(event) => handleStatus(event, caseItem)}
                  className="select-status min-w-[100px]"
                  id={caseItem.id}
                  name="select-status"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MenuItem className="!text-[#4C4E52] !d-text-body-sm-bold select-status" value={'OPEN'}>
                    {caseItem?.CaseType === 'PATH' ? t('activePATH') : t('activeHPD')}
                  </MenuItem>
                  <MenuItem className="!text-[#5B23B0] !d-text-body-sm-bold select-status" value={'CLOSED'}>
                    {caseItem?.CaseType === 'PATH' ? t('closedPATH') : t('closedHPD')}
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box className="flex flex-row items-center w-[25%] justify-center px-[8px]">
              <Typography className="!d-text-body-md-bold !mr-[8px] !truncate ...">
                {t('dateAddedApplicationDocument')}
              </Typography>
              <Typography className="!d-text-label-sm !truncate ...">
                {dayjs(caseItem?.CreatedAt).format('MM/DD/YYYY')}
              </Typography>
            </Box>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            className="p-[16px]"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Box className="mb-[16px]">
              <AgentNotesBox
                caseNotes={caseNotes() ?? []}
                expandNotes={expandNotes}
                expandNotesBox={expandNotesBox}
                handleOpenNotesDialog={handleOpenNotesDialog}
                caseItem={caseItem}
              />
            </Box>
            <Box className="">
              {/* isApprovedChecklist */}
              {criteria.map(({ items }, index) => {
                const workflowStage = items?.[0]?.WorkflowStageCriterion?.WorkflowStage;

                const isPreviousChecklistApproved = index === 0 || criteria[index - 1]?.isApprovedChecklist;

                const content = isPreviousChecklistApproved ? (
                  <>
                    {items.map((criterion) => {
                      const accordionTitle = criterion?.WorkflowStageCriterion?.Name;

                      return (
                        <Box
                          key={criterion.id}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="hover:!bg-black hover:!bg-opacity-[4%]"
                        >
                          <AgentChecklistItemBox
                            criterion={criterion}
                            checkListitemName={accordionTitle}
                            downloadDocuments={downloadDocuments}
                            navigateToChecklistItem={navigateToChecklistItem}
                            navigateToUploadGenerator={navigateToUploadGenerator}
                            agentRole={agentRole}
                          />
                        </Box>
                      );
                    })}
                  </>
                ) : (
                  <Box className="p-[16px] mb-[8px] border-b-[2px] flex flex-row items-center justify-between">
                    {/** The below is not correct language as it applies to a single workflow PATH */}
                    {/* <Typography className="!d-text-body-sm">
                    Once all documents have been accepted from ROI documents checklist. You can request then next
                    checklist to your client.
                  </Typography> */}
                    <Typography className="!d-text-body-sm !mr-[24px]">{t('requestChecklistDiscription')} </Typography>
                    <Box>
                      {agentRole !== 'DHS Employee' &&
                        agentRole !== 'DHS Administrator' &&
                        agentRole !== 'PATH Employee' &&
                        agentRole !== 'PATH Administrator' && (
                          // TODO this is temp solution, will need tu update API CriterionFulfillmentStatus default values on backend
                          <Box className="w-full">
                            <Button
                              disabled={
                                agentRole === 'DHS Employee' ||
                                agentRole === 'DHS Administrator' ||
                                agentRole === 'CBO Staffer' ||
                                agentRole === 'CBO Supervisor'
                              }
                              variant="outlined"
                              onClick={(e) => handleOpenROIApprovedDialog(e, currentApplicationStage?.id)}
                              className={
                                agentRole === 'DHS Employee' ||
                                agentRole === 'DHS Administrator' ||
                                agentRole === 'CBO Staffer' ||
                                agentRole === 'CBO Supervisor'
                                  ? '!d-text-btn-sm !normal-case !py-[12px] !min-w-[127px] flex flex-row !text-nowrap'
                                  : '!text-secondary !normal-case !d-text-btn-sm w-full flex flex-row !border-secondary !py-[12px] !px-[20px] !text-nowrap'
                              }
                            >
                              <ChecklistOutlinedIcon className="mr-[8px]" />
                              {t('approveChecklist')}
                            </Button>
                          </Box>
                        )}
                    </Box>
                  </Box>
                );

                return (
                  <Box key={workflowStage?.id} id="roi-documents">
                    <Box className="mb-[16px]">
                      <Box className="flex flex-row items-center ">
                        <Typography className="!d-text-body-md-bold !mr-[24px]">{workflowStage?.StageName}</Typography>
                        <Typography className="!d-text-italic !text-primary">
                          {applicationStatus === 'OPEN' &&
                          value &&
                          caseItem.CaseType !== 'PATH' &&
                          isPreviousChecklistApproved
                            ? t('deadlineAgent', {
                                deadline: renderDeadline(
                                  index,
                                  caseItem?.CreatedAt,
                                  // @ts-expect-error LastModifiedAt property not presetn on GetUserActivityResponse type
                                  value[index]?.LastModifiedAt,
                                  value,
                                  isPreviousChecklistApproved
                                )
                              })
                            : ''}
                        </Typography>
                      </Box>
                    </Box>
                    <Box className="mb-[16px] border-darkGreyBorder  border-t-[1px] border-x-[1px] rounded">
                      {content}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
      <AgentDialogNotes
        handleCloseNotesDialog={() => setOpenNotesDialog(false)}
        openNotesDialog={openNotesDialog}
        handleNoteFieldChange={handleNoteFieldChange}
        loadingSubmittedNote={loadingSubmittedNote}
      />
      <AgentDialogApprovedROIGroup
        openROIApprovedDialog={openROIApprovedDialog}
        handleCloseROIApprovedDialog={() => setOpenROIApprovedDialog(false)}
        handleApprovedChecklist={handleApprovedChecklist}
        user={user}
      />
    </>
  );
}
