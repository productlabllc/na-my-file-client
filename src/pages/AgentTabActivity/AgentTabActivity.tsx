import { useState, useMemo, useEffect } from 'react';
import { useApi } from '../../utils/use-api';
import { useAsync } from 'react-use';
import { CaseActivityLogs, GetUser, ActivityLogs } from '@myfile/api-client';
import dayjs from 'dayjs';

import {
  Box,
  Typography,
  FormControl,
  TextField,
  InputAdornment,
  SelectChangeEvent,
  Button
  //CircularProgress
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';

import ActivityLogActionSelect from '../../components/ActivityLogActionSelect/ActivityLogActionSelect';
import ActivityLogDateRangeSelect from '../../components/ActivityLogDateRangeSelect/ActivityLogDateRangeSelect';
import {
  ActivityLogItemSlim,
  ActivityLogFamilyMember,
  actionTypes,
  // daysRange,
  useDaysRange
} from '../../components/ActivityLogItem/ActivityLogItemSlim';
import OverFlowToolTip from '../../components/OverFlowTooltip/OverFlowToolTip';
import { AgentActivityActionType } from '../../utils/agent-acitivy-log-action-types';
import { useTranslation } from 'react-i18next';

type ApplicationType = 'PATH' | 'HPD' | 'Sponsor' | undefined;

function AgentTabActivity({ userId, clientUser }: { userId: string; agentRole: ApplicationType; clientUser: GetUser }) {
  // const { getUserActivities, fetchUserActivities, isActivityLogDataReady } = useBoundStore();
  const { t } = useTranslation('agent');

  // const [actionTypes] = useState(useActionTypes());

  const allActionTypes = useMemo(
    () =>
      actionTypes.map((item) => {
        return {
          name: t(item.name, 'agent'),
          value: item.value.map((newVal) => newVal.toString())
        };
      }),
    []
  );

  const allTimeRange = useMemo(
    () =>
      useDaysRange.map((item) => {
        return {
          name: t(item.name, 'agent'),
          value: item.value
        };
      }),
    []
  );

  // const daysRange = useMemo(() => useDaysRange.map((item) => t(item, 'agent')), []);
  const actionTypeValues = useMemo(() => allActionTypes.map((item) => item.value), [allActionTypes]);
  const actionTypeNames = useMemo(() => allActionTypes.map((item) => item.name), [allActionTypes]);

  const [selectedActionItems, setSelectedActionItems] = useState<
    (ActivityLogs | (ActivityLogs & string) | string)[] | (string[] | string | ActivityLogs)[]
  >([...actionTypeValues]);

  const [selectedActionTypeName, setSelectedActionTypeName] = useState<string[]>([...actionTypeNames]);
  const [selectedDateRangeItem, setSelectedDateRangeItem] = useState<string>(allTimeRange[0].value);
  const [searchValue, setSearchValue] = useState<string>('');

  //Days
  const todayISO = new Date().toISOString().split('T')[0];
  const todayISOWithTime = new Date().toISOString();

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayISO = yesterday.toISOString().split('T')[0];

  const pastWeek = new Date();
  pastWeek.setDate(pastWeek.getDate() - 7);
  const pastWeekISO = pastWeek.toISOString().split('T')[0];

  const pastMonth = new Date();
  pastMonth.setMonth(pastMonth.getMonth() - 1);
  const pastMonthISO = pastMonth.toISOString().split('T')[0];

  const pastYear = new Date();
  pastYear.setFullYear(pastYear.getFullYear() - 1);
  const pastYearISO = pastYear.toISOString().split('T')[0];

  // const apiAgentRoleForActivityLog = (agentRole: ApplicationType) => {
  //   if (agentRole === 'PATH') {
  //     return 'PATH';
  //   } else if (agentRole === 'Sponsor') {
  //     return 'HPD';
  //   } else {
  //     return 'HPD';
  //   }
  // };

  const clearSearchField = () => {
    setSearchValue('');
  };
  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
  };

  const api = useApi();

  const { value: activities, loading: loadingData } = useAsync(() => {
    const activityType = selectedActionItems.flat().join(',');
    if (searchValue.length > 0) {
      switch (selectedDateRangeItem) {
        case 'Any':
          return api.getActivitiesForUser({
            userId,
            activityType,
            take: 100,
            search: searchValue
            // caseType: apiAgentRoleForActivityLog(agentRole)
          });
        case 'Today':
          return api.getActivitiesForUser({
            userId,
            activityType,
            from: todayISO,
            to: todayISOWithTime,
            take: 100,
            search: searchValue
            // caseType: apiAgentRoleForActivityLog(agentRole)
          });
        case 'Yesterday':
          return api.getActivitiesForUser({
            userId,
            activityType,
            from: yesterdayISO,
            to: todayISO,
            take: 100,
            search: searchValue
            // caseType: apiAgentRoleForActivityLog(agentRole)
          });
        case 'Past week':
          return api.getActivitiesForUser({
            userId,
            activityType,
            from: pastWeekISO,
            to: todayISOWithTime,
            take: 100,
            search: searchValue
            // caseType: apiAgentRoleForActivityLog(agentRole)
          });
        case 'Past month':
          return api.getActivitiesForUser({
            userId,
            activityType,
            from: pastMonthISO,
            to: todayISOWithTime,
            take: 100,
            search: searchValue
            // caseType: apiAgentRoleForActivityLog(agentRole)
          });
        case 'Past year':
          return api.getActivitiesForUser({
            userId,
            activityType,
            from: pastYearISO,
            to: todayISOWithTime,
            take: 100,
            search: searchValue
            // caseType: apiAgentRoleForActivityLog(agentRole)
          });
        default:
          return api.getActivitiesForUser({
            userId,
            activityType,
            take: 100,
            search: searchValue
            // caseType: apiAgentRoleForActivityLog(agentRole)
          });
      }
    } else {
      switch (selectedDateRangeItem) {
        case 'Any':
          return api.getActivitiesForUser({
            userId,
            activityType,
            take: 100
            // caseType: apiAgentRoleForActivityLog(agentRole)
          });
        case 'Today':
          return api.getActivitiesForUser({
            userId,
            activityType,
            from: todayISO,
            to: todayISOWithTime,
            take: 100
            // caseType: apiAgentRoleForActivityLog(agentRole)
          });
        case 'Yesterday':
          return api.getActivitiesForUser({
            userId,
            activityType,
            from: yesterdayISO,
            to: todayISO,
            take: 100
            // caseType: apiAgentRoleForActivityLog(agentRole)
          });
        case 'Past week':
          return api.getActivitiesForUser({
            userId,
            activityType,
            from: pastWeekISO,
            to: todayISOWithTime,
            take: 100
            // caseType: apiAgentRoleForActivityLog(agentRole)
          });
        case 'Past month':
          return api.getActivitiesForUser({
            userId,
            activityType,
            from: pastMonthISO,
            to: todayISOWithTime,
            take: 100
            // caseType: apiAgentRoleForActivityLog(agentRole)
          });
        case 'Past year':
          return api.getActivitiesForUser({
            userId,
            activityType,
            from: pastYearISO,
            to: todayISOWithTime,
            take: 100
            // caseType: apiAgentRoleForActivityLog(agentRole)
          });
        default:
          return api.getActivitiesForUser({
            userId,
            activityType,
            take: 100
            // caseType: apiAgentRoleForActivityLog(agentRole)
          });
      }
    }
  }, [selectedActionItems, selectedDateRangeItem, searchValue]);

  const data = useMemo(() => {
    return activities?.items;
  }, [activities]);

  const columns: GridColDef[] = [
    {
      field: 'ActionType',
      headerName: t('action'),
      headerClassName: '!d-text-body-sm-bold !bg-white !pl-[24px]',
      flex: 2,
      cellClassName: '!d-text-body-xsm !text-wrap !pl-[24px]',
      renderCell: (params: GridRenderCellParams) => {
        const data: CaseActivityLogs = params.row;
        const result = AgentActivityActionType(data.ActivityType);
        return <OverFlowToolTip result={result ?? ''} />;
      }
    },
    {
      field: 'DocumentType',
      headerClassName: '!d-text-body-sm-bold',
      headerName: t('item'),
      flex: 2,
      renderCell(params) {
        const data: CaseActivityLogs = params.row;
        const result = ActivityLogItemSlim({ activityAction: data.ActivityType, ActivityValue: data.ActivityValue });

        return <OverFlowToolTip result={result ?? ''} />;
      }
    },
    {
      field: 'FullName',
      headerName: t('takenBy'),
      renderCell(params) {
        const data: CaseActivityLogs = params.row;
        return `${data.User?.FirstName} ${data.User?.LastName}`;
      },
      headerClassName: '!d-text-body-sm-bold',
      flex: 2,
      cellClassName: '!d-text-body-xsm'
    },
    {
      field: 'Date',
      headerName: t('date'),
      headerClassName: '!d-text-body-sm-bold',
      // type: 'date',
      flex: 2,
      cellClassName: '!d-text-body-xsm ',
      renderCell: (params) => {
        return dayjs(params.row.CreatedAt).format('MM/DD/YYYY hh:mm A');
      }
    },
    {
      field: 'FamilyMember',
      headerName: t('familyMembersActivityLog'),
      // type: 'date',
      headerClassName: '!d-text-body-sm-bold',
      flex: 2,
      cellClassName: '!d-text-body-xsm !truncate',
      renderCell(params) {
        const data: CaseActivityLogs = params.row;
        const result = ActivityLogFamilyMember({
          activityAction: data.ActivityType,
          ActivityValue: data.ActivityValue,
          userData: clientUser
        });

        return <OverFlowToolTip result={result ?? ''} />;
      }
    }
  ];

  useEffect(() => {
    if (Array.isArray(selectedActionTypeName) && selectedActionTypeName.length > 0) {
      if (selectedActionTypeName.length === actionTypeNames.length) {
        const output = document.querySelector('#multiselect');
        if (output) output.innerHTML = t('activityLogActionsAllActions', 'agent');
      } else {
        const output = document.querySelector('#multiselect');
        if (output) output.innerHTML = selectedActionTypeName.join(', ');
      }
    } else if (!Array.isArray(selectedActionTypeName)) {
      const output = document.querySelector('#multiselect');
      if (output) output.innerHTML = selectedActionTypeName;
    }
  }, [selectedActionTypeName, actionTypeNames]);

  const handleDateRange = (e: SelectChangeEvent<string>) => {
    const valueRange = e.target.value;
    console.log(valueRange);
    setSelectedDateRangeItem(valueRange);
  };

  const handleMultiple = (
    e: SelectChangeEvent<(ActivityLogs | (ActivityLogs & string) | string)[] | (string[] | string | ActivityLogs)[]>
  ) => {
    const value = e.target.value;
    console.log('value', value);
    if (value.includes('all')) {
      console.log('actionTypes', allActionTypes);
      console.log('selectedActionItems', selectedActionItems);
      setSelectedActionItems(
        (selectedActionItems && selectedActionItems.length) === (allActionTypes && allActionTypes.length)
          ? []
          : actionTypeValues
      );
      setSelectedActionTypeName(selectedActionTypeName.length === allActionTypes.length ? [] : actionTypeNames);
      return;
    }
    setSelectedActionItems([...value]);
    if (Array.isArray(value)) {
      setSelectedActionTypeName(
        value.map((optionValue) => {
          const option = allActionTypes.find((item) => item.value === optionValue);
          return option ? option.name : '';
        })
      );
    } else {
      const option = allActionTypes.find((item) => item.value.join(',') === value);
      if (option) setSelectedActionTypeName([...selectedActionTypeName, option.name]);
    }
  };

  const handleClearFilters = () => {
    setSelectedActionTypeName([...actionTypeNames]);
    setSelectedActionItems([...actionTypeValues]);
    setSelectedDateRangeItem(allTimeRange[0].value);
  };

  return (
    <Box className="mt-[40px] !max-w-[1700px] pr-[24px]">
      <Box className="mb-[24px] max-w-[630px]">
        <Typography className="!d-text-h4 !mb-[16px]">{t('activityLogTab')}</Typography>
        <Typography className="!d-text-body-md">{t('reviewAndTractActivity')}</Typography>
      </Box>
      <Box className="flex flex-row items-start !mb-[40px]">
        <FormControl className="w-[80%] max-w-[700px] !mr-[24px] ">
          <TextField
            variant="outlined"
            onChange={handleChangeSearch}
            placeholder={t('search')}
            value={searchValue}
            helperText={t('searchActivity')}
            InputProps={{
              startAdornment: <InputAdornment position="start"></InputAdornment>,
              endAdornment: (
                <InputAdornment position="end">
                  {searchValue ? (
                    <ClearIcon onClick={clearSearchField} className="cursor-pointer" />
                  ) : (
                    <SearchIcon className="cursor-pointer" />
                  )}
                </InputAdornment>
              )
            }}
          />
        </FormControl>
        <Box className="mr-[8px]">
          <ActivityLogActionSelect
            actionTypes={allActionTypes}
            selectedActionItems={selectedActionItems}
            handleMultiple={handleMultiple}
          />
        </Box>
        <Box>
          <ActivityLogDateRangeSelect
            selectedDateRangeItem={selectedDateRangeItem}
            handleDateRange={handleDateRange}
            daysRange={allTimeRange}
          />
        </Box>
        {(selectedActionTypeName.length < actionTypeValues.length ||
          selectedDateRangeItem !== allTimeRange[0].value) && (
          <Box className="!ml-[16px] flex flex-row justify-center !items-center ">
            <Button
              onClick={handleClearFilters}
              variant="text"
              className="!normal-case !d-text-body-sm-bold !py-[16px] !px-[12px] !text-nowrap"
            >
              Clear all filters
            </Button>
          </Box>
        )}
      </Box>
      <Box>
        <DataGrid
          columns={columns}
          rows={data ? data : []}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } }
          }}
          localeText={{
            MuiTablePagination: {
              labelRowsPerPage: t('rowsOnTable')
            }
          }}
          pageSizeOptions={[10, 25]}
          rowHeight={65}
          className="!w-full"
          disableRowSelectionOnClick
          loading={loadingData}
          slots={{
            noRowsOverlay: () => (
              <>
                <Box className="!flex !justify-center !items-center flex-col !h-full">
                  <Typography className="!d-text-body-md-bold !mb-[8px]">{t('noActivity')}</Typography>
                  {/* <Typography className="!d-text-body-md-bold mb-[16px]">{t('noClietmatched')}</Typography> */}
                  <Typography className="!d-text-body-md">{t('noActivityText')}</Typography>
                  {/* <Typography className="!d-text-body-md !text-black">No results</Typography> */}
                </Box>
              </>
            )
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
  );
}

export default AgentTabActivity;
