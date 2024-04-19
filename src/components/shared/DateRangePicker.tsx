import { Box, Typography, useTheme } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { colorTokens } from '../../theme';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useAppState } from '../../app-state-store';
import { useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { useMediaQuery } from '@mui/material';
import { isMobileSize, isNotDesktopSize } from '../../lib/media-queries-implemented'; // Media Query Size

type DateRangePickerPropsType = {
  onDateRangeChangeHandler: (dateFrom: Dayjs, dateTo: Dayjs) => void;
  noteText?: string;
};

const DateRangePicker = (props: DateRangePickerPropsType) => {
  const { onDateRangeChangeHandler, noteText } = props;
  const {
    globals: { globalDateFrom, globalDateTo, setGlobalDateFrom, setGlobalDateTo },
  } = useAppState();
  const [dateFrom, setDateFrom] = useState<Dayjs | null>(globalDateFrom); //adding null for non validated dates
  const [dateTo, setDateTo] = useState<Dayjs | null>(globalDateTo); //adding null for non validated dates
  const theme = useTheme();
  const colors = colorTokens(theme.palette.mode);
  const isMobile = useMediaQuery(`(max-width: ${isMobileSize}px)`); // Media Query for Mobile
  const isNotDesktop = useMediaQuery(`(max-width: ${isNotDesktopSize}px)`); // Media Query for Mobile

  useEffect(() => {
    if (dateFrom !== null && dateTo !== null) {
      //added more robustness to Dates picking
      if (dateFrom > dateTo) {
        setDateTo(dateFrom.add(1, 'day'));
      } else {
        setGlobalDateFrom(dateFrom);
        setGlobalDateTo(dateTo);
        onDateRangeChangeHandler(dateFrom, dateTo);
      }
    }
  }, [dateFrom, dateTo]);

  return (
    <Box>
      <Typography
        sx={{
          position: 'relative',
          marginTop: isMobile ? '0px' : '-34px',
          marginBottom: isMobile ? '10px' : '10px',
        }}
        variant="body2"
      >
        {noteText || ''}
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Date From"
          value={dateFrom}
          disableFuture={true} // cannot start activity from future date
          minDate={dayjs('2022-01-01')}
          maxDate={dayjs().subtract(1, 'day')}
          onChange={(d: any, context: any) => {
            const isInvalidDate = context.validationError && context.validationError === 'invalidDate';
            if (isInvalidDate) {
              setDateFrom(null);
            } else {
              setDateFrom(d);
            }
          }}
          sx={{
            marginRight: '10px',
            margin: isNotDesktopSize ? '6px' : undefined,
            // marginBottom: isMobile ? '10px' : undefined,
            maxWidth: isMobile ? '100%' : undefined,
          }}
        />
        <DatePicker
          label="Date Through"
          value={dateTo}
          minDate={dayjs('2022-01-02')}
          maxDate={dayjs().subtract(1, 'day')}
          onChange={(d: any, context: any) => {
            const isInvalidDate = context.validationError && context.validationError === 'invalidDate';
            if (isInvalidDate) {
              setDateFrom(null);
            } else {
              setDateTo(d);
            }
          }}
          sx={{ maxWidth: isMobile ? '100%' : 'undefined', margin: isNotDesktopSize ? '6px' : undefined }}
        />
      </LocalizationProvider>
    </Box>
  );
};

export default DateRangePicker;
