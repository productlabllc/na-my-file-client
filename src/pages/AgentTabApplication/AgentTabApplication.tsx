import { useEffect, useState, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { GetUser } from '@namyfile/api-client';
import { useApi } from '../../utils/use-api';
import { useAsyncRetry } from 'react-use';
// import { ActivityLogItem } from '../../components/ActivityLogItem/ActivityLogItem';

import AgentCaseAccordion from '../../components/AgentCaseAccordion/AgentCaseAccordion';
import { useTranslation } from 'react-i18next';

function AgentTabApplication({ userId, user, agentRole }: { userId: string; user: GetUser; agentRole: string }) {
  const api = useApi();
  const [expanded, setExpanded] = useState('');

  const { value: cases, retry } = useAsyncRetry(() => api.getUserCasesAdmin({ userId }), []);

  const sortedCases = useMemo(() => {
    return cases?.sort((a, b) => {
      const dateA = a.CreatedAt ? new Date(a.CreatedAt).getTime() : Infinity;
      const dateB = b.CreatedAt ? new Date(b.CreatedAt).getTime() : Infinity;
      return dateB - dateA;
    });
  }, [cases]);

  useEffect(() => {
    if (sortedCases) {
      setExpanded(sortedCases[0].id);
    }
  }, [sortedCases]);

  const { t } = useTranslation('agent');

  // const { value: userActivities } = useAsync(() => api.getActivitiesForUser({ userId, skip: 0, take: 10 }));

  const handleExpansion = (caseId: string) => {
    if (expanded === caseId) {
      setExpanded('');
    } else {
      setExpanded(caseId);
    }
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  return (
    <Box className="w-full mt-[40px] pr-[24px]">
      <Box className="!mb-[32px]">
        <Typography className="!d-text-h4 !mb-[16px]">{t('documentCollection')}</Typography>
        <Typography className="!d-text-body-md">{t('reviewAndTractActions')}</Typography>

        {/* {userActivities?.items && userActivities?.items.length > 0 && (
          <Box className="border-2 w-[700px]">
            <Box className="flex justify-between items-center !border-b-[1px] p-[16px]">
              <Box className="flex flex-row">
                <Typography className="!d-text-h5 !mr-[12px]">While you were away...</Typography>
                <Badge color="primary" badgeContent={5}></Badge>
              </Box>
              <Button className="!normal-case items-center !d-text-btn-sm">
                View all
                <Icon>keyboard_arrow_right_icon</Icon>
              </Button>
            </Box>
            <Box className="p-[16px]">
              {userActivities?.items?.slice(0, 4).map((ele) => {
                return (
                  <ActivityLogItem
                    ActivityValue={ele.ActivityValue}
                    key={ele.id}
                    activityAction={ele.ActivityType}
                    user={`${ele.User?.FirstName} ${ele.User?.LastName}`}
                    dateAndTime={ele.CreatedAt}
                    userData={ele.User}
                  />
                );
              })}
            </Box>
          </Box>
        )} */}
      </Box>
      <Box>
        {sortedCases?.map((caseItem) => {
          return (
            <AgentCaseAccordion
              refreshCases={retry}
              key={caseItem.id}
              user={user}
              agentRole={agentRole}
              userId={userId}
              caseItem={caseItem}
              expanded={caseItem.id === expanded}
              onExpand={handleExpansion}
            />
          );
        })}
      </Box>
    </Box>
  );
}

export default AgentTabApplication;
