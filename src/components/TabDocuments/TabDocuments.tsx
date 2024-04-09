import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Icon,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemButton,
  Typography
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowParams
} from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

import OptionsDocuments from '../OptionsDocuments/OptionsDocuments';
import OptionsSortMenu from '../OptionsSortMenu/OptionsSortMenu';
import documentData from '../../assets/mock-data/mock-documents.json';

//Types
import Document from '../../types/Document';

function TabDocuments() {
  const theme = useTheme();
  const isXlAndUp = useMediaQuery(theme.breakpoints.up('xl'));
  const [data, setData] = useState<Document[] | null>([...documentData]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorElSortMenu, setAnchorElSortMenu] = useState<null | HTMLElement>(
    null
  );
  const [document, setDocument] = useState<Document | null>(null);
  const navigate = useNavigate();
  console.log(data);
  const handleOption = (
    event: React.MouseEvent<HTMLElement>,
    documentData?: Document
  ) => {
    console.log(documentData);
    setAnchorEl(event.currentTarget);
    if (documentData) {
      setDocument(documentData);
    }
  };

  const handleOptionSortBy = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElSortMenu(event.currentTarget);
  };

  const openDocument = (document: Document | GridRowParams) => {
    navigate(`/document/${document.id}`);
    console.log(document);
  };

  const columns: GridColDef[] = [
    {
      field: 'thumbnailUrl',
      sortable: false,
      headerName: '',
      width: 100,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <img src={params.value} className="mr-4 h-16 w-16 rounded inline" />
        );
      }
    },
    {
      field: 'title',
      headerClassName: '!text-secondary !d-text-body-md-bold !text-extra-bold ',
      headerName: 'Document Type',
      flex: 3,
      maxWidth: 400,
      cellClassName: '!d-text-body-sm !text-wrap'
    },
    {
      field: 'createdAt',
      headerName: 'Date Added',
      // type: 'date',
      headerClassName: '!text-secondary !d-text-btn-md',
      flex: 2,
      cellClassName: '!d-text-body-sm opacity-60'
    },
    {
      field: 'familyMemberUser',
      headerName: 'Family Member',
      headerClassName: '!text-secondary !d-text-btn-md',
      // type: 'date',
      flex: 2,
      cellClassName: '!d-text-body-sm '
    },
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
          onClick={(e) => handleOption(e, params.row)}
          className="!text-secondary !d-text-btn-sm !normal-case"
        >
          <Icon className="!mr-3">more_vert_icon</Icon>
          <Typography className="!d-text-btn-sm">Options</Typography>
        </Button>
      )
    }
  ];
  return (
    <Box className="!w-full">
      {data?.length === 0 || !data ? (
        <>
          <Box className="flex flex-col items-center w-full !border-2 !border-disabledBackground rounded py-[44px] sm:py-[24px] lg:py-[32px] d-text-body-md sm:d-text-body-lg ">
            <Box className="lg:w-[630px] sm:w-[500px] pb-[24px] px-[16px]">
              <p className="text-center">
                There are no documents saved to your account yet. You can upload
                these types of documents: Driver License, Birth Certificate,
                Passport, W-2, 401K, etc.
              </p>
            </Box>
            <Button className="!bg-secondary !text-white !h-12 lg:!m-text-btn-lg sm:!m-text-btn-md !m-text-btn-md !normal-case !min-w-[220px]">
              Add document
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
              className="!py-[16px] !w-[94%] xl:!w-[120px] !h-12 !bg-secondary !m-text-btn-md !normal-case"
              onClick={() => navigate('/upload-generator')}
            >
              Upload
            </Button>
          </Box>
          {/* Mobile and Tablet "Sort by" button to open sorting open menu*/}
          <Button
            onClick={handleOptionSortBy}
            className=" !text-secondary !normal-case block xl:!hidden"
          >
            <Typography className="!d-text-btn-sm !mr-[8px]">
              Sort by
            </Typography>
            <Icon>sort</Icon>
          </Button>

          {/*Expand "Options" in DataGrid for "Edit", "Delete", "Download" actions */}
          <OptionsDocuments
            anchorEl={anchorEl}
            document={document}
            setAnchorEl={setAnchorEl}
            setData={setData}
            data={data}
          />

          <OptionsSortMenu
            data={data}
            setData={setData}
            anchorElSortMenu={anchorElSortMenu}
            setAnchorElSortMenu={setAnchorElSortMenu}
          />

          {/* Show DataGrid when the screen size is x-larger and up */}
          {isXlAndUp ? (
            <DataGrid
              columns={columns}
              rows={data}
              hideFooterPagination={true}
              className="pt-[16px] !hidden xl:!block"
              onRowClick={(params) => {
                openDocument(params);
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
                      key={document.id}
                      className="!py-[16px] !px-0 border-b-2 flex"
                      secondaryAction={
                        <>
                          <ListItemButton
                            onClick={(e) => handleOption(e, document)}
                            className="!d-text-body-lg flex flex-row text-secondary"
                          >
                            <Icon>more_vert_icon</Icon>
                            <Typography className="!ml-[8px] hidden sm:block !m-text-btn-md text-secondary">
                              Options
                            </Typography>
                          </ListItemButton>
                        </>
                      }
                    >
                      <ListItemAvatar onClick={() => openDocument(document)}>
                        <img
                          src={document?.thumbnailUrl}
                          className="mr-4 w-14 h-14 rounded inline"
                        />
                      </ListItemAvatar>
                      <ListItemText
                        className="flex flex-col flex-4 !w-3/4"
                        onClick={() => openDocument(document)}
                      >
                        <Typography className="pb-[4px] sm:!m-text-body-md !m-text-body-sm !w-3/4 !truncate !...">
                          {document?.title}
                        </Typography>
                        <Typography className="pb-[4px] sm:!m-text-body-md !m-text-body-sm opacity-60 w-3/4">
                          {document?.createdAt}
                        </Typography>
                        <Typography className="pb-[4px] sm:!m-text-body-md !m-text-body-sm !w-3/4">
                          {document?.familyMemberUser}
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
