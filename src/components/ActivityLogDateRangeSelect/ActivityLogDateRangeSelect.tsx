import {
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  SelectChangeEvent
} from '@mui/material';

interface ActivityLogDateRangeSelectProps {
  selectedDateRangeItem: string;
  handleDateRange: (e: SelectChangeEvent<string>) => void;
  daysRange: Array<{ name: string; value: string }>;
}

function ActivityLogDateRangeSelect({
  selectedDateRangeItem,
  handleDateRange,
  daysRange
}: ActivityLogDateRangeSelectProps) {
  return (
    <>
      <FormControl sx={{ maxWidth: '180px', minWidth: '150px' }}>
        <RadioGroup value={selectedDateRangeItem} onChange={handleDateRange}>
          <InputLabel id="demo-multiple-checkbox-label">Date</InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            variant="outlined"
            value={selectedDateRangeItem}
            onChange={handleDateRange}
            aria-hidden={false}
            label="Date"
            renderValue={(selected) => {
              // const foundItem = daysRange.find((v) => v.value === selected);
              // return foundItem ? foundItem.name : '';
              return selected ? selected : '';
            }}
            MenuProps={{
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left'
              },
              transformOrigin: {
                vertical: 'top',
                horizontal: 'left'
              }
            }}
          >
            {daysRange.map((day) => (
              <MenuItem key={day.value} value={day.value}>
                <FormControlLabel value={day.name} control={<Radio />} label={day.name} />
              </MenuItem>
            ))}
          </Select>
        </RadioGroup>
      </FormControl>
    </>
  );
}

export default ActivityLogDateRangeSelect;
