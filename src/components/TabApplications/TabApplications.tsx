import { useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Dialog, useMediaQuery } from '@mui/material';
import dayjs from 'dayjs';
import {
  Box,
  Button,
  Icon,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Typography,
  CircularProgress
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
// import HPDImg from '../../assets/HPD.svg';
// import PATHImg from '../../assets/DHSPATH.svg';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import ApplicationPATHForm from '../ApplicationPATHForm/ApplicationPATHForm';
import ApplicationHPDForm from '../ApplicationHPDForm/ApplicationHPDForm';

import PATHApplicationType from '../../types/PATHApplicationType';

import { useAsyncRetry } from 'react-use';
import { useApi } from '../../utils/use-api';
import { GetCaseResponse } from '@namyfile/api-client';
import { useTranslation } from 'react-i18next';

function TabApplications() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isXlAndUp = useMediaQuery(theme.breakpoints.up('xl'));
  const api = useApi();
  const { t } = useTranslation('applications');

  const { value, retry: refetch } = useAsyncRetry(() => api.getCases(), []);

  const applicationsData = value;

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [application, setApplication] = useState<GetCaseResponse>({} as GetCaseResponse);

  const handleOpenDialog = (updatedCaseData: GetCaseResponse) => {
    setApplication(updatedCaseData);
    setIsEditDialogOpen(true);
  };

  const refetchApplications = () => {
    refetch();
  };

  const handleCloseDialog = (updatedCaseData: GetCaseResponse) => {
    // TODO: Redo application update on close edit dialog so it's not override application list UI

    // if (applicationsData) {
    //   const index = applicationsData.findIndex((app) => app.id === updatedCaseData.id);

    //   if (index !== -1) {
    //     applicationsData[index] = updatedCaseData;
    //   }
    // }

    setApplication(updatedCaseData);
    setIsEditDialogOpen(false);
  };

  const hasAnyApplicationStatusActive = useMemo(() => {
    const status = applicationsData?.find((application) => application.Status === 'OPEN');
    return !!status;
  }, [applicationsData]);

  const columns: GridColDef[] = [
    {
      field: 'CaseType',
      headerClassName: '!text-black !d-text-body-md-bold !text-extra-bold ',
      headerName: t('checklist'),
      sortable: false,
      flex: 3,
      maxWidth: 500,
      cellClassName: '!d-text-body-sm !text-wrap',
      renderCell: (params: GridRenderCellParams) => {
        // console.log('params', params);
        return (
          <Box className="">
            {/* <img className="mr-4 h-16 w-16 rounded inline" src={params.value?.includes('HPD') ? HPDImg : PATHImg}></img> */}
            <Typography className="pb-[8px] !underline !underline-offset-[4px] !text-secondary !m-text-btn-sm-link md:!d-text-btn-sm-link !truncate !text-wrap">
              {params.value === 'HPD' && 'HPD for Set Aside Affordable Housing'}
              {params.value === 'PATH' && 'PATH for Temporary Shelter Intake'}
            </Typography>
            {params.value === 'HPD' &&
              params.row &&
              params.row.CaseAttributes &&
              params.row?.CaseAttributes?.length > 0 && (
                <Typography className="!m-text-body-sm !mb-[8px]">{findBuildingUnit(params.row)}</Typography>
              )}
          </Box>
        );
      }
    },
    {
      field: 'Status',
      headerName: t('applicationStatus'),
      headerAlign: 'center',
      // type: 'date',
      align: 'center',
      sortable: false,
      headerClassName: '!text-black !d-text-btn-md',
      flex: 2,
      renderCell: (params: GridRenderCellParams) => (
        <Box className="flex flex-row items-center">
          {params.value === 'OPEN' && (
            <>
              <Icon className="!mr-1 !px-0 !text-applicationClose !scale-50 ">circle_icon</Icon>
              <Typography className="!text-applicationClose  sm:!m-text-body-md-bold !m-text-body-sm-bold !normal-case">
                {t('applicationPending')}
              </Typography>
            </>
          )}

          {params.value === 'CLOSED' && (
            <>
              <Icon className="!mr-1 !px-0 !text-applicationActive !scale-50 ">circle_icon</Icon>
              <Typography className="!text-applicationActive sm:!m-text-body-md-bold !m-text-body-sm-bold !normal-case">
                {t('applicationClosed')}
              </Typography>
            </>
          )}
        </Box>
      )
    },
    {
      field: 'CreatedAt',
      headerName: 'Date added',
      headerAlign: 'center',
      headerClassName: '!text-black !d-text-btn-md',
      align: 'center',
      // type: 'date',
      flex: 2,
      renderCell: (params) => {
        return (
          <Typography className="!d-text-body-sm opacity-60">
            {dayjs(params.row.CreatedAt).format('MM/DD/YYYY')}
          </Typography>
        );
      }
    },
    {
      field: 'editApplication',
      sortable: false,
      align: 'center',
      headerName: '',
      type: 'actions',
      flex: 2,
      width: 100,
      renderCell: (params) => {
        return (
          <Button onClick={() => handleOpenDialog(params.row)} className="!text-secondary !d-text-btn-sm !normal-case">
            <EditOutlinedIcon className="!mr-3 !text-secondary" />
            <Typography className="!d-text-btn-sm">{t('edit')}</Typography>
          </Button>
        );
      }
    }
  ];

  const currentApplicationStatus = application!.CaseAttributes?.find((ele) => ele.name === 'status')?.value;

  const currentOrganization = application?.CaseType;

  const pathApplication: PATHApplicationType = useMemo(
    () => ({
      id: application!.id!,
      createdAt: application.CreatedAt ?? '',
      status: currentApplicationStatus as string,
      organization: currentOrganization as string,
      caseAttributes: application.CaseAttributes,
      ssn: application.CaseAttributes?.find((item) => item.name === 'ssn')?.value,
      shelterName: application.CaseAttributes?.find((item) => item.name === 'shelterName')?.value,
      buildingUnit: application.CaseAttributes?.find((item) => item.name === 'buildingUnit')?.value,
      caseNumber: application?.AgencyCaseIdentifier,
      familyMembers:
        application!.CaseApplicants?.map((ele) => ({
          id: ele.UserFamilyMember?.id ?? '',
          firstName: ele.UserFamilyMember?.FirstName ?? '',
          lastName: ele.UserFamilyMember?.LastName ?? '',
          relationship: ele.UserFamilyMember?.Relationship as string,
          dateOfBirth: ele.UserFamilyMember?.DOB as string
        })) ?? []
    }),
    [application, currentApplicationStatus, currentOrganization]
  );

  const openApplication = (application: GetCaseResponse) => {
    const org = application.CaseType;

    navigate(`/application/${org}/${application.id}`);
  };

  if (!applicationsData) {
    return <CircularProgress />;
  }

  const findBuildingUnit = (application: GetCaseResponse) => {
    if (application && application.CaseAttributes && application.CaseAttributes.length > 0) {
      const buildingUnit = application.CaseAttributes.find((element) => element.name === 'buildingUnit');
      if (buildingUnit) {
        return buildingUnit.value;
      } else {
        return '';
      }
    }
  };

  return (
    <Box>
      {applicationsData?.length === 0 ? (
        <Box className="flex flex-col items-center w-full !border-[1px] !border-lightGreyBorder rounded py-[44px] sm:py-[24px] lg:py-[32px] d-text-body-md sm:d-text-body-lg ">
          <Box className="lg:w-[650px] sm:w-[500px] pb-[24px] px-[16px]">
            <p className="text-center !m-text-body-md md:!d-text-body-md mb-[16px]">
              {t('noApplicationsParagraphOne')}
            </p>
            <li className="text-center !m-text-body-md md:!d-text-body-md mb-[8px]">
              {t('noApplicationsParagraphTwo')}
            </li>
            <p className="text-center !m-text-body-md md:!d-text-body-md mb-[8px]">{t('or')}</p>
            <li className="text-center !m-text-body-md md:!d-text-body-md">{t('noApplicationsParagraphThree')}</li>
          </Box>
          <Button
            onClick={() => navigate('/create-application')}
            // disabled={hasAnyApplicationStatusActive}
            className="!bg-secondary !text-white !h-12 md:!d-text-btn-md !m-text-btn-md !normal-case !min-w-[220px]"
          >
            {t('addFirstApplication')}
          </Button>
        </Box>
      ) : (
        <Box className="w-full">
          <Box className="w-full md:max-w-[570px]">
            <Typography className="!m-text-h5 md:!d-text-h5 !mb-[8px]">{t('shareYourDocuments')}</Typography>
            <Typography className="!m-text-body-md md:!d-text-body-md">{t('applicationTabDescription')}</Typography>
          </Box>

          {isXlAndUp && (
            <Button
              variant="contained"
              disabled={hasAnyApplicationStatusActive}
              className={`!my-[18px] xl:!min-w-[120px] xl:!max-w-[180px] !h-12 ${
                hasAnyApplicationStatusActive ? '' : '!bg-secondary'
              } !m-text-btn-md !normal-case`}
              onClick={() => navigate('/create-application')}
            >
              {t('addApplication')}
            </Button>
          )}

          <Box
            sx={{ boxShadow: '0px -4px 4px -4px black' }}
            className="!fixed !py-[16px] !h-min-[70px] xl:!hidden !flex !z-20 bottom-0 w-full inset-x-0 !justify-center !bg-white !items-center"
          >
            <Button
              variant="contained"
              className={`!py-[16px] !px-[16px] !w-[94%] ${
                hasAnyApplicationStatusActive ? '' : '!bg-secondary'
              } !m-text-btn-md !normal-case`}
              disabled={hasAnyApplicationStatusActive}
              onClick={() => navigate('/create-application')}
            >
              {t('addApplication')}
            </Button>
          </Box>

          {isXlAndUp ? (
            <DataGrid
              columns={columns}
              rows={applicationsData ?? []}
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
                {applicationsData?.map((application) => {
                  const organization = application.CaseType;
                  const applicationStatus = application.Status;

                  return (
                    <ListItem
                      key={application.id}
                      className="!py-[16px] !px-[8px] border-b-2 flex"
                      secondaryAction={
                        <Box>
                          <ListItemButton
                            onClick={() => handleOpenDialog(application)}
                            className="!d-text-body-lg flex flex-row text-secondary"
                          >
                            <EditOutlinedIcon className="!text-secondary" />
                            <Typography className="!ml-[8px] hidden sm:block !m-text-btn-md text-secondary">
                              {t('edit')}
                            </Typography>
                          </ListItemButton>
                        </Box>
                      }
                    >
                      {/* <ListItemAvatar onClick={() => openApplication(application)}>
                        <img
                          src={organization === 'HPD' ? HPDImg : PATHImg}
                          className="mr-4 w-14 h-14 rounded inline"
                        />
                      </ListItemAvatar> */}
                      <ListItemText
                        className="flex flex-col flex-4 !w-4/5"
                        onClick={() => openApplication(application)}
                      >
                        <Typography className="pb-[8px] !underline !underline-offset-[4px] !text-secondary !m-text-btn-sm-link md:!d-text-btn-sm-link !w-4/5 !truncate !text-wrap">
                          {organization === 'HPD' && t('HPD')}
                          {organization === 'PATH' && t('PATH')}
                        </Typography>

                        {organization === 'HPD' &&
                          application &&
                          application.CaseAttributes &&
                          application?.CaseAttributes?.length > 0 && (
                            <Typography className="!m-text-body-sm !mb-[8px]">
                              {findBuildingUnit(application)}
                            </Typography>
                          )}

                        <Typography className="pb-[16px] sm:!m-text-body-md !m-text-body-sm opacity-60 w-3/4">
                          {dayjs(application?.CreatedAt).format('MM/DD/YYYY')}
                          {/* dayjs(caseItem?.CreatedAt).format('MM/DD/YYYY') */}
                        </Typography>
                        <Box className="pb-[4px] sm:!m-text-body-md !m-text-body-sm !w-3/4">
                          <Box className="flex flex-row items-center">
                            {applicationStatus === 'OPEN' && (
                              <>
                                <Icon className="!mr-1 !px-0 !text-applicationClose  !scale-50">circle_icon</Icon>
                                <Typography className=" !text-applicationClose  sm:!m-text-body-md-bold !m-text-body-sm-bold !normal-case">
                                  {t('applicationPending')}
                                </Typography>
                              </>
                            )}

                            {applicationStatus === 'CLOSED' && (
                              <>
                                <Icon className="!mr-1 !px-0 !text-applicationActive  !scale-50">circle_icon</Icon>
                                <Typography className="!text-applicationActive sm:!m-text-body-md-bold !m-text-body-sm-bold !normal-case">
                                  {t('applicationClosed')}
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
        {currentOrganization === 'PATH' && (
          <ApplicationPATHForm
            application={pathApplication}
            handleCloseDialog={handleCloseDialog}
            refetchApplications={refetchApplications}
          />
        )}

        {currentOrganization === 'HPD' && (
          <ApplicationHPDForm
            application={pathApplication}
            handleCloseDialog={handleCloseDialog}
            refetchApplications={refetchApplications}
          />
        )}
      </Dialog>
    </Box>
  );
}
export default TabApplications;
