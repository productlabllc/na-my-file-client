import {
  Select,
  FormControl,
  MenuItem,
  Checkbox,
  ListItemText,
  InputLabel,
  ListItemIcon,
  SelectChangeEvent
} from '@mui/material';
import { ActivityLogs } from '@myfile/api-client';
// import { useTranslation } from 'react-i18next';
import { useTranslation } from 'react-i18next';
interface ActivityLogActionSelectProps {
  actionTypes:
    | { name: 'user'; value: string[] }[]
    | { name: 'agent'; value: string[] }[]
    | { name: string; value: ActivityLogs }[];
  selectedActionItems: (ActivityLogs | (ActivityLogs & 'all') | string)[] | (string[] | string | ActivityLogs)[];
  handleMultiple: (
    e: SelectChangeEvent<(ActivityLogs | (ActivityLogs & string) | string)[] | (string[] | string | ActivityLogs)[]>
  ) => void;
}

function ActivityLogActionSelect({ actionTypes, selectedActionItems, handleMultiple }: ActivityLogActionSelectProps) {
  const isAllSelected = actionTypes.length > 0 && selectedActionItems.length === actionTypes.length;
  const { t } = useTranslation('user');

  return (
    <div>
      <FormControl className="!pr-[8px]">
        <InputLabel id="demo-multiple-checkbox-label">Action</InputLabel>
        <Select
          sx={{ minWidth: '160px', maxWidth: '190px !important' }}
          labelId="demo-multiple-checkbox-label"
          id="multiselect"
          multiple
          variant="outlined"
          value={selectedActionItems}
          onChange={handleMultiple}
          label="Action"
          renderValue={(selected) => {
            return selected.join(' ');
          }}
          // onLoad={() => {
          //   return 'Loading';
          // }}
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
          <MenuItem
            value="all"
            classes={{
              root: isAllSelected ? '!bg-primary !bg-opacity-20' : ''
            }}
          >
            <ListItemIcon>
              <Checkbox
                //   classes={{ indeterminate: classes.indeterminateColor }}
                checked={isAllSelected}
                indeterminate={selectedActionItems.length > 0 && selectedActionItems.length < actionTypes.length}
              />
            </ListItemIcon>
            <ListItemText primary={t('activityLogSelectActionSelectAll')} />
          </MenuItem>
          {actionTypes.map((action) => (
            <MenuItem
              key={action.value as ActivityLogs & 'all'}
              value={action.value}
              classes={{ selected: '!bg-white' }}
            >
              <ListItemIcon>
                <Checkbox
                  name="select-checkbox"
                  checked={selectedActionItems?.includes(action.value as ActivityLogs & 'all')}
                />
              </ListItemIcon>
              {/* <ListItemText primary={t(action.name as keyof typeof i18nKeys)} /> */}
              <ListItemText primary={action.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default ActivityLogActionSelect;
