import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
// import { useBoundStore } from '../../store/store';
import {
  Box,
  Button,
  Icon,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  // ListItemButton,
  Typography,
  CircularProgress
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowParams } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

// import OptionsDocuments from '../OptionsDocuments/OptionsDocuments';
import OptionsSortMenu from '../OptionsSortMenu/OptionsSortMenu';
import AsyncImage from '../AsyncImage/AsyncImage';

//Types
import { useApi } from '../../utils/use-api';
import { batchPromises } from '../../lib/batch-promise';
import { useAsync } from 'react-use';
import { UserFile, GeneratedUserFile } from '@namyfile/api-client';
import { useTranslation } from 'react-i18next';
// import { useBoundStore } from '../../store/store';
// import PDFImage from '../../assets/document_16509258.png';

type Document = GeneratedUserFile & { downloadUrl?: string };

function TabDocuments() {
  const theme = useTheme();
  const isXlAndUp = useMediaQuery(theme.breakpoints.up('xl'));
  const [data, setData] = useState<Document[]>([]);
  const [anchorElSortMenu, setAnchorElSortMenu] = useState<null | HTMLElement>(null);
  // const { localThumbnail } = useBoundStore();
  const navigate = useNavigate();
  const api = useApi();

  const { value: familyMembers } = useAsync(() => api.getFamilyMembers());

  const getDataAndPresignedUrls = useCallback(async () => {
    const myFiles = await api.getMyFiles();
    const groupedByGeneratedFile = myFiles.reduce(
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

    const myDocuments = Object.values(groupedByGeneratedFile).map((documents) => {
      return documents[0].GeneratedFile;
    });

    const filesWithDownloadUrls: Promise<(GeneratedUserFile & { downloadUrl?: string })[]> = batchPromises<
      (typeof myDocuments)[0] & { downloadUrl?: string }
    >(
      myDocuments.map((document) => async () => {
        const familyMember = familyMembers?.find((member) => {
          return member.id === document?.FamilyMemberId;
        });

        const downloadUrl = await api.getGeneratedTfileThumbnailDownloadUrl({
          generatedFileId: document?.id ?? ''
        });

        return {
          ...(document ?? ({} as GeneratedUserFile)),
          downloadUrl: downloadUrl.downloadUrl,
          UserFamilyMember: familyMember
        };
      }),
      10
    );

    setData(await filesWithDownloadUrls);
    return true;
  }, [api, familyMembers]);

  const { value } = useAsync(getDataAndPresignedUrls, [familyMembers]);

  const { t } = useTranslation('docs');

  const handleOptionSortBy = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElSortMenu(event.currentTarget);
  };

  const openDocument = (document?: GeneratedUserFile) => {
    navigate(`/document/${document?.id}`);
  };

  const columns: GridColDef[] = [
    {
      field: 'downloadUrl',
      sortable: false,
      headerName: '',
      width: 100,
      renderCell: (params: GridRenderCellParams) => {
        // return (
        //   <img
        //     src={
        //       params.row.Status == 'UPLOADED'
        //         ? params.row?.downloadUrl
        //         : localThumbnail instanceof Blob && localThumbnail.type.includes('pdf')
        //           ? PDFImage
        //           : URL.createObjectURL(localThumbnail)
        //     }
        //     className={`mr-4 w-14 h-14 rounded inline ${localThumbnail instanceof Blob && localThumbnail.type.includes('pdf') ? 'object-contain' : ''}`}
        //   />
        // );
        return <AsyncImage key={params.row.id} generatedFileId={params.row.id}></AsyncImage>;
      }
    },
    {
      field: 'FileType',
      headerClassName: '!text-secondary !d-text-body-md-bold !text-extra-bold ',
      headerName: t('documentType'),
      flex: 3,
      maxWidth: 400,
      cellClassName: '!d-text-body-sm !text-wrap'
    },
    {
      field: 'CreatedAt',
      headerName: t('dateAdded'),
      // type: 'date',
      headerClassName: '!text-secondary !d-text-btn-md',
      flex: 2,
      cellClassName: '!d-text-body-sm opacity-60',
      renderCell: (params) => {
        return (
          <Typography className="!d-text-body-sm opacity-60">
            {dayjs(params.row.CreatedAt).format('MM/DD/YYYY')}
          </Typography>
        );
      }
    },
    {
      field: 'UserFamilyMember',
      headerName: t('familyMember'),
      headerClassName: '!text-secondary !d-text-btn-md',
      // type: 'date',
      flex: 2,
      cellClassName: '!d-text-body-sm ',
      renderCell: (params: GridRenderCellParams) => {
        if (params.value) {
          return `${params.row.UserFamilyMember.FirstName} ${params.row.UserFamilyMember.LastName}`;
        } else {
          return 'Self';
        }
      }
    }
  ];

  if (!value) {
    return <CircularProgress />;
  }

  return (
    <Box className="!w-full">
      {data && data.length > 0 && (
        <Box className="mb-[24px] !w-full md:!max-w-[570px]">
          <Typography className="!m-text-h5 md:!d-text-h5 !mb-[8px]">{t('documentsTabHeader')}</Typography>
          <Typography className="!m-text-body-md md:!d-text-body-md">{t('documentsTabDescription')}</Typography>
        </Box>
      )}
      {data?.length === 0 || !data ? (
        <>
          <Box className="flex flex-col items-center w-full !border-[1px] !border-lightGreyBorder rounded py-[44px] sm:py-[24px] lg:py-[32px] d-text-body-md sm:d-text-body-lg ">
            <Box className="lg:w-[630px] sm:w-[500px] pb-[24px] px-[16px]">
              <p className="text-center !m-text-body-md md:!d-text-body-md">{t('noDocs')}</p>
            </Box>
            <Button
              onClick={() => navigate('/upload-generator')}
              className="!bg-secondary !text-white !h-12 md:!d-text-btn-md !m-text-btn-md !normal-case !min-w-[220px]"
            >
              {t('addDoc')}
            </Button>
          </Box>
        </>
      ) : (
        <Box className="w-full !overflow-auto">
          {/* Upload button */}
          <Box
            sx={{ boxShadow: '0px -4px 4px -4px black' }}
            className="!fixed !py-[16px] !h-min-[70px !z-20 bottom-0 xl:!static w-full inset-x-0 xl:!bg-transparent xl:!justify-start !flex !justify-center !bg-white !items-center"
          >
            <Button
              variant="contained"
              className="!py-[16px] !px-[16px] !w-[94%] xl:!w-fit !bg-secondary !m-text-btn-md !normal-case"
              onClick={() => navigate('/upload-generator')}
            >
              {t('uploadDoc')}
            </Button>
          </Box>
          {/* Mobile and Tablet "Sort by" button to open sorting open menu*/}
          <Button
            onClick={handleOptionSortBy}
            className=" !text-secondary !normal-case block xl:!hidden !px-[10px] !py-[13px]"
          >
            <Typography className="!d-text-btn-sm !mr-[8px]">{t('sortBy')}</Typography>
            <Icon>sort</Icon>
          </Button>

          {/*Turning off Options button for a document, potentially going to be deleted completly */}
          {/*Expand "Options" in DataGrid for "Edit", "Delete", "Download" actions */}
          {/* <OptionsDocuments
            anchorEl={anchorEl}
            userFile={document}
            setAnchorEl={setAnchorEl}
            setData={setData}
            data={data}
          /> */}

          <OptionsSortMenu<Document>
            data={data}
            setData={setData}
            anchorElSortMenu={anchorElSortMenu}
            setAnchorElSortMenu={setAnchorElSortMenu}
          />

          {/* Show DataGrid when the screen size is x-larger and up */}
          {isXlAndUp ? (
            <DataGrid
              columns={columns}
              rows={data ?? []}
              hideFooterPagination={true}
              className="pt-[16px] !hidden xl:!block"
              onRowClick={(params: GridRowParams<GeneratedUserFile>) => {
                openDocument(params.row);
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
                }
              }}
            ></DataGrid>
          ) : (
            <Box className="w-full block xl:hidden pb-[100px] relative">
              {/* Show List of data items when the screen size is x-large and down */}
              <List dense className="w-full">
                {data.map((document) => {
                  return (
                    <ListItem
                      key={document?.id}
                      className="!py-[16px] !px-0 border-b-2 flex"
                      secondaryAction={
                        <>
                          {/* <ListItemButton
                            onClick={(e) => handleOption(e, document)}
                            className="!d-text-body-lg flex flex-row text-secondary"
                          >
                            <Icon>more_vert_icon</Icon>
                            <Typography className="!ml-[8px] hidden sm:block !m-text-btn-md text-secondary">
                              {t("options}
                            </Typography>
                          </ListItemButton> */}
                        </>
                      }
                    >
                      <ListItemAvatar onClick={() => openDocument(document)}>
                        {/* <img
                          src={
                            document.Status == 'UPLOADED'
                              ? document?.downloadUrl
                              : localThumbnail instanceof Blob && localThumbnail.type.includes('pdf')
                                ? PDFImage
                                : URL.createObjectURL(localThumbnail)
                          }
                          className={`mr-4 w-14 h-14 rounded inline ${localThumbnail instanceof Blob && localThumbnail.type.includes('pdf') ? 'object-contain' : ''}`}
                        /> */}
                        {document.id && <AsyncImage key={document.id} generatedFileId={document.id}></AsyncImage>}
                      </ListItemAvatar>
                      <ListItemText className="flex flex-col flex-4 !w-3/4" onClick={() => openDocument(document)}>
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
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
export default TabDocuments;
