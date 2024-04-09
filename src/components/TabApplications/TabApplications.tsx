import { useEffect, useState } from 'react';
import { useBoundStore } from '../../store/store';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Dialog, useMediaQuery } from '@mui/material';
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
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import HPDImg from '../../assets/HPD.svg';
import PATHImg from '../../assets/DHSPATH.svg';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import ApplicationPATHForm from '../ApplicationPATHForm/ApplicationPATHForm';
import ApplicationHPDForm from '../ApplicationHPDForm/ApplicationHPDForm';

import PATHApplicationType from '../../types/PATHApplicationType';
import HPDApplicationType from '../../types/HPDApplicationType';

function TabApplications() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isXlAndUp = useMediaQuery(theme.breakpoints.up('xl'));

  const { getApplications, isApplicationOpenWithStatusActive } =
    useBoundStore();

  useEffect(() => {
    setApplicationsData([...getApplications()]);
  }, [getApplications()]);

  const [applicationsData, setApplicationsData] = useState<
    (PATHApplicationType | HPDApplicationType)[]
  >([...getApplications()]);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [application, setApplication] = useState<
    PATHApplicationType | HPDApplicationType
  >();

  const handleOpenDialog = (
    application: PATHApplicationType | HPDApplicationType
  ) => {
    setApplication(application);
    setIsEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsEditDialogOpen(false);
  };

  const columns: GridColDef[] = [
    {
      field: 'organization',
      headerClassName: '!text-secondary !d-text-body-md-bold !text-extra-bold ',
      headerName: 'Application',
      sortable: false,
      flex: 3,
      maxWidth: 500,
      cellClassName: '!d-text-body-sm !text-wrap',
      renderCell: (params: GridRenderCellParams) => (
        <Box className="flex flex-row items-center">
          <img
            className="mr-4 h-16 w-16 rounded inline"
            src={params.value.includes('HPD') ? HPDImg : PATHImg}
          ></img>
          <Typography>
            {params.value === 'HPD' && 'HPD for Set Aside Affordable Housing'}
            {params.value === 'PATH' && 'PATH for Temporary Shelter Intake'}
          </Typography>
        </Box>
      )
    },
    {
      field: 'status',
      headerName: 'Application status',
      // type: 'date',
      sortable: false,
      headerClassName: '!text-secondary !d-text-btn-md',
      flex: 2,
      renderCell: (params: GridRenderCellParams) => (
        <Box className="flex flex-row items-center">
          {params.value === 'Active' && (
            <>
              <Icon className="!mr-1 !px-0 !text-applicationActive !scale-50">
                circle_icon
              </Icon>
              <Typography className="!text-applicationActive sm:!m-text-body-md-bold !m-text-body-sm-bold ">
                {params.value}
              </Typography>
            </>
          )}

          {params.value === 'Closed' && (
            <>
              <Icon className="!mr-1 !px-0 !text-applicationClose !scale-50">
                circle_icon
              </Icon>
              <Typography className="!text-applicationClose sm:!m-text-body-md-bold !m-text-body-sm-bold ">
                {params.value}
              </Typography>
            </>
          )}
        </Box>
      )
    },
    {
      field: 'createdAt',
      headerName: 'Date added',
      headerClassName: '!text-secondary !d-text-btn-md',
      // type: 'date',
      flex: 2,
      cellClassName: '!d-text-body-sm opacity-60'
    },
    {
      field: 'editApplication',
      sortable: false,
      align: 'left',
      headerName: '',
      type: 'actions',
      flex: 2,
      width: 100,
      renderCell: (params) => {
        console.log(params);
        return (
          <Button
            onClick={() => handleOpenDialog(params.row)}
            className="!text-secondary !d-text-btn-sm !normal-case"
          >
            <EditOutlinedIcon className="!mr-3 !text-secondary" />
            <Typography className="!d-text-btn-sm">Edit</Typography>
          </Button>
        );
      }
    }
  ];

  const openApplication = (
    application: PATHApplicationType | HPDApplicationType
  ) => {
    navigate(`/application/${application.organization}/${application.id}`);
  };

  return (
    <Box>
      {applicationsData.length === 0 ? (
        <Box className="flex flex-col items-center w-full !border-2 !border-disabledBackground rounded py-[44px] sm:py-[24px] lg:py-[32px] d-text-body-md sm:d-text-body-lg ">
          <Box className="lg:w-[650px] sm:w-[500px] pb-[24px] px-[16px]">
            <p className="text-center">
              There are no active applications saved to your aacount yet. You
              can create an application for HPD (Housing Preservation &
              Development) or PATH (Presentation Assistance and Temporary
              Housing).
            </p>
          </Box>
          <Button
            onClick={() => navigate('/create-application')}
            // disabled={isApplicationOpenWithStatusActive()}
            className="!bg-secondary !text-white !h-12 lg:!m-text-btn-lg sm:!m-text-btn-md !m-text-btn-md !normal-case !min-w-[220px]"
          >
            Add application
          </Button>
        </Box>
      ) : (
        <Box className="w-full">
          {isXlAndUp && (
            <Button
              variant="contained"
              disabled={isApplicationOpenWithStatusActive()}
              className={`!my-[18px] xl:!min-w-[120px] xl:!max-w-[180px] !h-12 ${
                isApplicationOpenWithStatusActive() ? '' : '!bg-secondary'
              } !m-text-btn-md !normal-case`}
              onClick={() => navigate('/create-application')}
            >
              Add application
            </Button>
          )}

          <Box
            sx={{ boxShadow: '0px -4px 4px -4px black' }}
            className="!fixed !py-[16px] !h-min-[70px] xl:!hidden !flex !z-20 bottom-0 w-full inset-x-0 !justify-center !bg-white !items-center"
          >
            <Button
              variant="contained"
              className={`!py-[16px] !w-[94%] !h-12 ${
                isApplicationOpenWithStatusActive() ? '' : '!bg-secondary'
              } !m-text-btn-md !normal-case`}
              disabled={isApplicationOpenWithStatusActive()}
              onClick={() => navigate('/create-application')}
            >
              Add application
            </Button>
          </Box>

          {isXlAndUp ? (
            <DataGrid
              columns={columns}
              rows={applicationsData}
              hideFooterPagination={true}
              className="pt-[16px] !hidden xl:!block"
              onRowClick={(params) => {
                openApplication(params.row);
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
                {applicationsData.map((application) => {
                  console.log(application);
                  return (
                    <ListItem
                      key={application.id}
                      className="!py-[16px] !px-0 border-b-2 flex"
                      secondaryAction={
                        <Box>
                          <ListItemButton
                            onClick={() => handleOpenDialog(application)}
                            className="!d-text-body-lg flex flex-row text-secondary"
                          >
                            <EditOutlinedIcon className="!text-secondary" />
                            <Typography className="!ml-[8px] hidden sm:block !m-text-btn-md text-secondary">
                              Edit
                            </Typography>
                          </ListItemButton>
                        </Box>
                      }
                    >
                      <ListItemAvatar
                        onClick={() => openApplication(application)}
                      >
                        <img
                          src={
                            application?.organization.includes('HPD')
                              ? HPDImg
                              : PATHImg
                          }
                          className="mr-4 w-14 h-14 rounded inline"
                        />
                      </ListItemAvatar>
                      <ListItemText
                        className="flex flex-col flex-4 !w-4/5"
                        onClick={() => openApplication(application)}
                      >
                        <Typography className="pb-[4px] sm:!m-text-body-md !m-text-body-sm !w-4/5 !truncate !text-wrap">
                          {application?.organization === 'HPD' &&
                            'HPD for Set Aside Affordable Housing'}
                          {application?.organization === 'PATH' &&
                            'PATH for Temporary Shelter Intake'}
                        </Typography>
                        <Typography className="pb-[4px] sm:!m-text-body-md !m-text-body-sm opacity-60 w-3/4">
                          {application?.createdAt}
                        </Typography>
                        <Box className="pb-[4px] sm:!m-text-body-md !m-text-body-sm !w-3/4">
                          <Box className="flex flex-row items-center">
                            {application.status === 'Active' && (
                              <>
                                <Icon className="!mr-1 !px-0 !text-applicationActive !scale-50">
                                  circle_icon
                                </Icon>
                                <Typography className="!text-applicationActive sm:!m-text-body-md-bold !m-text-body-sm-bold ">
                                  {application?.status}
                                </Typography>
                              </>
                            )}

                            {application.status === 'Closed' && (
                              <>
                                <Icon className="!mr-1 !px-0 !text-applicationClose !scale-50">
                                  circle_icon
                                </Icon>
                                <Typography className="!text-applicationClose sm:!m-text-body-md-bold !m-text-body-sm-bold ">
                                  {application?.status}
                                </Typography>
                              </>
                            )}
                          </Box>
                        </Box>
                      </ListItemText>
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          )}
        </Box>
      )}

      <Dialog
        className="w-full"
        classes={{
          paper: '!min-w-[90%] lg:!min-w-[50%]  h-[82vh] lg:h-[700px]'
        }}
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
      >
        {application?.organization === 'PATH' && (
          <ApplicationPATHForm
            application={application}
            handleCloseDialog={handleCloseDialog}
          />
        )}

        {application?.organization === 'HPD' && (
          <ApplicationHPDForm
            application={application}
            handleCloseDialog={handleCloseDialog}
          />
        )}
      </Dialog>
    </Box>
  );
}
export default TabApplications;
