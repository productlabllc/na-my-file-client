import { GetUserActivityResponse } from '@namyfile/api-client';
import dayjs from 'dayjs';

export const renderDeadline = (
  index: number,
  caseItem: string | undefined,
  activityTime: string | undefined,
  activitiesList: GetUserActivityResponse | undefined,
  isPreviousChecklistApproved: boolean
) => {
  if (activitiesList?.items && activitiesList?.items.length > 0) {
    if (index <= 0) {
      return dayjs(caseItem).add(10, 'day').format('MM-DD-YYYY');
    } else {
      if (isPreviousChecklistApproved) {
        return dayjs(activityTime).add(10, 'day').format('MM-DD-YYYY');
      } else {
        return dayjs(caseItem).add(10, 'day').format('MM-DD-YYYY');
      }
    }
  } else {
    return dayjs(caseItem).add(10, 'day').format('MM-DD-YYYY');
  }
};
