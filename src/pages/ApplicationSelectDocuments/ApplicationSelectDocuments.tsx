import { useNavigate, useLocation, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Checkbox,
  Button,
  Icon,
  CircularProgress
} from '@mui/material';

import Header from '../../layouts/Header/Header';
import OptionsSortMenu from '../../components/OptionsSortMenu/OptionsSortMenu';
import { GeneratedUserFile, UserFile } from '@namyfile/api-client';
import { useState, useMemo } from 'react';
import { useBoundStore } from '../../store/store';

import { useAsync } from 'react-use';
import { useApi } from '../../utils/use-api';
import { batchPromises } from '../../lib/batch-promise';
import { rulesetsFileTypeExtractor } from '../../utils/extract-file-types-from-criterion-rulesets';
import { useTranslation } from 'react-i18next';

function ApplicationSelectDocuments() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const applicationId = params?.applicationId;
  const workflowType = params.applicationTitle;
  const checklistItemId = params?.checklistId;
  // const checklistTitle = params.checklistTitle;
  const urlPathNavigation = location.pathname.split('/');
  const backNavigation = urlPathNavigation.splice(1, 5).join('/');
  const { addSelectedDocumentsBeforeSubmittedList, beforeSubmittedListOfDocuments } = useBoundStore();

  const api = useApi();
  const { value: myFiles, loading: loadingFiles } = useAsync(async () => {
    const docs = await api.getMyFiles();
    return docs;
  });

  const { value: application, loading: loadingApplications } = useAsync(() =>
    api.getCase({ caseId: applicationId as string, workflowType: workflowType! })
  );

  const { t } = useTranslation('applications');

  const checklistItem = useMemo(() => {
    return application?.CaseCriteria?.find((ele) => ele.id === checklistItemId);
  }, [application?.CaseCriteria, checklistItemId]);

  const currentChecklistDocIds = useMemo(() => {
    return checklistItem?.CaseFiles?.map?.((ele) => ele!.GeneratedFile!.id);
  }, [checklistItem?.CaseFiles]);

  const selectedDocsId = useMemo(
    () => beforeSubmittedListOfDocuments.map((ele) => ele.id),
    [beforeSubmittedListOfDocuments]
  );

  const requiredDocumentTypes = useMemo(() => {
    return rulesetsFileTypeExtractor((checklistItem?.RuleSets as string | undefined) ?? '[]');
  }, [checklistItem?.RuleSets]);

  const listOfDocuments = useMemo(() => {
    const files = myFiles ?? [];

    const groupedByGeneratedFile = files.reduce(
      (acc, document) => {
        if (document.GeneratedFileId) {
          const key = document.GeneratedFileId;
          if (acc[key]) {
            acc[key].push(document);
          } else {
            acc[key] = [document];
          }
        }
        return acc;
      },
      {} as Record<string, UserFile[]>
    );

    let docs = Object.values(groupedByGeneratedFile).map((documents) => {
      const generatedFile = documents[0].GeneratedFile;
      generatedFile!.UserFamilyMember = documents[0].UserFamilyMember;
      return generatedFile;
    });

    docs = docs.filter(
      (ele) =>
        requiredDocumentTypes.includes(ele!.FileType!) &&
        ![...(currentChecklistDocIds ?? []), ...(selectedDocsId ?? [])].includes(ele!.id!)
    );
    return docs;
  }, [currentChecklistDocIds, myFiles, requiredDocumentTypes, selectedDocsId]);

  const { value: documents = [], loading: loadingDocuments } = useAsync(async () => {
    if (listOfDocuments.length) {
      const urls = await batchPromises(
        listOfDocuments.map(
          (doc) => () =>
            api.getGeneratedTfileThumbnailDownloadUrl({ generatedFileId: doc!.id!, disposition: 'attachment' })
        ),
        10
      );
      const response: (GeneratedUserFile & { thumbnailUrl: string })[] = listOfDocuments.map((doc, i) => {
        return {
          ...doc,
          id: doc!.id!,
          thumbnailUrl: urls[i].downloadUrl!
        };
      });

      return response;
    }
  }, [listOfDocuments]);

  type Document = Exclude<typeof documents, undefined>[number];

  const [checked, setChecked] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>(documents);
  const [anchorElSortMenu, setAnchorElSortMenu] = useState<null | HTMLElement>(null);

  const handleToggle = (document: Document) => () => {
    const currentIndex = checked.indexOf(document);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(document);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleOptionSortBy = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElSortMenu(event.currentTarget);
  };

  const addDocuments = () => {
    addSelectedDocumentsBeforeSubmittedList(checked as GeneratedUserFile[]);
    navigate('/' + backNavigation);
  };

  return (
    <>
      <Header />
      <Box className="!px-[20px] pt-[68px] sm:!flex sm:!justify-center !w-full">
        <Box className="!w-[100%] lg:!w-[800px] relative mb">
          {loadingDocuments || loadingFiles || loadingApplications ? (
            <Box className="!h-[80dvh] flex justify-center items-center">
              {/* <Box className="flex justify-end">
                {' '}
                <Skeleton variant="rounded" className="!w-[60px] !h-[20px] mb-[24px]"></Skeleton>
              </Box>
              <Box>
                <Skeleton variant="rounded" className="!w-full !h-[30px] mb-[24px]"></Skeleton>
                <Skeleton variant="rounded" className="!w-full !h-[50px] mb-[24px]"></Skeleton>
              </Box>
              <Box>
                <Skeleton variant="rounded" className="!w-[60px] !h-[20px] mb-[24px]"></Skeleton>
              </Box>

              <Box className="flex justify-start h-[60px] !w-full">
                <Box className="mr-[8px]">
                  <Skeleton variant="rounded" className="!w-[60px] !h-full mb-[24px]"></Skeleton>
                </Box>

                <Box className="!flex !flex-col !items-center !justify-between !h-full w-full">
                  <Skeleton variant="rounded" className="!w-full !h-[10px]"></Skeleton>
                  <Skeleton variant="rounded" className="!w-full !h-[10px]"></Skeleton>
                  <Skeleton variant="rounded" className="!w-full !h-[10px]"></Skeleton>
                </Box>
              </Box>

              <Box>
                <Skeleton variant="rounded" className="!w-full !h-[2px] my-[24px]"></Skeleton>
              </Box>

              <Box className="flex justify-start h-[60px] !w-full">
                <Box className="mr-[8px]">
                  <Skeleton variant="rounded" className="!w-[60px] !h-full mb-[24px]"></Skeleton>
                </Box>

                <Box className="!flex !flex-col !items-center !justify-between !h-full !w-full">
                  <Skeleton variant="rounded" className="!w-full !h-[10px]"></Skeleton>
                  <Skeleton variant="rounded" className="!w-full !h-[10px]"></Skeleton>
                  <Skeleton variant="rounded" className="!w-full !h-[10px]"></Skeleton>
                </Box>
              </Box> */}
              <CircularProgress className="!text-secondary"></CircularProgress>
            </Box>
          ) : (
            <Box>
              <Box className="!w-full flex justify-end py-[13px] px-[10px] mb-[8px]">
                <Button
                  className="!normal-case !text-secondary !m-text-btn-md md:!d-text-btn-md !flex !items-center !p-0"
                  onClick={() => navigate('/' + backNavigation)}
                >
                  <Icon className="mr-2 ">close_icon</Icon> {t('close')}
                </Button>
              </Box>
              <Box className="mb-[100px]">
                {documents && documents.length > 0 && (
                  <Box>
                    <Typography className="!m-text-h5 !mb-[8px]">{t('selectTheDocumentNeeded')}</Typography>
                    <Typography className="!m-text-body-md !mb-[16px]">{t('selectDocumentDescription')}</Typography>
                    <Button onClick={handleOptionSortBy} className=" !text-secondary !normal-case">
                      <Typography className="!d-text-btn-sm !mr-[8px]">{t('sortBy')}</Typography>
                      <Icon>sort</Icon>
                    </Button>
                  </Box>
                )}

                {documents && documents?.length > 0 ? (
                  <List className="w-full">
                    {documents?.map((document) => {
                      return (
                        <ListItem
                          key={document?.id}
                          className={`!py-[16px] !px-1 border-b-2 flex ${
                            checked.indexOf(document) !== -1
                              ? '!bg-primary !bg-opacity-10 !border-b-secondary !border-opacity-20'
                              : ''
                          }`}
                          onClick={handleToggle(document)}
                          // secondaryAction={}
                        >
                          <ListItemAvatar>
                            <>
                              <Checkbox
                                edge="end"
                                onChange={handleToggle(document)}
                                checked={checked.indexOf(document) !== -1}
                                inputProps={{ 'aria-labelledby': document?.id }}
                                className={`!mr-[10px]`}
                              />
                              <img src={document?.thumbnailUrl} className="mr-4 w-14 h-14 rounded inline" />
                            </>
                          </ListItemAvatar>
                          <ListItemText
                            className="flex flex-col flex-4 !w-3/4"
                            // onClick={() => openDocument(document)}
                          >
                            <Typography className="pb-[4px] sm:!m-text-body-md !m-text-body-sm !w-3/4 !truncate !...">
                              {document?.FileType}
                            </Typography>
                            <Typography className="pb-[4px] sm:!m-text-body-md !m-text-body-sm opacity-60 w-3/4">
                              {dayjs(document?.CreatedAt).format('MM/DD/YYYY')}
                            </Typography>
                            <Typography className="pb-[4px] sm:!m-text-body-md !m-text-body-sm !w-3/4">
                              {document?.UserFamilyMember
                                ? document?.UserFamilyMember?.FirstName + ' ' + document?.UserFamilyMember?.LastName
                                : 'Self'}
                            </Typography>
                          </ListItemText>
                        </ListItem>
                      );
                    })}
                  </List>
                ) : (
                  <Box className="!flex !flex-col !justify-center !items-center !text-center !p-[32px] lg:!py-[56px] !rounded-lg !border-[1px] !border-opacity-30 !border-black !mb-[24px]">
                    <Box className="w-full !flex !flex-col !justify-center !items-center sm:w-[546px]">
                      <Typography className="!m-text-body-lg-bold lg:!d-text-body-lg-bold !mb-[8px]">
                        {t('noDocs')}
                      </Typography>
                      <Typography className="!m-text-body-lg lg:!d-text-body-lg !mb-[16px] sm:!mb-[24px]">
                        {' '}
                        {t('docsOrgChecklist', { documentType: requiredDocumentTypes[0].toLowerCase() })}
                      </Typography>
                      <Button
                        onClick={() => navigate('/' + backNavigation)}
                        variant="contained"
                        className="!bg-secondary sm:w-full w-[80%] !h-[48px] !m-text-btn-md lg:!d-text-btn-md  !normal-case"
                      >
                        {t('returnButton')}
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          )}
          <OptionsSortMenu<Document>
            data={filteredDocuments.length ? filteredDocuments : documents}
            setData={setFilteredDocuments}
            anchorElSortMenu={anchorElSortMenu}
            setAnchorElSortMenu={setAnchorElSortMenu}
          />
          <Box
            sx={{ boxShadow: '0px -4px 4px -4px black' }}
            className="!fixed !py-[16px] !h-min-[70px] !z-20 bottom-0 w-full inset-x-0 !flex !flex-col !justify-center !bg-white !items-center"
          >
            <Box className="!w-[94%] md:!w-[660px] flex justify-center">
              <Button
                variant="contained"
                className={`!ml-2 sm:!min-w-[290px] !m-text-btn-md ${
                  checked.length !== 0 ? '!bg-secondary !text-white' : ''
                } !w-[98%] !h-[48px] !normal-case`}
                onClick={addDocuments}
                disabled={checked.length === 0}
              >
                {t('addDocs')}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default ApplicationSelectDocuments;
