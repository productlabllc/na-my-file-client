import { useEffect, useMemo, useState, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useBoundStore } from '../../store/store';
import { useAsync } from 'react-use';
import dayjs from 'dayjs';
// import { PENDING, UNDER_REVIEW, RE_UPLOAD, ACCEPTED } from '../../types/AcitivityStatuses';
import { Constants } from '@namyfile/api-client';
import { APPLICATION_RESUBMIT_TOAST_MESSAGE } from '../../utils/client-toast-messages';
const CaseFileTypes: Constants['CaseFileStatus'] = {
  ACCEPTED: 'ACCEPTED',
  PENDING: 'PENDING',
  REJECT: 'REJECT',
  UNDER_REVIEW: 'UNDER_REVIEW'
};

import {
  Box,
  Button,
  Typography,
  List,
  Icon,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Alert,
  Divider
  // Skeleton
  // ListItemButton
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import FileOpenOutlinedIcon from '@mui/icons-material/FileOpenOutlined';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

import Header from '../../layouts/Header/Header';
import BackButton from '../../components/BackButton/BackButton';
import AlertSuccessToastMessage from '../../components/AlertSuccessToastMessage/AlertSuccessToastMessage';

import { AddCaseFileRequest } from '@namyfile/api-client';

import { useApi } from '../../utils/use-api';
import { batchPromises } from '../../lib/batch-promise';
import { useTranslation } from 'react-i18next';
import AsyncImage from '../../components/AsyncImage/AsyncImage';

function ApplicationChecklistItemPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const {
    getDocumentsBeforeSubmission,
    // submitDocumentsToApplicationChecklistItem,
    // getApplications,
    setListBeforeSubmitionToEmptyState,
    removeDocumentFromTheListBeforeSubmit,
    mergeDocuments,
    setcheckListItemUploadedDocumentsToEmptyArray,
    removeCheckListItemDocument,
    setSelectedForUploadChecklistItem,
    setShowToastMessageClient,
    // localThumbnail,
    thumbnails,
    showToastMessageClient,
    toastMessageActionTypeClient
  } = useBoundStore();
  const api = useApi();

  type CaseResponseType = Awaited<ReturnType<(typeof api)['getCase']>>;

  type Document = Exclude<
    Exclude<
      Exclude<CaseResponseType['CaseCriteria'], undefined>[number]['CaseFiles'],
      undefined
    >[number]['GeneratedFile'],
    undefined
  >;

  const applicationId = params.applicationId;
  const checklistItemId = params.id;
  const applicationTitle = params.applicationTitle;
  const applicationUrlPath = location.pathname.split('/');
  const backNavigation = applicationUrlPath.splice(1, 3).join('/');
  const theme = useTheme();
  const isXlAndUp = useMediaQuery(theme.breakpoints.up('xl'));
  const { t } = useTranslation('applications');
  const [beforeUploadedDocuments, setBeforeUploadedDocuments] = useState<Document[]>([]);

  // const [onErrorLoadImg, setOnErrorLoadImg] = useState({ isLoading: false, documentId: '' });

  const handleCloseToastMessage = () => {
    setShowToastMessageClient(false);
  };

  const renderToastOnAction = useCallback(
    (action: string) => {
      switch (action) {
        case APPLICATION_RESUBMIT_TOAST_MESSAGE:
          return (
            <AlertSuccessToastMessage
              handleCloseToastMessage={handleCloseToastMessage}
              text={t('toastMessages.documentUploaded')}
              showToast={showToastMessageClient}
            />
          );
        // case 'SHOW_UPLOAD_TOAST':
        //   // setTimeout(() => setShowToastMessageForAction(false), 4000);
        //   return (
        //     <AlertSuccessToastMessage handleCloseToastMessage={handleCloseToastMessage} text={t('documentUploaded')} />
        //   );
        // case 'SHOW_DOWNLOAD_TOAST':
        //   return (
        //     <AlertSuccessToastMessage handleCloseToastMessage={handleCloseToastMessage} text={t('documentDowloaded')} />
        //   );
        // case 'UPLOADED_DOCUMENT':
        //   return (
        //     <AlertSuccessToastMessage handleCloseToastMessage={handleCloseToastMessage} text={t('documentUploaded')} />
        //   );
        // case 'ON_ERROR_LOAD':
        //   return <AgentOnErrorLoadToast />;
        // case 'ERROR_MESSAGE':
        //   return (
        //     <AlertInfoToastMessage
        //       handleCloseToastMessage={handleCloseToastMessage}
        //       text={t('documentTimeProcessing')}
        //     />
        //   );
        // case 'ERROR_ON_FETCH':
        //   return (
        //     <AlertErrorToastMessage handleCloseToastMessage={handleCloseToastMessage} text={t('errorProcessing')} />
        //   );
      }
    },
    [showToastMessageClient]
  );
  // const [checkDocumentForStatusResubmit, setCheckForStatusResubmit] = useState(false);

  const [error, setError] = useState('');

  const { value: application } = useAsync(() => {
    if (applicationId && applicationTitle) {
      return api.getCase({ caseId: applicationId, workflowType: applicationTitle });
    } else {
      return Promise as never;
    }
  }, []);

  const checklistItem = useMemo(
    () => application?.CaseCriteria?.find((cc) => cc.id === checklistItemId),
    [application?.CaseCriteria, checklistItemId]
  );

  const { value: checklistDocuments } = useAsync(async () => {
    if (checklistItem) {
      const docs = checklistItem.CaseFiles;
      const funcs = docs?.map((doc) => async () => {
        const thumbnail = await api.getGeneratedTfileThumbnailDownloadUrl({ generatedFileId: doc.GeneratedFileId! });

        return {
          ...doc.GeneratedFile,
          GeneratedFile: doc.GeneratedFile,
          Status: doc.Status,
          ReasonForResubmit: doc.ReasonForResubmit,
          downloadUrl: thumbnail.downloadUrl,
          GeneratedFileId: doc.GeneratedFileId
        };
      });

      const response: (Document & { downloadUrl?: string; ReasonForResubmit?: string; GeneratedFileId?: string })[] =
        await batchPromises<
          Document & { downloadUrl?: string; ReasonForResubmit: string; GeneratedFileId?: string }
          // @ts-expect-error type error
        >(funcs, 5);
      // const response: Document[] & { downloadUrl?: string; Status?: string } = [];
      return response;
    } else {
      return [];
    }
  }, [checklistItem]);

  const findStatusResubmit = useMemo(() => {
    if (checklistDocuments && checklistDocuments.length > 0) {
      return !!checklistDocuments?.find((document) => document.Status === CaseFileTypes.REJECT.toString());
    }
  }, [checklistDocuments]);

  const submitDocuments = () => {
    const addCaseFiles = beforeUploadedDocuments.map((file) => {
      return file.id;
    });

    const addCaseFileRequest = {
      GeneratedFileIds: addCaseFiles,
      CaseCriterionId: checklistItemId
    } as AddCaseFileRequest;

    if (applicationId) {
      api
        .addCaseFiles({
          caseId: applicationId,
          requestBody: addCaseFileRequest
        })
        .then(() => {
          // submitDocumentsToApplicationChecklistItem(applicationId, checklistItemId, beforeUploadedDocuments);
          mergeDocuments();
          setcheckListItemUploadedDocumentsToEmptyArray();
          setListBeforeSubmitionToEmptyState();
          navigate(location.pathname + '/submit-confirmation');
        })
        .catch((response) => {
          const errorMessage = t('errorWrongType', { fileType: response.body.ruleSetsFileTypes[0] });

          setError(errorMessage);
        });
    }
  };

  const navigateToUploadGenerator = () => {
    setSelectedForUploadChecklistItem(checklistItem);
    navigate(location.pathname + `/upload-generator`);
  };

  const navigateToSelectDocumentsPage = () => {
    navigate(location.pathname + '/select-documents');
  };

  const toggleBeforeSumbitDataIntoEmptyState = () => {
    setListBeforeSubmitionToEmptyState();
    setcheckListItemUploadedDocumentsToEmptyArray();
  };

  const removeDocumentFromBeforeSubmitBox = (document: Document) => {
    if (document?.id) {
      removeDocumentFromTheListBeforeSubmit(document.id);
      removeCheckListItemDocument(document.id);

      const arr = beforeUploadedDocuments.filter((doc: Document) => doc.id !== document.id);
      setBeforeUploadedDocuments(arr);
    }
  };

  const openDocument = (document: Document) => {
    navigate(location.pathname + `/document/${document.id}`);
  };

  useEffect(() => {
    const documentsBeforeSubmissionWithLocalTHumbnails = () => {
      const selectedDocs = getDocumentsBeforeSubmission();
      return selectedDocs;
    };

    setBeforeUploadedDocuments([...documentsBeforeSubmissionWithLocalTHumbnails()]);
  }, [checklistItem, getDocumentsBeforeSubmission, thumbnails, setBeforeUploadedDocuments]);

  const columnsBeforeSubmit: GridColDef[] = [
    {
      field: 'thumbnailUrl',
      sortable: false,
      headerName: '',
      width: 100,
      renderCell: (params: GridRenderCellParams) => {
        console.log(params.row);
        if (params.row.Status !== 'UPLOADED') {
          return <AsyncImage generatedFileId={params.row.id} key={params.row.id}></AsyncImage>;
        } else {
          return <img src={params.row.thumbnailUrl} />;
        }
      }
    },
    {
      field: 'FileType',
      headerClassName: '!text-secondary !d-text-body-md-bold !text-extra-bold ',
      headerName: t('documentType'),
      flex: 3,
      maxWidth: 400,
      cellClassName: '!d-text-body-sm !text-wrap'
      // renderCell: (params: GridRenderCellParams) => {
      //   return params.row.FileType || '';
      // }
    },
    {
      field: 'UserFamilyMember',
      headerName: t('familymember'),
      headerClassName: '!text-secondary !d-text-btn-md',
      // type: 'date',
      flex: 2,
      cellClassName: '!d-text-body-sm ',
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Typography className="pb-[4px] sm:!m-text-body-md !m-text-body-sm !w-3/4">
            {params?.row.UserFamilyMember ? params?.row.UserFamilyMember?.FirstName : 'Self'}{' '}
            {params.row.UserFamilyMember?.LastName}{' '}
          </Typography>
        );
      }
    },
    {
      field: 'CreatedAt',
      headerName: t('dateAdded'),
      // type: 'date',
      headerClassName: '!text-secondary !d-text-btn-md',
      flex: 2,
      cellClassName: '!d-text-body-sm opacity-60',
      renderCell: (params: GridRenderCellParams) => {
        return dayjs(params.row.CreatedAt).format('MM/DD/YYYY');
      }
    },
    // TODO Add family member to the beforSubmit object

    {
      field: 'selectedDocument',
      sortable: false,
      align: 'left',
      headerName: '',
      type: 'actions',
      flex: 2,
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <Button
          onClick={() => removeDocumentFromBeforeSubmitBox(params.row)}
          className={'!text-secondary !d-text-btn-sm !normal-case'}
        >
          <DeleteOutlinedIcon />
          <Typography className="!d-text-btn-sm">Remove</Typography>
        </Button>
      )
    }
  ];

  //////////////
  // After submit document Desktop verion UI
  /////////////

  const columnsAfterSubmit: GridColDef[] = [
    {
      field: 'thumbnailUrl',
      sortable: false,
      headerName: '',
      width: 100,
      renderCell: (params: GridRenderCellParams) => {
        if (params.row.downloadUrl) {
          return <AsyncImage generatedFileId={params.row.GeneratedFileId} key={params.row.id}></AsyncImage>;
        }
      }
    },
    {
      field: 'FileType',
      headerClassName: '!text-secondary !d-text-body-md-bold !text-extra-bold ',
      headerName: t('documentType'),
      flex: 3,
      maxWidth: 400,
      cellClassName: '!d-text-body-sm !text-wrap'
      // renderCell: (params: GridRenderCellParams) => {
      //   return params.row.GeneratedFile.FileType || '';
      // }
    },
    {
      field: 'Status',
      headerName: t('status'),
      sortable: false,
      headerClassName: '!text-secondary !d-text-btn-md',
      // type: 'date',
      flex: 3,
      cellClassName: '!d-text-body-sm ',
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Box>
            {params?.row.Status === CaseFileTypes.UNDER_REVIEW.toString() && (
              <Box className="flex !flex-row !items-center">
                <Icon className="!mr-1 !px-0  !text-[#a99201] !scale-[70%]">circle_icon</Icon>
                <Typography className=" !text-[#a99201] sm:!m-text-body-md-bold !m-text-body-sm-bold !w-3/4">
                  {t('underReview')}
                </Typography>
              </Box>
            )}
            {params?.row.Status === CaseFileTypes.PENDING.toString() && (
              <Box className="flex !flex-row !items-center">
                <Icon className="!mr-1 !px-0  !text-disabledBackground !scale-[70%]">circle_icon</Icon>
                <Typography className=" !text-disabledBackground sm:!m-text-body-md-bold !m-text-body-sm-bold !w-3/4">
                  {t('pending')}
                </Typography>
              </Box>
            )}
            {params?.row.Status === CaseFileTypes.ACCEPTED.toString() && (
              <Box className="flex !flex-row !items-center">
                <Icon className="!mr-1 !px-0  !text-[#1f6803] !scale-[70%]">circle_icon</Icon>
                <Typography className=" !text-[#1f6803] sm:!m-text-body-md-bold !m-text-body-sm-bold !w-3/4">
                  {t('accepted')}
                </Typography>
              </Box>
            )}
            {params?.row.Status === CaseFileTypes.REJECT.toString() && (
              <Box>
                <Box className="flex !flex-row !items-center">
                  <Icon className="!mr-1 !px-0  !text-[#ad2108] !scale-[70%]">circle_icon</Icon>
                  <Typography className=" !text-[#ad2108] sm:!m-text-body-md-bold !m-text-body-sm-bold !w-3/4">
                    {t('reUpload')}
                  </Typography>
                </Box>
                {params?.row.ReasonForResubmit && (
                  <Typography className="!text-[#ad2108] !d-text-body-xsm !mb-[8px] !text-wrap">
                    {params?.row.ReasonForResubmit}
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        );
      }
    },
    {
      field: 'CreatedAt',
      headerName: t('dateAdded'),
      // type: 'date',
      headerClassName: '!text-secondary !d-text-btn-md',
      flex: 2,
      cellClassName: '!d-text-body-sm opacity-60',
      renderCell: (params: GridRenderCellParams) => {
        return dayjs(params.row.CreatedAt).format('MM/DD/YYYY');
      }
    },
    {
      field: 'familyMember',
      headerName: t('familymember'),
      headerClassName: '!text-secondary !d-text-btn-md',
      // type: 'date',
      flex: 2,
      cellClassName: '!d-text-body-sm',
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Typography className="pb-[4px] sm:!m-text-body-md !m-text-body-sm !w-3/4">
            {params.row.UserFamilyMember
              ? params.row.UserFamilyMember?.FirstName + ' ' + params.row.UserFamilyMember?.LastName
              : 'Self'}
          </Typography>
        );
      }
    }
  ];

  // const checkIfImgLoaded = (documentId: string, documentUrl: string) => {
  //   const newImg = new Image();
  //   newImg.src = documentUrl;
  //   if (newImg.onload) {
  //     setOnErrorLoadImg({ isLoading: false, documentId: documentId });
  //     return;
  //   } else {
  //     setTimeout(() => {
  //       refetchDocuments();
  //       checkIfImgLoaded(documentId, documentUrl);
  //     }, 2000);
  //   }
  // };

  return (
    <>
      <Header />
      <Box className="!w-full !flex !justify-center !mb-[70px]">
        <Box className="!w-full sm:!w-[80%] xl:!w-[1248px] mt-[70px] px-[16px] md:px-[32px] pb-[52px]">
          {showToastMessageClient && renderToastOnAction(toastMessageActionTypeClient)}
          <Box className="!mt-[8px] !mb-[16px]">
            <BackButton
              text={t('returnButton')}
              navigatePath={'/' + backNavigation}
              callbackAction={toggleBeforeSumbitDataIntoEmptyState}
            />
          </Box>
          <Box>
            <Typography className="!m-text-h5 md:!d-text-h5 !mb-[8px]">
              {/* {checklistItem?.CriterionGroupName}
              {checklistItem?.CriterionSubGroupName ? ` > ${checklistItem?.CriterionSubGroupName}` : ''} */}
              {checklistItem?.Name}
            </Typography>

            <Typography className="!m-text-body-md md:!d-text-body-md !mb-[24px]">
              {t('checklistItemPageDescription')}
            </Typography>

            {/* <Typography className="!m-text-body-lg !mb-[16px]">{t('allMinors')}</Typography> */}

            {error && (
              <Typography sx={{ color: 'red' }} className="!m-text-body-lg !mb-[16px]">
                {error}
              </Typography>
            )}

            <Box className="!bg-primaryPress !bg-opacity-5 !p-[12px] xl:!w-[955px] xl:!py-[24px] xl:!px-[36px] !rounded-lg !border-dashed !border-2 !border-secondary">
              {beforeUploadedDocuments.length === 0 && (
                <Box className="xl:flex xl:w-full xl:justify-start">
                  <Typography className="!m-text-body-md md:!d-text-body-md !mb-[24px] xl:w-full">
                    {t('uploadOrSelect')}
                  </Typography>
                </Box>
              )}

              {beforeUploadedDocuments.length > 0 && !isXlAndUp && (
                <Box className="w-full block xl:hidden relative !mb-[12px]">
                  {/* Show List of data items when the screen size is x-large and down */}
                  <List dense className="w-full">
                    {beforeUploadedDocuments.map((document) => {
                      return (
                        <ListItem
                          key={document.id}
                          className="!pt-[8px] !pb-[8px] !px-0 border-b-2 flex"
                          secondaryAction={
                            <Box
                              className="flex flex-row !items-center"
                              onClick={() => removeDocumentFromBeforeSubmitBox(document)}
                            >
                              <IconButton
                                // onClick={(e) => handleOption(e, document)}
                                edge="end"
                                className="!d-text-body-lg flex flex-row !text-secondary"
                              >
                                <DeleteOutlinedIcon />
                              </IconButton>
                            </Box>
                          }
                        >
                          <ListItemAvatar>
                            {document.Status !== 'UPLOADED' ? (
                              <AsyncImage generatedFileId={document.id} key={document.id}></AsyncImage>
                            ) : (
                              // @ts-expect-error Property 'thumbnailUrl' does not exist on type 'BaseGeneratedUserFile'
                              <img className="mr-4 w-14 h-14 rounded inline" src={document?.thumbnailUrl} />
                            )}
                          </ListItemAvatar>
                          <ListItemText className="flex flex-col flex-4 !w-3/4">
                            <Typography className="pb-[4px] sm:!m-text-body-md !m-text-body-sm !w-3/4 !truncate !...">
                              {document?.FileType}
                            </Typography>
                            <Typography className="pb-[4px] sm:!m-text-body-md !m-text-body-sm opacity-60 w-3/4">
                              {dayjs(document?.CreatedAt).format('MM/DD/YY')}
                            </Typography>
                            <Typography className="pb-[4px] sm:!m-text-body-md !m-text-body-sm !w-3/4">
                              {document?.UserFamilyMember ? document?.UserFamilyMember?.FirstName : 'Self'}{' '}
                              {document?.UserFamilyMember?.LastName}{' '}
                              {/* {`${document?.UserFamilyMember?.Relationship}`} */}
                            </Typography>
                          </ListItemText>
                        </ListItem>
                      );
                    })}
                  </List>
                </Box>
              )}
              <Box>
                {beforeUploadedDocuments.length > 0 && isXlAndUp && (
                  <DataGrid
                    columns={columnsBeforeSubmit}
                    rows={beforeUploadedDocuments}
                    hideFooterSelectedRowCount={true}
                    hideFooterPagination={true}
                    className="!hidden xl:!block"
                    // onRowClick={(params) => {
                    // openDocument(params);
                    // }}
                    slots={{
                      columnHeaders: () => null
                    }}
                    sx={{
                      '.MuiDataGrid-iconButtonContainer': {
                        visibility: 'visible'
                      },
                      '.MuiDataGrid-sortIcon': {
                        opacity: 'inherit !important'
                      },
                      '.MuiDataGrid-columnSeparator': {
                        display: 'none'
                      },
                      '.MuiDataGrid-root': {
                        border: 'none'
                      },
                      '.MuiDataGrid-columnHeader': {
                        paddingBottom: '20px'
                        // paddingTop: '16px'
                      },
                      '.MuiDataGrid-columnHeaderTitle': {
                        fontWeight: '700'
                      },
                      '.MuiDataGrid-footerContainer': {
                        minHeight: '30px'
                      }
                    }}
                  ></DataGrid>
                )}
              </Box>
              <Box
                className={`${
                  beforeUploadedDocuments.length > 0
                    ? 'xl:flex xl:!justify-start'
                    : 'xl:!flex xl:!justify-start xl:!items-center'
                }`}
              >
                <Button
                  variant="outlined"
                  className={`!flex !items-center ${findStatusResubmit ? '' : '!text-secondary !border-secondary'} !m-text-btn-md  w-full !py-[14px] !px-[16px] !normal-case !mb-[20px] xl:!mb-[0px] xl:!max-w-fit xl:!mr-[20px]`}
                  onClick={navigateToUploadGenerator}
                  disabled={findStatusResubmit}
                >
                  <FileUploadOutlinedIcon className="!mr-[8px] !h-[20px]" />
                  {t('uploadFromDevice')}
                </Button>
                <Button
                  variant="text"
                  className={`!flex !items-center ${findStatusResubmit ? '' : '!text-secondary'} !m-text-btn-md w-full !py-[14px] !px-[16px] !normal-case xl:!max-w-fit`}
                  onClick={navigateToSelectDocumentsPage}
                  disabled={findStatusResubmit}
                >
                  <FileOpenOutlinedIcon className="!mr-[8px] !h-[20px]" />
                  {t('selectFromDashboard')}
                </Button>
              </Box>
            </Box>

            {checklistDocuments && checklistDocuments.length > 0 && (
              <Divider className="!border-[1px] !border-lightGreyBorder !my-[32px]"></Divider>
            )}

            {findStatusResubmit && (
              <Alert
                variant="filled"
                icon={<WarningAmberIcon className="!text-errorText"></WarningAmberIcon>}
                className="w-full sm:!w-fit mb-[32px] !bg-errorBackground !text-black !m-text-body-sm md:!d-text-body-sm"
              >
                {t('selectResubmit')}
              </Alert>
            )}

            <Box className="">
              {checklistDocuments && checklistDocuments.length > 0 && (
                <Box className="lg:!mb-[18px] !mb-[16px]">
                  <Typography className="!m-text-body-lg-bold">{t('previouslySharedDocs')}</Typography>
                </Box>
              )}

              {checklistDocuments && checklistDocuments.length > 0 && !isXlAndUp && (
                <List dense className="!w-full !p-[18px] !pb-[18px]">
                  {checklistDocuments?.map((document) => {
                    return (
                      <ListItem key={document?.id} className="!pt-[8px] !pb-[8px] !px-0 border-b-2 flex">
                        <ListItemAvatar onClick={() => openDocument(document!)}>
                          {/* {onErrorLoadImg.isLoading && onErrorLoadImg.documentId === document.id ? (
                            <Skeleton variant="rectangular" className="!h-[60px] !w-[60px] mr-4 "></Skeleton>
                          ) : (
                            <img
                              src={
                                // @ts-expect-error GeneratedFile not present on BaseGeneratedUserFile type
                                document.GeneratedFile.Status == 'UPLOADED'
                                  ? document?.downloadUrl
                                  : URL.createObjectURL(localThumbnail)
                              }
                              className="mr-4 w-14 h-14 rounded inline"
                              // onLoad={() => {
                              //   setOnErrorLoadImg({ isLoading: false, documentId: document.id });
                              // }}
                              onError={() => {
                                if (document.downloadUrl) {
                                  setOnErrorLoadImg({ isLoading: true, documentId: document.id });
                                  // checkIfImgLoaded(document.id, document.downloadUrl);
                                }
                              }}
                            />
                          )} */}
                          {document.downloadUrl && (
                            <AsyncImage generatedFileId={document.GeneratedFileId} key={document.id}></AsyncImage>
                          )}
                        </ListItemAvatar>
                        <ListItemText className="flex flex-col flex-4 !w-3/4" onClick={() => openDocument(document!)}>
                          <Typography className="pb-[4px] sm:!m-text-body-md !m-text-body-sm !w-3/4 !truncate !...">
                            {document?.FileType}
                          </Typography>
                          <Typography className="pb-[4px] sm:!m-text-body-md !m-text-body-sm opacity-60 w-3/4">
                            {dayjs(document?.CreatedAt).format('MM/DD/YYYY')}
                          </Typography>
                          <Typography className="pb-[4px] sm:!m-text-body-md !m-text-body-sm !w-3/4">
                            {document?.UserFamilyMember?.FirstName && document?.UserFamilyMember?.FirstName
                              ? document?.UserFamilyMember?.FirstName + ' ' + document?.UserFamilyMember?.LastName
                              : 'Self'}
                          </Typography>
                          <Box className="flex !flex-row !items-center">
                            {document.Status === CaseFileTypes.UNDER_REVIEW.toString() && (
                              <Box className="flex !flex-row !items-center">
                                <Icon className="!mr-1 !px-0  !text-[#a99201] !scale-[70%]">circle_icon</Icon>
                                <Typography className=" !text-[#a99201] sm:!m-text-body-md-bold !m-text-body-sm-bold !w-full">
                                  {t('underReview')}
                                </Typography>
                              </Box>
                            )}
                            {document.Status === CaseFileTypes.PENDING.toString() && (
                              <Box className="flex !flex-row !items-center">
                                <Icon className="!mr-1 !px-0  !text-disabledBackground !scale-[70%]">circle_icon</Icon>
                                <Typography className=" !text-disabledBackground sm:!m-text-body-md-bold !m-text-body-sm-bold !w-full">
                                  {t('pending')}
                                </Typography>
                              </Box>
                            )}
                            {document.Status === CaseFileTypes.ACCEPTED.toString() && (
                              <Box className="flex !flex-row !items-center">
                                <Icon className="!mr-1 !px-0  !text-[#1f6803] !scale-[70%]">circle_icon</Icon>
                                <Typography className=" !text-[#1f6803] sm:!m-text-body-md-bold !m-text-body-sm-bold !w-3/4">
                                  {t('accepted')}
                                </Typography>
                              </Box>
                            )}
                            {document.Status === CaseFileTypes.REJECT.toString() && (
                              <Box>
                                <Box className="flex !flex-row !items-center">
                                  <Icon className="!mr-1 !px-0  !text-[#ad2108] !scale-[70%]">circle_icon</Icon>
                                  <Typography className=" !text-[#ad2108] sm:!m-text-body-md-bold !m-text-body-sm-bold !w-3/4">
                                    {t('reUpload')}
                                  </Typography>
                                </Box>
                                {document.Status === CaseFileTypes.REJECT.toString() && (
                                  <Typography className="!text-[#ad2108] !d-text-body-xsm !mb-[8px]">
                                    {document && document.ReasonForResubmit ? document.ReasonForResubmit : ''}
                                  </Typography>
                                )}
                              </Box>
                            )}
                          </Box>
                        </ListItemText>
                      </ListItem>
                    );
                  })}
                </List>
              )}

              {checklistDocuments && checklistDocuments.length > 0 && isXlAndUp && (
                <DataGrid
                  columns={columnsAfterSubmit}
                  rows={checklistDocuments}
                  hideFooterPagination={true}
                  onRowClick={(params) => {
                    openDocument(params.row);
                  }}
                  className="pt-[16px] !hidden xl:!block"
                  sx={{
                    '.MuiDataGrid-iconButtonContainer': {
                      visibility: 'visible'
                    },
                    '.MuiDataGrid-sortIcon': {
                      opacity: 'inherit !important'
                    },
                    '.MuiDataGrid-columnSeparator': {
                      display: 'none'
                    },
                    '.MuiDataGrid-root': {
                      border: 'none'
                    },
                    '.MuiDataGrid-columnHeader': {
                      paddingBottom: '20px'
                    },
                    '.MuiDataGrid-columnHeaderTitle': {
                      fontWeight: '700'
                    }
                  }}
                ></DataGrid>
              )}
            </Box>
          </Box>
          <Box
            sx={{ boxShadow: '0px -4px 4px -4px black' }}
            className="!fixed !py-[16px] !h-min-[70px] !z-20 bottom-0 w-full inset-x-0 !flex !flex-col !justify-center !bg-white !items-center"
          >
            <Box className="!w-[94%] md:!w-[660px] flex justify-center">
              <Button
                variant="contained"
                className={`!ml-2 sm:!min-w-[290px] !m-text-btn-md ${
                  beforeUploadedDocuments.length > 0 && '!bg-secondary !text-white'
                } !w-[98%] !h-[48px] !normal-case`}
                onClick={submitDocuments}
                disabled={beforeUploadedDocuments.length === 0}
              >
                {t('finishSharingDocuments')}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default ApplicationChecklistItemPage;
