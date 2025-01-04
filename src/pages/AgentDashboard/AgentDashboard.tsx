import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { useApi } from '../../utils/use-api';
import { useAsync, useDebounce } from 'react-use';
import { useTranslation } from 'react-i18next';

import AgentHeader from '../../layouts/AgentHeader/AgentHeader';
import AgentSideBar from '../../layouts/AgentSideBar/AgentSideBar';
import AgentMainBox from '../../layouts/AgentMainBox/AgentMainBox';
import OverFlowToolTip from '../../components/OverFlowTooltip/OverFlowToolTip';
import {
  Box,
  Typography,
  FormControl,
  TextField,
  InputAdornment,
  Button,
  Icon,
  Menu,
  MenuItem,
  CircularProgress
} from '@mui/material';
import { DataGrid, GridColDef, GridRowParams, GridColumnVisibilityModel } from '@mui/x-data-grid';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';

import { convertAgentRoleIntoAgency } from '../../assets/agent-role/agent-role';
import { languages } from '../../assets/languages/languages';
import * as _ from 'lodash';
import dayjs from 'dayjs';
import { GetCaseResponse } from '@namyfile/api-client';

interface User {
  id?: string;
  FirstName?: string;
  LastName?: string;
  SSN?: string;
  DOB?: string;
  Email?: string;
  Language?: string;
  CaresID?: string;
}
declare module '@mui/x-data-grid' {
  interface FooterPropsOverrides {
    count: string;
  }
}
function AgentDashboard() {
  const navigate = useNavigate();
  const [textValue, setTextValue] = useState<string>('');
  const [skip, __] = useState(0);
  const [take, _] = useState(20);
  const [searchValue, setSearchValue] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [isEmptyIsEmptyState, setIsEmptyState] = useState(false);
  const { t } = useTranslation('agent');

  const findFirstSSN = (data: GetCaseResponse) => {
    if (data.CaseTeamAssignments) {
      for (const caseAssignment of data.CaseTeamAssignments) {
        const caseDetails = caseAssignment.Case;
        if (caseDetails && caseDetails.CaseAttributes) {
          for (const attribute of caseDetails.CaseAttributes) {
            if (attribute.name === 'ssn') {
              return attribute.value;
            }
          }
        }
      }
    }

    return null;
  };

  const findFirstCareID = (data: GetCaseResponse) => {
    if (data.CaseTeamAssignments) {
      for (const caseAssignment of data.CaseTeamAssignments) {
        const caseDetails = caseAssignment.Case;
        if (caseDetails && caseDetails.AgencyCaseIdentifier) {
          return caseDetails.AgencyCaseIdentifier;
        }
      }
    }

    return null;
  };

  const findFirstBuildingUnit = (data: GetCaseResponse) => {
    if (data.CaseTeamAssignments) {
      for (const caseAssignment of data.CaseTeamAssignments) {
        const caseDetails = caseAssignment.Case;
        const buldingUnit = caseDetails?.CaseAttributes?.find((item) => item.name === 'buildingUnit')?.value;
        if (buldingUnit) {
          return buldingUnit;
        }
      }
    }

    return null;
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const api = useApi();

  useDebounce(
    () => {
      setSearchValue(textValue);
    },
    300,
    [textValue]
  );

  const { value: user, loading: loadingUserInfo } = useAsync(() => api.getUser());

  const agentRole = user?.StakeholderGroupRoles?.[0]?.StakeholderGroupRole?.Name ?? '';

  /**
   * NOTE: Searching by dob is not possible because date is not a string
   * If we want to enable date search, let add date filters.
   */
  const { value, loading: loadingData } = useAsync(async () => {
    return api.getUsersCases({ search: searchValue, skip, take });
  }, [searchValue, skip, take]);

  const data = useMemo(() => {
    if (
      convertAgentRoleIntoAgency(agentRole) === 'HPD' ||
      convertAgentRoleIntoAgency(agentRole) === 'DHS' ||
      convertAgentRoleIntoAgency(agentRole) === 'Sponsor' ||
      convertAgentRoleIntoAgency(agentRole) === 'CBO'
    ) {
      if (value?.length === 0) {
        setIsEmptyState(true);
        return;
      }
      const hpdUsers = value?.filter((user) =>
        user.CaseTeamAssignments?.filter((element) => element.Case?.CaseType === 'HPD')
      );

      const data = hpdUsers?.map((item) => {
        const foundSSN = findFirstSSN(item as GetCaseResponse);
        const founBuildingUnit = findFirstBuildingUnit(item as GetCaseResponse);

        return {
          id: item.id,
          SSN: foundSSN,
          buildingUnit: founBuildingUnit,
          DOB: item.DOB,
          Email: item.Email,
          FirstName: item.FirstName,
          LastName: item.LastName,
          Language: item.LanguageIsoCode
        };
      });
      return data;
    }
    if (convertAgentRoleIntoAgency(agentRole) === 'PATH') {
      if (value?.length === 0) {
        setIsEmptyState(true);
        return;
      }
      const pathUsers = value?.filter((user) =>
        user.CaseTeamAssignments?.filter((element) => element.Case?.CaseType === 'PATH')
      );

      const data = pathUsers?.map((item) => {
        const foundCaresId = findFirstCareID(item as GetCaseResponse);
        return {
          id: item.id,
          CaresID: foundCaresId,
          DOB: item.DOB,
          Email: item.Email,
          FirstName: item.FirstName,
          LastName: item.LastName,
          Language: item.LanguageIsoCode
        };
      });
      return data;
    }
  }, [agentRole, value]);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTextValue(value);
  };

  const clearSearchField = () => {
    setTextValue('');
  };

  const openUserCases = (user: User) => {
    // console.log(user);
    navigate(`/client/${user.id}`);
  };

  const columns: GridColDef[] = [
    // {
    //   field: '',
    //   headerClassName: '!d-text-body-sm-bold !bg-white ',
    //   sortable: false,
    //   cellClassName: '!d-text-body-xsm !text-wrap'
    // },
    {
      field: 'buildingUnit',
      headerName: t('buildingUnit'),
      // type: 'date',
      headerClassName: '!d-text-body-sm-bold !pl-[24px]',
      flex: 3,
      cellClassName: '!d-text-body-xsm !pl-[24px]',
      renderCell: (params) => {
        return <OverFlowToolTip result={params.row.buildingUnit} />;
      }
    },

    {
      field: 'FirstName',
      headerClassName: '!d-text-body-sm-bold',
      headerName: t('firstName'),
      flex: 1.5,
      cellClassName: '!d-text-body-xsm !text-wrap',
      renderCell: (params) => {
        return <OverFlowToolTip result={params.row.FirstName} />;
      }
    },
    {
      field: 'LastName',
      headerName: t('lastName'),
      // type: 'date',
      headerClassName: '!d-text-body-sm-bold',
      flex: 1.5,
      cellClassName: '!d-text-body-xsm',
      renderCell: (params) => {
        return <OverFlowToolTip result={params.row.LastName} />;
      }
    },

    {
      // Update SSN string when API has AgencyCaseIdentifier value
      field: convertAgentRoleIntoAgency(agentRole) !== 'PATH' ? 'SSN' : 'CaresID',
      headerName: convertAgentRoleIntoAgency(agentRole) !== 'PATH' ? t('caresID') : t('caseNumber'),
      headerClassName: '!d-text-body-sm-bold',
      // type: 'date',
      flex: 1.5,
      cellClassName: '!d-text-body-xsm '
    },
    {
      field: 'DOB',
      headerName: t('DOB'),
      // type: 'date',
      headerClassName: '!d-text-body-sm-bold',
      flex: 1.5,

      //   headerAlign: 'center',
      cellClassName: '!d-text-body-xsm',
      renderCell: (params) => {
        return dayjs(params.row.DOB).add(1, 'day').format('MM/DD/YYYY');
      }
    },
    {
      field: 'Email',
      headerName: t('email'),
      // type: 'date',
      headerClassName: '!d-text-body-sm-bold',
      flex: 2,

      //   headerAlign: 'center',
      cellClassName: '!d-text-body-xsm',
      renderCell: (params) => {
        return <OverFlowToolTip result={params.row.Email} />;
      }
    },
    {
      field: 'Language',
      headerName: t('language'),
      // type: 'date',
      headerClassName: '!d-text-body-sm-bold',
      flex: 1,
      //   headerAlign: 'center',
      cellClassName: '!d-text-body-xsm',
      renderCell: (params) => {
        return languages[params.row.Language];
      }
    },
    {
      field: 'actionType',
      sortable: false,
      align: 'right',
      //   headerAlign: 'center',
      headerName: '',
      type: 'actions',
      flex: 0.1,

      renderCell: () => (
        <>
          <Button
            onClick={handleClick}
            className="!text-secondary !d-text-btn-sm !normal-case !p-0 !m-0 !flex !justify-center"
          >
            <Icon className="">more_vert_icon</Icon>
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            // MenuListProps={{
            //   'aria-labelledby': 'basic-button'
            // }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            sx={{
              '.MuiMenu-paper': {
                boxShadow: 2,
                width: '170px'
              }
            }}
          >
            <MenuItem onClick={handleClose} className="!m-text-body-sm sm:!d-text-body-sm">
              {t('viewApplications')}
            </MenuItem>
            <MenuItem onClick={handleClose} className="!m-text-body-sm sm:!d-text-body-sm">
              {t('viewActivityLog')}
            </MenuItem>
          </Menu>
        </>
      )
    }
  ];

  const columnVisibilityModel: GridColumnVisibilityModel = {
    buildingUnit: convertAgentRoleIntoAgency(agentRole) !== 'PATH'
  };

  // if (loadingUserInfo) {
  //   return (
  //     <Box className="flex flex-col h-[90vh] justify-center items-center">
  //       <CircularProgress />
  //       <Typography>{t('loadingPage')}</Typography>
  //     </Box>
  //   );
  // } else {
  return (
    <Box>
      <Box className="relative !z-30">
        <AgentHeader />
      </Box>
      <Box className="flex flex-row">
        <Box className="relative !z-10">
          <AgentSideBar />
        </Box>
        {loadingUserInfo ? (
          <Box className="flex flex-col h-[90vh] justify-center items-center">
            <CircularProgress />
            <Typography>{t('loadingPage')}</Typography>
          </Box>
        ) : (
          <AgentMainBox>
            <Box className="w-full">
              <Typography className="!d-text-h3 !mb-[16px]">{`${convertAgentRoleIntoAgency(agentRole)} ${t(
                'dashboard'
              )}`}</Typography>
              <Typography className="!d-text-body-md !mb-[24px]">{t('reviewAndVerify')}</Typography>
              <FormControl className="w-[80%] max-w-[700px] pr-[25px] !mb-[36px]">
                <TextField
                  variant="outlined"
                  onChange={handleChange}
                  placeholder={t('search')}
                  value={textValue}
                  helperText={t('searchHelp')}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"></InputAdornment>,
                    endAdornment: (
                      <InputAdornment position="end">
                        {textValue ? <ClearIcon onClick={clearSearchField} /> : <SearchIcon />}
                      </InputAdornment>
                    )
                  }}
                />
              </FormControl>
              <Box className="w-[97%]">
                <DataGrid
                  columns={columns}
                  rows={data ? data : []}
                  initialState={{
                    pagination: { paginationModel: { pageSize: 10 } }
                  }}
                  pageSizeOptions={[10, 25]}
                  rowHeight={65}
                  onRowClick={(params: GridRowParams<User>) => {
                    openUserCases(params.row);
                  }}
                  columnVisibilityModel={columnVisibilityModel}
                  loading={loadingData}
                  // onRowClick={(params: GridRowParams<UserFile>) => {
                  //   openDocument(params.row);
                  // }}

                  slots={{
                    noRowsOverlay: () => (
                      <>
                        {!loadingData && isEmptyIsEmptyState && (
                          <Box className="!flex !justify-center !items-center flex-col h-[100%]">
                            <Typography className="!d-text-body-md-bold mb-[16px]">{t('noClietmatched')} </Typography>
                            <Typography className="!d-text-body-md"> {t('tryDifferentSearch')}</Typography>
                          </Box>
                        )}
                      </>
                    )
                    //   footer: (props: NonNullable<GridSlotsComponentsProps['footer']>) => (
                    //     <GridFooterContainer className="!flex !justify-between px-[32px]">
                    //       {/* Add what you want here */}

                    //       <Box>All users: {props.count}</Box>
                    //     </GridFooterContainer>
                    //   )
                  }}
                  slotProps={{
                    footer: { count: data?.length.toString() }
                  }}
                  sx={{
                    border: '1px solid rgba(0, 0, 0, 0.24)',
                    '.MuiDataGrid-virtualScroller': {
                      minHeight: '650px !important'
                    },
                    '.MuiDataGrid-iconButtonContainer': {
                      visibility: 'visible'
                    },
                    '.MuiDataGrid-sortIcon': {
                      opacity: 'inherit !important'
                    },
                    '.MuiDataGrid-columnSeparator': {
                      display: 'none'
                    },
                    '.MuiDataGrid-columnHeader': {
                      // paddingBottom: '20px'
                      // paddingTop: '16px'
                    },
                    '.MuiDataGrid-columnHeaderTitle': {
                      fontWeight: '700'
                    }
                  }}
                ></DataGrid>
              </Box>
            </Box>
          </AgentMainBox>
        )}
      </Box>
    </Box>
  );
}

export default AgentDashboard;
