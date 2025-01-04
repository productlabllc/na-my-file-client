import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useApi } from '../../utils/use-api';
import { useAsync, useAsyncRetry } from 'react-use';
import { useBoundStore } from '../../store/store';
import { rulesetsFileTypeExtractor } from '../../utils/extract-file-types-from-criterion-rulesets';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import queryString from 'query-string';

import {
  Box,
  Breadcrumbs,
  Typography,
  Button,
  Divider,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  Dialog,
  IconButton,
  CircularProgress,
  Icon
} from '@mui/material';
// import RestorePageOutlinedIcon from '@mui/icons-material/RestorePageOutlined';
// import FindInPageOutlinedIcon from '@mui/icons-material/FindInPageOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CircleIcon from '@mui/icons-material/Circle';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseIcon from '@mui/icons-material/Close';

import AgentMainBox from '../../layouts/AgentMainBox/AgentMainBox';
import AgentHeader from '../../layouts/AgentHeader/AgentHeader';
import AgentSideBar from '../../layouts/AgentSideBar/AgentSideBar';

import AlertSuccessToastMessage from '../../components/AlertSuccessToastMessage/AlertSuccessToastMessage';
import AlertInfoToastMessage from '../../components/AlertInfoToastMessage/AlertInfoToastMessage';
import PDFReader from '../../components/PDFReader/PDFReader';
import TooltipUI from '../../components/TooltipUI/TooltipUI';
import AgentDialogResubmitDocument from '../../components/AgentDialogResubmitDocument/AgentDialogResubmitDocument';
import AgentOnErrorLoadToast from '../../components/AgentOnErrorLoadToast/AgentOnErrorLoadToast';
import AlertErrorToastMessage from '../../components/AlertErrorToastMessage/AlertErrorToastMessage';

// Do not create new types:
// import { PENDING, UNDER_REVIEW, RE_UPLOAD, ACCEPTED } from '../../types/AcitivityStatuses';

import { Constants } from '@myfile/api-client';
const CaseFileTypes: Constants['CaseFileStatus'] = {
  ACCEPTED: 'ACCEPTED',
  PENDING: 'PENDING',
  REJECT: 'REJECT',
  UNDER_REVIEW: 'UNDER_REVIEW'
};

function AgentChecklistItem() {
  const TIMES_TO_REFETCH_IMG = 16;
  const navigate = useNavigate();
  const api = useApi();
  const params = useParams();
  const location = useLocation();
  const [documentStatus, setDocumentStatus] = useState(CaseFileTypes.PENDING.toString());
  const [openResubmitDocumentDialog, setOpenResubmitDocumentDialog] = useState(false);
  const [issueDescription, setIssueDescription] = useState('');
  const [openPdfViewerDialog, setOpenPdfViewerDialog] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [fileIndex, setFileIndex] = useState(0);
  const { showToastMessageForAction, setShowToastMessageForAction, toastAction, setToastAction, getUserData } =
    useBoundStore();

  const [user] = useState(getUserData());
  const [loaded, setLoaded] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [isErrorOnImgLoad, setErrorOnImgLoad] = useState(false);

  const { t } = useTranslation('agent');

  // Fetch client's info
  const { value: clientInfo } = useAsync(() => {
    return api.getUserAdmin({ userId: params.clientId ?? '' });
  }, []);

  // Fetch client's files
  const { value: fetchedFiles, retry: retryGetCriteria } = useAsyncRetry(() => {
    return api.getCriteriaCaseFiles({ caseCriterionId: params.checklistItemId ?? '' });
  }, []);

  const {
    value: cases
    // loading: loadingCases,
  } = useAsync(() => api.getUserCasesAdmin({ userId: params.clientId ?? '' }), []);

  const getCriteriaCaseFiles = useMemo(
    () =>
      fetchedFiles?.sort((a, b) => {
        const dateA = a.CreatedAt ? new Date(a.CreatedAt).getTime() : Infinity;
        const dateB = b.CreatedAt ? new Date(b.CreatedAt).getTime() : Infinity;
        return dateB - dateA;
      }),
    [fetchedFiles]
  );

  // Check if all all document statuses are approved
  const checkIfAllHasStatusApproved = useMemo(() => {
    if (getCriteriaCaseFiles && getCriteriaCaseFiles.length > 0) {
      return getCriteriaCaseFiles?.every((document) => document.Status === CaseFileTypes.ACCEPTED.toString());
    } else false;
  }, [getCriteriaCaseFiles]);

  // Find specific case
  const foundCase = useMemo(() => {
    return cases?.find((caseD) => caseD.id === params.caseId);
  }, [cases, params.caseId]);

  // Find number of CARES ID
  const findCaresID = useMemo(() => {
    console.log('foundCase', foundCase);
    if (foundCase?.CaseType === 'HPD') {
      if (foundCase && foundCase.CaseAttributes) {
        const findAttribute = foundCase?.CaseAttributes.find((attribute) => attribute.name === 'ssn');
        if (findAttribute) {
          return findAttribute.value;
        } else {
          return '';
        }
      }
    }
    if (foundCase?.CaseType === 'PATH') {
      if (foundCase && foundCase.AgencyCaseIdentifier) {
        return foundCase.AgencyCaseIdentifier;
      } else {
        return '';
      }
    }
  }, [foundCase]);

  // Find case criteria name
  const checklistItemName = useMemo(() => {
    if (foundCase) {
      const checklistItem = foundCase?.CaseCriteria?.find((newCriteria) => newCriteria.id === params.checklistItemId);
      const fileTypes = rulesetsFileTypeExtractor((checklistItem?.RuleSets as string | undefined) ?? '[]');
      if (fileTypes) {
        const generateChecklistItemName = fileTypes.join(', ');

        return generateChecklistItemName;
      } else return t('notFound');
    }
  }, [foundCase, params.checklistItemId]);

  // Find checklist ruleset
  const checkListitemRuleSet = useMemo(() => {
    if (foundCase) {
      const checklistItem = foundCase?.CaseCriteria?.find((newCriteria) => newCriteria.id === params.checklistItemId);
      // const fileTypes = rulesetsFileTypeExtractor((checklistItem?.RuleSets as string | undefined) ?? '[]');
      return checklistItem?.RuleSets;
    }
  }, [foundCase, params.checklistItemId]);

  // Get current case file
  const currentCaseFile = useMemo(() => {
    if (getCriteriaCaseFiles && getCriteriaCaseFiles?.length > 0) return getCriteriaCaseFiles[fileIndex];
    else return;
  }, [getCriteriaCaseFiles, fileIndex]);

  const document = currentCaseFile?.GeneratedFile;

  useEffect(() => {
    if (currentCaseFile && currentCaseFile.Status) {
      setDocumentStatus(currentCaseFile.Status);
    }
    // if (document && document.CaseFiles && document.CaseFiles.length > 0) {
    //   console.log('document status', document.Status);
    //   setDocumentStatus(document.CaseFiles[fileIndex].Status);
    // }
  }, [currentCaseFile]);

  const {
    value: thumbnailValue,
    loading: thumbnailLoading,
    retry: retryThumbnail,
    error: errorThumbnail
  } = useAsyncRetry(async () => {
    return api.getGeneratedTfileThumbnailDownloadUrl({
      generatedFileId: document?.id ?? '',
      userId: params.clientId,
      isPreview: true
    });
  }, [document?.id]);

  // const { value, retry: retryPDF } = useAsyncRetry(async () => {
  //   return api.getGeneratedFileDownloadUrl({
  //     generatedFileId: document?.id ?? '',
  //     userId: params.clientId,
  //     caseFileId: document?.id ?? ''
  //   });
  // }, [document?.id]);

  useEffect(() => {
    if (user?.StakeholderGroupRoles) {
      setUserRole(user.StakeholderGroupRoles[0]?.StakeholderGroupRole?.Name ?? '');
    }

    if (getCriteriaCaseFiles && getCriteriaCaseFiles.length > 0)
      setIssueDescription(getCriteriaCaseFiles[fileIndex].ReasonForResubmit ?? '');
  }, [api, getCriteriaCaseFiles, fileIndex, user.StakeholderGroupRoles]);

  const { downloadUrl: thumbnailDownloadUrl } = thumbnailValue ?? {};
  // const { downloadUrl } = value ?? {};

  const pdfViewer = useCallback(() => {
    if (document?.id && params.clientId) {
      return <PDFReader id={document.id} userId={params.clientId} />;
    }
  }, [document?.id, params.clientId]);

  const updateIssueDescription = async (description: string) => {
    const caseFile = getCriteriaCaseFiles?.[fileIndex];
    await api.updateCaseFile({
      id: caseFile!.id,
      requestBody: {
        ReasonForResubmit: description,
        Status: documentStatus
      }
    });
    setIssueDescription(description);
    setToastAction('SHOW_STATUS_CHANGE_TOAST');
    setShowToastMessageForAction(true);

    retryGetCriteria();
  };

  const handleDocumentStatus = async (e: SelectChangeEvent) => {
    const status = e.target.value;
    setIssueDescription('');
    setDocumentStatus(status);
    const caseFile = getCriteriaCaseFiles?.[fileIndex];
    if (status !== CaseFileTypes.REJECT.toString()) {
      await api.updateCaseFile({
        id: caseFile!.id,
        requestBody: {
          Status: status
        }
      });
    }

    if (e.target.value === CaseFileTypes.REJECT.toString()) {
      setOpenResubmitDocumentDialog(true);
    } else if (e.target.value === CaseFileTypes.UNDER_REVIEW.toString()) {
      setToastAction('SHOW_STATUS_CHANGE_TOAST');
      setShowToastMessageForAction(true);
      retryGetCriteria();
    } else if (e.target.value === CaseFileTypes.ACCEPTED.toString()) {
      setToastAction('SHOW_STATUS_CHANGE_TOAST');
      setShowToastMessageForAction(true);
      retryGetCriteria();
    } else {
      setToastAction('SHOW_STATUS_CHANGE_TOAST');
      setShowToastMessageForAction(true);
      retryGetCriteria();
    }
  };

  const downloadFile = async (url: string, filename: string) => {
    // Create a new anchor element
    const a = window.document.createElement('a');
    a.href = url;
    a.download = filename;
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
  };

  const downloadDocuments = async (
    id = document!.id,
    filename = document?.OriginalFilename,
    caseFileId = currentCaseFile?.id
  ) => {
    const downloadUrl = await api.getGeneratedFileDownloadUrl({
      generatedFileId: id,
      userId: params.clientId,
      caseFileId,
      disposition: 'attachment'
    });

    await downloadFile(downloadUrl.downloadUrl!, filename!);

    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1500);
    });
  };

  const downloadAllDocuments = async () => {
    const length = getCriteriaCaseFiles?.length || 0;
    for (let i = 0; i <= length; i++) {
      const cf = getCriteriaCaseFiles?.[i];
      if (cf) {
        await downloadDocuments(cf.GeneratedFile!.id, cf.GeneratedFile?.OriginalFilename, cf.id);
      }
    }
  };

  const handleCloseResubmitDocumentDialog = async () => {
    const caseFile = getCriteriaCaseFiles?.[fileIndex];

    setOpenResubmitDocumentDialog(false);

    setDocumentStatus(CaseFileTypes.UNDER_REVIEW.toString());

    await api.updateCaseFile({
      id: caseFile!.id,
      requestBody: {
        Status: CaseFileTypes.UNDER_REVIEW.toString()
      }
    });
  };

  const handleSubmitCloseDialog = async () => {
    setOpenResubmitDocumentDialog(false);
  };

  const navigateToUploadPage = () => {
    console.log('User role: ', userRole);
    const fileTypes = rulesetsFileTypeExtractor((checkListitemRuleSet as string | undefined) ?? '[]');
    const queryData = { fileTypes };
    navigate(`${location.pathname}/upload-generator?${queryString.stringify(queryData)}`);
  };

  const nextDocument = () => {
    setFileIndex((prev) => {
      if (getCriteriaCaseFiles && prev + 1 < getCriteriaCaseFiles?.length) {
        setErrorOnImgLoad(false);
        setShowToastMessageForAction(false);
        setToastAction('');
        return prev + 1;
      } else {
        return prev;
      }
    });
  };

  const prevDocument = () => {
    setFileIndex((prev) => {
      if (getCriteriaCaseFiles && prev > 0) {
        setErrorOnImgLoad(false);
        setShowToastMessageForAction(false);
        setToastAction('');
        return prev - 1;
      } else {
        return prev;
      }
    });
  };

  const handleCloseToastMessage = () => {
    setShowToastMessageForAction(false);
    console.log(showToastMessageForAction);
  };

  // AGENT_ADD_NEW_CASE_NOTE

  const renderToastOnAction = useCallback(
    (action: string) => {
      switch (action) {
        case 'SHOW_STATUS_CHANGE_TOAST':
          return (
            <AlertSuccessToastMessage
              handleCloseToastMessage={handleCloseToastMessage}
              text={t('statusDocumentUpdated')}
            />
          );
        case 'SHOW_UPLOAD_TOAST':
          // setTimeout(() => setShowToastMessageForAction(false), 4000);
          return (
            <AlertSuccessToastMessage handleCloseToastMessage={handleCloseToastMessage} text={t('documentUploaded')} />
          );
        case 'SHOW_DOWNLOAD_TOAST':
          return (
            <AlertSuccessToastMessage handleCloseToastMessage={handleCloseToastMessage} text={t('documentDowloaded')} />
          );
        case 'UPLOADED_DOCUMENT':
          return (
            <AlertSuccessToastMessage handleCloseToastMessage={handleCloseToastMessage} text={t('documentUploaded')} />
          );
        case 'ON_ERROR_LOAD':
          return <AgentOnErrorLoadToast />;
        case 'ERROR_MESSAGE':
          return (
            <AlertInfoToastMessage
              handleCloseToastMessage={handleCloseToastMessage}
              text={t('documentTimeProcessing')}
            />
          );
        case 'ERROR_ON_FETCH':
          return (
            <AlertErrorToastMessage handleCloseToastMessage={handleCloseToastMessage} text={t('errorProcessing')} />
          );
      }
    },
    [toastAction]
  );

  const [showSpinnerOnErrorLoad, setShowSpinnerOnErrorLoad] = useState(true);

  // Check if image fully loaaded with url
  const timeRef = useRef(TIMES_TO_REFETCH_IMG);
  const checkIfImageLoad = (url: string | any) => {
    return new Promise((resolve, reject) => {
      const loadImage = (times: number) => {
        console.log('times', times);
        const img = new Image();
        img.src = url;
        img.onload = () => {
          resolve('fullfilled');
        };

        img.onerror = () => {
          if (times > 0 && !errorThumbnail) {
            setShowToastMessageForAction(true);
            setToastAction('ON_ERROR_LOAD');
            setErrorOnImgLoad(true);
            setLoaded(false);
            setShowSpinnerOnErrorLoad(false);
            setTimeout(() => {
              retryThumbnail();
              // retryPDF();
              timeRef.current = timeRef.current - 1;
            }, 1000);
          } else {
            reject('rejected');
          }
        };
      };
      loadImage(timeRef.current);
    });
  };

  useEffect(() => {
    if (thumbnailDownloadUrl && thumbnailDownloadUrl?.length > 0) {
      checkIfImageLoad(thumbnailDownloadUrl)
        .then(() => {
          setLoaded(true);
          setErrorOnImgLoad(false);
          setToastAction('UPLOADED_DOCUMENT');
        })
        .catch(() => {
          if (errorThumbnail && errorThumbnail.message.length > 0) {
            console.log('URL NOT LOADED', errorThumbnail);
          } else {
            setShowToastMessageForAction(true);
            setToastAction('ERROR_MESSAGE');
            setShowSpinnerOnErrorLoad(true);
          }
        });
    } else if (errorThumbnail && getCriteriaCaseFiles && getCriteriaCaseFiles.length > 0) {
      setShowToastMessageForAction(true);
      setToastAction('ERROR_ON_FETCH');
    }
  }, [thumbnailDownloadUrl, errorThumbnail]);

  return (
    <Box>
      <Box className="relative !z-30">
        <AgentHeader />
        <Box>{renderToastOnAction(toastAction)}</Box>
      </Box>
      <Box className="flex flex-row max-w-[1600px]">
        <Box className="relative !z-10">
          <AgentSideBar />
        </Box>
        <AgentMainBox>
          <Box className="pr-[48px]">
            <Box className="mb-[40px]">
              <Breadcrumbs separator="›" aria-label="breadcrumb" className="!text-secondary ">
                <Typography
                  color="inherit"
                  className="!cursor-pointer !d-text-body-sm-bold underline underline-offset-4"
                  onClick={() => {
                    setShowToastMessageForAction(false);
                    setToastAction('');
                    navigate('/agent-dashboard');
                  }}
                >
                  {t('dashboard')}
                </Typography>
                <Typography
                  className="!cursor-pointer !d-text-body-sm-bold underline underline-offset-4"
                  onClick={() => {
                    setShowToastMessageForAction(false);
                    setToastAction('');
                    navigate(`/client/${params.clientId}`);
                  }}
                >
                  {clientInfo?.FirstName} {clientInfo?.LastName}
                </Typography>
                <Typography className="!cursor-default !d-text-body-sm-bold">{checklistItemName}</Typography>
              </Breadcrumbs>
            </Box>
            <Box className="mb-[40px]">
              {checkIfAllHasStatusApproved && (
                <Box className="mb-[24px]">
                  <Typography className="!d-text-italic !text-successText">{t('allDocumentsApproved')}</Typography>
                </Box>
              )}
              <Typography className="!d-text-h4 !mb-[24px]">{checklistItemName}</Typography>
              <Box className="flex !flex-row !items-end">
                <Box>
                  {clientInfo?.UserFamilyMembers && clientInfo?.UserFamilyMembers.length > 0 && (
                    <Box className="flex flex-row flex-wrap items-center">
                      <Typography className="!d-text-h5 !mr-[12px] whitespace-nowrap">{t('familyMembers')}</Typography>
                      <Box className="flex flex-row mr-[12px]">
                        <Typography className="!mr-[5px] !d-text-body-sm">{`${clientInfo.FirstName} ${clientInfo.LastName}`}</Typography>
                        <Typography className=" !d-text-body-xsm !text-applicationClose">
                          {/* {member.Relationship} */}
                          {foundCase && foundCase.CaseType === 'PATH' ? t('caseNumber') : t('caresID')} {findCaresID}
                        </Typography>
                      </Box>
                      {/* <Box className="flex flex-row !items-center"> */}
                      {!showMore &&
                        clientInfo?.UserFamilyMembers?.slice(0, 3)?.map((member) => (
                          <Box key={member.id} className="flex flex-row mr-[12px]">
                            <Typography className="!mr-[5px] !d-text-body-sm">{`${member.FirstName} ${member.LastName}`}</Typography>
                            <Typography className="!d-text-body-xsm !text-applicationClose">
                              {member.Relationship}
                            </Typography>
                          </Box>
                        ))}

                      {showMore &&
                        clientInfo?.UserFamilyMembers?.map((member) => (
                          <Box key={member.id} className="flex flex-row mr-[12px] ">
                            <Typography className="!mr-[5px] !d-text-body-sm">{`${member.FirstName} ${member.LastName}`}</Typography>
                            <Typography className=" !d-text-body-xsm !text-applicationClose">
                              {member.Relationship}
                            </Typography>
                          </Box>
                        ))}
                      {clientInfo?.UserFamilyMembers && clientInfo?.UserFamilyMembers?.length > 3 && (
                        <>
                          {showMore ? (
                            <Typography onClick={() => setShowMore(false)} className="!d-text-btn-sm  !text-secondary">
                              {t('seeLess')}
                            </Typography>
                          ) : (
                            <Typography
                              onClick={() => {
                                setShowMore(true);
                                // logViewCaseFamilyMember();
                              }}
                              className="!d-text-btn-sm  !text-secondary"
                            >
                              {t('seeMore')}
                            </Typography>
                          )}
                        </>
                      )}
                      {/* </Box> */}
                    </Box>
                  )}
                </Box>
                {/* <Typography className="!d-text-body-sm">CARES ID: CL 212414 </Typography> */}
              </Box>
            </Box>
            {getCriteriaCaseFiles && getCriteriaCaseFiles.length > 0 && (
              <Box className="flex flex-row items-center mb-[52px]">
                <Button
                  onClick={prevDocument}
                  classes={{ root: '!rounded-full !p-0' }}
                  variant="contained"
                  disabled={fileIndex === 0}
                  className={` ${
                    fileIndex === 0 ? '' : '!bg-primary !bg-opacity-25 !text-black hover:!bg-[#]'
                  }  !min-w-[40px] !h-[40px]`}
                >
                  <ArrowBackIcon></ArrowBackIcon>
                </Button>
                <Typography className="!mx-[24px]">
                  {fileIndex + 1} of {getCriteriaCaseFiles?.length}
                </Typography>
                <Button
                  onClick={nextDocument}
                  classes={{ root: '!rounded-full !p-0' }}
                  variant="contained"
                  disabled={fileIndex >= getCriteriaCaseFiles?.length - 1}
                  className={`  ${
                    fileIndex >= getCriteriaCaseFiles?.length - 1 ? '' : '!bg-primary !bg-opacity-25 !text-black'
                  }  !min-w-[40px] !h-[40px]`}
                >
                  <ArrowForwardIcon></ArrowForwardIcon>
                </Button>
              </Box>
            )}

            {((getCriteriaCaseFiles && getCriteriaCaseFiles.length === 0) || !getCriteriaCaseFiles) && (
              <Box className="p-[56px] border-[2px] border-darkGreyBorder flex flex-row justify-between">
                <Typography>
                  {t('noFilesInChacklist', {
                    firstName: clientInfo?.FirstName,
                    lastName: clientInfo?.LastName,
                    documentType: checklistItemName
                  })}
                </Typography>
                <Button
                  disabled={userRole === 'Sponsor'}
                  variant="text"
                  // onClick={() => uploadDocs(criterion)}
                  className="!text-secondary !normal-case !d-text-btn-sm !w-fit !mr-[24px]"
                  onClick={() => {
                    navigateToUploadPage();
                  }}
                >
                  <FileUploadOutlinedIcon className="mr-[8px]" />
                  {t('noFilesInChecklistButton')}
                </Button>
              </Box>
            )}

            {getCriteriaCaseFiles && getCriteriaCaseFiles.length > 0 && (
              <Box className="p-[56px] border-[2px] border-darkGreyBorder min-w-[1000px] flex flex-row justify-between">
                <Box className="flex flex-col ">
                  <Box className="w-[360px] p-[32px] h-fit border-[1px] border-black border-opacity-15 mr-[30px]">
                    <Box className="mb-[16px]">
                      <Typography className="!d-text-body-sm-bold !mb-[8px]">
                        {t('familyMemberApplicationDocument')}
                      </Typography>
                      <Typography className="!d-text-body-sm ">
                        {getCriteriaCaseFiles &&
                        getCriteriaCaseFiles[fileIndex]?.GeneratedFile?.UserFamilyMember?.FirstName
                          ? getCriteriaCaseFiles[fileIndex]?.GeneratedFile?.UserFamilyMember?.FirstName
                          : clientInfo?.FirstName}{' '}
                        {getCriteriaCaseFiles &&
                        getCriteriaCaseFiles[fileIndex]?.GeneratedFile?.UserFamilyMember?.LastName
                          ? getCriteriaCaseFiles[fileIndex]?.GeneratedFile?.UserFamilyMember?.LastName
                          : clientInfo?.LastName}{' '}
                        <span className="!d-text-body-xsm !text-applicationClose">
                          {getCriteriaCaseFiles &&
                          getCriteriaCaseFiles[fileIndex]?.GeneratedFile?.UserFamilyMember?.Relationship
                            ? getCriteriaCaseFiles[fileIndex]?.GeneratedFile?.UserFamilyMember?.Relationship
                            : ''}
                        </span>
                      </Typography>
                    </Box>
                    <Box className="mb-[16px]">
                      <Box className="flex flex-row">
                        <Typography className="!d-text-body-sm-bold !mb-[8px] !mr-[8px]">
                          {t('documentStatus')}
                        </Typography>
                        <Icon id="agent-document-status">info_outlined_icon</Icon>
                        <TooltipUI
                          anchorSelect="#agent-document-status"
                          place="top"
                          content={t('agentDocumentStatusDescription')}
                          onHover={true}
                        />
                      </Box>

                      <Box className={`!flex !flex-row !items-center ${issueDescription ? 'mb-[8px]' : ''}`}>
                        <FormControl
                          sx={{
                            // '& fieldset': { border: 'none' },
                            '& .MuiInputBase-input': {
                              color:
                                documentStatus === CaseFileTypes.UNDER_REVIEW.toString()
                                  ? '#906E1A'
                                  : documentStatus === CaseFileTypes.REJECT.toString()
                                    ? '#A81D35'
                                    : documentStatus === CaseFileTypes.ACCEPTED.toString()
                                      ? '#02522B'
                                      : '#696A6D',
                              fontSize: '16px',
                              fontWeight: '700',
                              lineHeight: '24px'
                              // padding: '0px'
                            }
                          }}
                        >
                          <Select
                            value={documentStatus}
                            onChange={(event) => handleDocumentStatus(event)}
                            autoFocus={false}
                            // className="select-status"
                            // onClose={(e) => handleClose(e)}
                            disabled={
                              userRole === 'DHS Employee' ||
                              userRole === 'DHS Administrator' ||
                              userRole === 'CBO Supervisor' ||
                              userRole === 'CBO Staffer'
                            }
                            className={
                              userRole === 'DHS Employee' ||
                              userRole === 'DHS Administrator' ||
                              userRole === 'CBO Supervisor' ||
                              userRole === 'CBO Staffer'
                                ? '!d-text-btn-sm !normal-case !py-[12px] !min-w-[220px]'
                                : 'select-status !min-w-[220px] '
                            }
                            sx={{
                              boxShadow: 'none',
                              outline: 'none',
                              '&.Mui-focused': {
                                outline: 'none' // Remove focus outline
                              }
                            }}
                            // id={caseItem.id}
                            name="select-status"
                            MenuProps={{
                              PaperProps: {
                                sx: {
                                  '& .MuiMenuItem-root': {
                                    padding: '12px' // Set padding for all MenuItems
                                  }
                                }
                              }
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MenuItem
                              className="!text-documentPending !d-text-body-sm-bold select-status"
                              value={CaseFileTypes.PENDING.toString()}
                            >
                              <CircleIcon className={`!d-text-body-xsm mr-[12px] !text-documentPending`} />
                              {t('pending')}
                            </MenuItem>
                            <MenuItem
                              className="!text-documentUnderReview !d-text-body-sm-bold select-status"
                              value={CaseFileTypes.UNDER_REVIEW.toString()}
                            >
                              <CircleIcon className={`!d-text-body-xsm mr-[12px] !text-documentUnderReview`} />
                              {t('underReview')}
                            </MenuItem>
                            {(userRole === 'PATH Employee' ||
                              userRole === 'PATH Administrator' ||
                              userRole === 'HPD Employee' ||
                              userRole === 'HPD Administrator' ||
                              userRole === 'Sponsor') && (
                              <MenuItem
                                className="!text-documentResubmit !d-text-body-sm-bold select-status flex flex-row items-center"
                                value={CaseFileTypes.REJECT.toString()}
                              >
                                <CircleIcon className={`!d-text-body-xsm mr-[12px] !text-documentResubmit`} />
                                {t('resubmit')}
                              </MenuItem>
                            )}
                            <MenuItem
                              className="!text-documentApproved !d-text-body-sm-bold select-status flex flex-row items-center"
                              value={CaseFileTypes.ACCEPTED.toString()}
                            >
                              <CircleIcon className={`!d-text-body-xsm mr-[12px] !text-documentApproved`} />
                              {t('approved')}
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                      {issueDescription && documentStatus === CaseFileTypes.REJECT.toString() && (
                        <Typography className="!text-documentResubmit !d-text-body-xsm !mb-[8px]">
                          {issueDescription}
                        </Typography>
                      )}
                    </Box>
                    <Box className="mb-[16px]">
                      <Typography className="!d-text-body-sm-bold !mb-[8px]">
                        {t('dateAddedApplicationDocument')}
                      </Typography>
                      <Typography className="!d-text-body-sm">
                        {getCriteriaCaseFiles
                          ? dayjs(getCriteriaCaseFiles[fileIndex].GeneratedFile?.CreatedAt).format('MM/DD/YYYY')
                          : ''}
                      </Typography>
                    </Box>
                    <Box className="mb-[24px]">
                      <Typography className="!d-text-body-sm-bold !mb-[8px]">
                        {t('descriptionDocumentApplicationDocument')}
                      </Typography>
                      <Typography className="!d-text-body-sm">
                        {getCriteriaCaseFiles && getCriteriaCaseFiles[fileIndex].GeneratedFile?.Description
                          ? getCriteriaCaseFiles[fileIndex].GeneratedFile?.Description
                          : t('noDescription')}
                      </Typography>
                    </Box>
                    <Divider className="!mb-[8px]" />
                    <Box>
                      <Typography className="!d-text-body-sm-bold !mb-[16px]">{t('actions')}</Typography>
                      <Box className="w-full mb-[12px]">
                        <Button
                          variant="text"
                          onClick={() => {
                            downloadDocuments().then(() => {
                              setShowToastMessageForAction(true);
                              setToastAction('SHOW_DOWNLOAD_TOAST');
                            });
                          }}
                          className="!text-secondary !normal-case !d-text-btn-xsm !w-1/2"
                        >
                          <FileDownloadOutlinedIcon className="mr-[8px]" />
                          {t('download')}
                        </Button>
                        <Button
                          variant="text"
                          // onClick={() => uploadDocs(criterion)}
                          disabled={userRole === 'Sponsor'}
                          className={
                            userRole === 'Sponsor'
                              ? '!d-text-btn-sm !normal-case !py-[12px] !min-w-[127px]'
                              : '!text-secondary !normal-case !d-text-btn-xsm !w-1/2'
                          }
                          onClick={() => {
                            setShowToastMessageForAction(false);
                            setToastAction('');
                            navigateToUploadPage();
                          }}
                        >
                          <FileUploadOutlinedIcon className="mr-[8px]" />
                          {t('noFilesInChecklistButton')}
                        </Button>
                      </Box>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          downloadAllDocuments().then(() => {
                            setShowToastMessageForAction(true);
                            setToastAction('SHOW_DOWNLOAD_TOAST');
                          });
                        }}
                        className="!text-secondary !normal-case !d-text-btn-xsm !border-secondary !py-[12px] !px-[4px] w-full flex items-center"
                      >
                        <FolderOpenIcon className="mr-[8px] !text-[18px]" />
                        {t('dowloadAll')}
                      </Button>
                    </Box>
                  </Box>
                </Box>

                <Box
                  className="flex flex-col w-fit min-h-[700px] relative"
                  onClick={() => {
                    setOpenPdfViewerDialog(true);
                    setShowToastMessageForAction(false);
                    setToastAction('');
                  }}
                >
                  <Box className={`w-[500px] px-[12px] border-[1px] border-lightGreyBorder !cursor-pointer relative`}>
                    {thumbnailLoading || isErrorOnImgLoad ? (
                      <Box className="w-full min-h-[680px] flex flex-col !justify-center !items-center ">
                        {showSpinnerOnErrorLoad && (
                          <Box className="flex flex-col !justify-center !items-center">
                            <CircularProgress className="!text-secondary !d-text-label-sm"></CircularProgress>
                            {isErrorOnImgLoad && (
                              <Typography className="!d-text-label-sm !text-secondary !mt-[12px]">
                                {t('documentProcessing')}
                              </Typography>
                            )}
                          </Box>
                        )}
                      </Box>
                    ) : (
                      <Box className="">
                        <Box className="relative overflow-hidden">
                          <img
                            className="min-h-[680px] w-full opacity-0 transition-opacity duration-100 ease-out"
                            loading="lazy"
                            src={thumbnailDownloadUrl}
                            alt="this is some alt text"
                            onLoad={(e) => {
                              e.currentTarget.style.opacity = '1';
                            }}
                          />
                        </Box>

                        {loaded && !isErrorOnImgLoad && (
                          <Box className="!bg-black w-full flex flex-row items-center !cursor-pointer absolute bottom-0 left-0 py-[4px] px-[12px]">
                            <OpenInFullIcon className="!text-white mr-[12px] !text-[18px] w-[18px]" />
                            <Typography className="!text-white !d-text-body-sm-bold">{t('fullScreen')}</Typography>
                          </Box>
                        )}
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        </AgentMainBox>
      </Box>
      <AgentDialogResubmitDocument
        openResubmitDocumentDialog={openResubmitDocumentDialog}
        handleCloseResubmitDocumentDialog={handleCloseResubmitDocumentDialog}
        updateIssueDescription={updateIssueDescription}
        handleSubmitCloseDialog={handleSubmitCloseDialog}
      />
      <Dialog
        className="w-full"
        open={openPdfViewerDialog}
        onClose={() => setOpenPdfViewerDialog(false)}
        classes={{ paper: '!min-w-[90%] lg:!min-w-[50%] h-[82vh] !bg-[#EEEEEE]' }}
      >
        <Box>
          <Box className="!sticky bg-white !top-0 !z-20 flex justify-end pr-2 py-1">
            <IconButton className="!text-secondary !d-text-btn-md " onClick={() => setOpenPdfViewerDialog(false)}>
              <CloseIcon className="mr-[8px]" fontSize="medium" />
              <Typography className="!d-text-btn-md lg:!d-text-btn-sm pt-[2px]">{t('close')}</Typography>
            </IconButton>
          </Box>
          {/* <PDFReader file={''} /> */}
          {/*{document && document?.id && pdfViewer()} */}
          {pdfViewer()}
        </Box>
      </Dialog>
    </Box>
  );
}

export default AgentChecklistItem;
