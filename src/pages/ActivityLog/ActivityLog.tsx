import { useState, useMemo, useEffect } from 'react';
// import { useBoundStore } from '../../store/store';
import { useAsync } from 'react-use';
import { useApi } from '../../utils/use-api';
import { Box, Typography, Button, SelectChangeEvent, CircularProgress } from '@mui/material';
import Header from '../../layouts/Header/Header';
import BackButton from '../../components/BackButton/BackButton';
import ActivityLogActionSelect from '../../components/ActivityLogActionSelect/ActivityLogActionSelect';
import ActivityLogDateRangeSelect from '../../components/ActivityLogDateRangeSelect/ActivityLogDateRangeSelect';
import { ActivityLogs } from '@myfile/api-client';
import { actionTypes, daysRange, ActivityLogItem } from '../../components/ActivityLogItem/ActivityLogItem';
import { useTranslation } from 'react-i18next';

function ActivityLog() {
  const { t } = useTranslation('user');
  const allActionTypes = useMemo(
    () =>
      actionTypes.map((item) => {
        return {
          name: t(item.name, 'user'),
          value: item.value.map((newVal) => newVal.toString())
        };
      }),
    []
  );

  const allTimeRange = useMemo(
    () =>
      daysRange.map((item) => {
        return {
          name: t(item.name, 'user'),
          value: item.value
        };
      }),
    []
  );

  const actionTypeValues = useMemo(() => allActionTypes.map((item) => item.value), [allActionTypes]);
  const actionTypeNames = useMemo(() => allActionTypes.map((item) => item.name), [allActionTypes]);
  const [selectedActionItems, setSelectedActionItems] = useState<
    (ActivityLogs | (ActivityLogs & string) | string)[] | (string[] | string | ActivityLogs)[]
  >([...actionTypeValues]);
  const [selectedActionTypeName, setSelectedActionTypeName] = useState<string[]>([...actionTypeNames]);
  const [selectedDateRangeItem, setSelectedDateRangeItem] = useState<string>(allTimeRange[0].value);

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
  const api = useApi();

  const { value: clientData, loading: loadingClientData } = useAsync(() => {
    return api.getUser();
  }, []);

  const { value: activityData, loading: loadingData } = useAsync(() => {
    const activityTypes = selectedActionItems.flat().join(',');
    switch (selectedDateRangeItem) {
      case 'Any':
        return api.getUserActivity({
          activityTypes,
          pageSize: 100,
          to: todayISOWithTime
        });
      case 'Today':
        return api.getUserActivity({
          activityTypes,
          from: todayISO,
          to: todayISOWithTime,
          pageSize: 100
        });
      case 'Yesterday':
        return api.getUserActivity({
          activityTypes,
          from: yesterdayISO,
          to: todayISO,
          pageSize: 100
        });
      case 'Past week':
        return api.getUserActivity({
          activityTypes,
          from: pastWeekISO,
          to: todayISOWithTime,
          pageSize: 100
        });
      case 'Past month':
        return api.getUserActivity({
          activityTypes,
          from: pastMonthISO,
          to: todayISOWithTime,
          pageSize: 100
        });
      case 'Past year':
        return api.getUserActivity({
          activityTypes,
          from: pastYearISO,
          to: todayISOWithTime,
          pageSize: 100
        });
      default:
        return api.getUserActivity({
          activityTypes,
          pageSize: 100
        });
    }
  }, [selectedDateRangeItem, selectedActionItems]);

  const handleClearFilters = () => {
    setSelectedActionTypeName([...actionTypeNames]);
    setSelectedActionItems([...actionTypeValues]);
    setSelectedDateRangeItem(allTimeRange[0].value);
  };

  const handleMultiple = (
    e: SelectChangeEvent<(ActivityLogs | (ActivityLogs & string) | string)[] | (string[] | string | ActivityLogs)[]>
  ) => {
    const value = e.target.value;
    console.log('value', value);
    if (value.includes('all')) {
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

  useEffect(() => {
    if (Array.isArray(selectedActionTypeName) && selectedActionTypeName.length > 0) {
      if (selectedActionTypeName.length === actionTypeNames.length) {
        const output = document.querySelector('#multiselect');
        if (output) output.innerHTML = t('activityLogShowOutputAll', 'user');
      } else {
        const output = document.querySelector('#multiselect');
        if (output) output.innerHTML = selectedActionTypeName.join(', ');
      }
    } else if (!Array.isArray(selectedActionTypeName)) {
      const output = document.querySelector('#multiselect');
      if (output) output.innerHTML = selectedActionTypeName;
    }
  }, [selectedActionTypeName, selectedDateRangeItem, activityData]);

  const handleDateRange = (e: SelectChangeEvent<string>) => {
    const value = e.target.value;
    console.log('SSSSS', value);
    setSelectedDateRangeItem(value);
  };

  return (
    <Box>
      <Header />
      <Box className="!w-full !flex !justify-center !mb-[70px]">
        <Box className="!w-full sm:!w-[70%] xl:!w-[640px] mt-[60px] !px-[16px] md:!px-[32px] sm:pb-[40px]">
          <Box className="my-[20px]">
            <BackButton text={t('returnButton')} />
          </Box>
          <Typography className="!m-text-h5 lg:!d-text-h5 !mb-[8px]">{t('activityLog')}</Typography>
          <Typography className="!m-text-body-md lg:!d-text-body-md !mb-[16px]">
            {t('activityLogDescription')}
          </Typography>

          <Box
            className={`flex flex-row flex-wrap  mb-[12px] ${
              !loadingData &&
              activityData?.items &&
              activityData.items.length === 0 &&
              selectedActionItems.length === allActionTypes.length &&
              selectedDateRangeItem === t('activityLogDateDropDownAny')
                ? 'hidden'
                : 'block'
            }`}
          >
            <ActivityLogActionSelect
              actionTypes={allActionTypes}
              selectedActionItems={selectedActionItems}
              handleMultiple={handleMultiple}
            />

            <ActivityLogDateRangeSelect
              selectedDateRangeItem={selectedDateRangeItem}
              handleDateRange={handleDateRange}
              daysRange={allTimeRange}
            />
            <Box className="sm:pl-[8px] mt-[16px] sm:mt-0 flex flex-row justify-center !items-center">
              <Button
                onClick={handleClearFilters}
                variant="text"
                className="!normal-case !m-text-body-sm-bold lg:!d-text-body-sm-bold"
              >
                {t('activityClearAllFilter')}
              </Button>
            </Box>
          </Box>
          {!loadingData &&
          activityData?.items &&
          activityData.items.length === 0 &&
          selectedActionItems.length === allActionTypes.length &&
          selectedDateRangeItem === t('activityLogDateDropDownAny') ? (
            <Box className="!h-[320px] !border-2 !border-secondary !border-solid !border-opacity-20 rounded flex flex-col justify-center items-center">
              <Typography className="!m-text-body-md-bold !mb-[12px]">No activity</Typography>
              <Typography className="!m-text-body-md text-center !w-[250px] sm:!w-[320px] lg:!w-[380px]">
                {t('activityLogEmptyState')}
              </Typography>
            </Box>
          ) : (
            <Box>
              <Box className="!w-full">
                {loadingData ? (
                  <>
                    <Box className="h-[20vh] w-full flex flex-col justify-center items-center">
                      <CircularProgress className="!text-primary mb-[12px]" />
                      <Typography>{t('loadingData')}</Typography>
                    </Box>
                  </>
                ) : (
                  <>
                    {selectedActionItems.length > 0 &&
                    activityData?.items &&
                    activityData?.items?.length > 0 &&
                    clientData &&
                    !loadingClientData ? (
                      <Box className="border-2 rounded-md lg:w-full">
                        {activityData?.items?.map((activity) => (
                          <Box key={activity.id}>
                            <ActivityLogItem
                              ActivityValue={activity?.ActivityValue}
                              activityAction={activity?.ActivityType}
                              user={activity?.User?.FirstName}
                              dateAndTime={activity?.CreatedAt}
                              userData={activity?.User}
                              clientData={clientData}
                            />
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <Box className="!my-[24px]">
                        <Typography className="!m-text-body-lg-bold lg:!d-text-body-lg-bold !mb-[12px]">
                          {t('activityLogNoResults')}
                        </Typography>
                        <Typography className="!m-text-body-sm lg:!d-text-body-sm">
                          {t('activityLogTryDifferentSearch')}
                        </Typography>
                      </Box>
                    )}
                  </>
                )}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default ActivityLog;
