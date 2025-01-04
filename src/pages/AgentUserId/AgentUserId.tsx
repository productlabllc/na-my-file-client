import { useState, useEffect, useMemo, useCallback } from 'react';
import { useApi } from '../../utils/use-api';
import { useAsync } from 'react-use';
import { useBoundStore } from '../../store/store';
import AgentHeader from '../../layouts/AgentHeader/AgentHeader';
import AgentSideBar from '../../layouts/AgentSideBar/AgentSideBar';
import AgentTabActivity from '../AgentTabActivity/AgentTabActivity';
import AgentTabApplication from '../AgentTabApplication/AgentTabApplication';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Breadcrumbs, Typography, Tabs, Tab, Divider } from '@mui/material';
// import { convertAgentRoleIntoAgency } from '../../assets/agent-role/agent-role';
import { GetUser } from '@namyfile/api-client';
import { useTranslation } from 'react-i18next';
import AgentMainBox from '../../layouts/AgentMainBox/AgentMainBox';
import AlertSuccessToastMessage from '../../components/AlertSuccessToastMessage/AlertSuccessToastMessage';
import { convertAgentRoleIntoAgency } from '../../assets/agent-role/agent-role';

const CHANGE_STATUS_OF_APPLICATION_TOAST = 'CHANGE_STATUS_OF_APPLICATION_TOAST';
const DOWNLOAD_ALL_DOCUMENTS_TOAST = 'DOWNLOAD_ALL_DOCUMENTS_TOAST';
const ADDED_NEW_NOTE_TOAST = 'ADDED_NEW_NOTE_TOAST';
const SEND_NEW_CHECKLIST_TO_CLIENT_TOAST = 'SEND_NEW_CHECKLIST_TO_CLIENT_TOAST';

function AgentUserId() {
  const navigate = useNavigate();
  const api = useApi();
  const [showMore, setShowMore] = useState(false);
  const [activeTab, setActiveTab] = useState('application');
  const [agentRole, setAgentRole] = useState<string>('');
  const { getUserData, useFetchUserData } = useBoundStore();
  const params = useParams();
  const { t } = useTranslation('agent');
  const { showToastMessageForAction, setShowToastMessageForAction, toastAction } = useBoundStore();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    console.log(event);
    setActiveTab(newValue);
    // searchParams.set('tab', newValue);
    // setSearchParams({ tab: newValue });
  };
  useEffect(() => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useFetchUserData().then(() => {
      const user = getUserData();
      if (user.StakeholderGroupRoles && user?.StakeholderGroupRoles[0].StakeholderGroupRole?.Name)
        setAgentRole(user.StakeholderGroupRoles[0].StakeholderGroupRole?.Name);
    });
  }, []);

  const {
    value: cases
    // loading: loadingCases,
  } = useAsync(() => api.getUserCasesAdmin({ userId: params.id ?? '' }), [params.id]);

  console.log('cases', cases);
  const { value: user } = useAsync(() => {
    return api.getUserAdmin({ userId: params.id ?? '' });
  });

  // console.log('USER', user);

  const sortedCases = useMemo(() => {
    return cases?.sort((a, b) => {
      const dateA = a.CreatedAt ? new Date(a.CreatedAt).getTime() : Infinity;
      const dateB = b.CreatedAt ? new Date(b.CreatedAt).getTime() : Infinity;
      return dateB - dateA;
    });
  }, [cases, user]);

  const getUserCaresId = useMemo(() => {
    if (cases && cases.length > 0) {
      if (convertAgentRoleIntoAgency(agentRole) === 'PATH') {
        if (sortedCases && sortedCases.length > 0) {
          return sortedCases[0].AgencyCaseIdentifier;
        }
        // user.CaseTeamAssignments[0].Case?.CaseAttributes.find
      } else {
        if (sortedCases && sortedCases.length > 0) {
          const findAttribute = sortedCases[0].CaseAttributes?.find((attribute) => {
            if (attribute.name === 'ssn') {
              return attribute.value;
            }
          });
          return findAttribute?.value;
        }
      }
    } else {
      return null;
    }
  }, [sortedCases]);

  const handleCloseToastMessage = () => {
    setShowToastMessageForAction(false);
    console.log(showToastMessageForAction);
  };

  const renderToastOnAction = useCallback(
    (action: string) => {
      switch (action) {
        case CHANGE_STATUS_OF_APPLICATION_TOAST:
          return (
            <AlertSuccessToastMessage
              handleCloseToastMessage={handleCloseToastMessage}
              text={t('documentCollectionUpdated')}
            />
          );
        case DOWNLOAD_ALL_DOCUMENTS_TOAST:
          return (
            <AlertSuccessToastMessage handleCloseToastMessage={handleCloseToastMessage} text={t('documentDowloaded')} />
          );
        case ADDED_NEW_NOTE_TOAST:
          return <AlertSuccessToastMessage handleCloseToastMessage={handleCloseToastMessage} text={t('noteAdded')} />;
        case SEND_NEW_CHECKLIST_TO_CLIENT_TOAST:
          return (
            <AlertSuccessToastMessage handleCloseToastMessage={handleCloseToastMessage} text={t('checklistSent')} />
          );
      }
    },
    [toastAction]
  );

  console.log('USER INFOR: ', user);

  return (
    <Box>
      <Box className="relative !z-30">
        <AgentHeader />
      </Box>
      <Box className="flex flex-row max-w-[1900px]">
        <Box className="relative !z-10">
          <AgentSideBar />
          <Box>{renderToastOnAction(toastAction)}</Box>
        </Box>
        <AgentMainBox>
          <Box className="mb-[40px]">
            <Breadcrumbs separator="›" aria-label="breadcrumb" className="!text-secondary ">
              <Typography
                color="inherit"
                className="!cursor-pointer !d-text-body-sm-bold underline underline-offset-4"
                onClick={() => navigate('/agent-dashboard')}
              >
                {t('dashboard')}
              </Typography>
              <Typography className="!cursor-default !d-text-body-sm-bold">
                {user?.FirstName} {user?.LastName}
              </Typography>
            </Breadcrumbs>
          </Box>

          <Box className="mb-[56px]">
            <Box className="flex !flex-row !items-end !mb-[16px]">
              <Typography className="!d-text-h3 !mr-[8px]">
                {user?.FirstName} {user?.LastName}
              </Typography>
              <Typography className="!d-text-body-lg">
                {convertAgentRoleIntoAgency(agentRole) === 'PATH'
                  ? `${t('caseNumber')}  ${getUserCaresId}`
                  : `${t('caseId')} ${getUserCaresId}`}
              </Typography>
            </Box>

            {user?.UserFamilyMembers && user?.UserFamilyMembers.length > 0 && (
              <Box className="flex flex-row flex-wrap items-center">
                <Typography className="!d-text-h5 !mr-[24px] whitespace-nowrap">Family members</Typography>
                {/* <Box className="flex flex-row !items-center"> */}
                {!showMore &&
                  user?.UserFamilyMembers?.slice(0, 3)?.map((member) => (
                    <Box key={member.id} className="flex flex-row mr-[12px]">
                      <Typography className="!mr-[5px] !d-text-body-sm">{`${member.FirstName} ${member.LastName}`}</Typography>
                      <Typography className="!text-applicationClose !d-text-body-xsm ">
                        {member.Relationship}
                      </Typography>
                    </Box>
                  ))}

                {showMore &&
                  user?.UserFamilyMembers?.map((member) => (
                    <Box key={member.id} className="flex flex-row mr-[12px] ">
                      <Typography className="!mr-[5px] !d-text-body-sm">{`${member.FirstName} ${member.LastName}`}</Typography>
                      <Typography className="!text-applicationClose !d-text-body-xsm">{member.Relationship}</Typography>
                    </Box>
                  ))}
                {user?.UserFamilyMembers && user?.UserFamilyMembers?.length > 3 && (
                  <>
                    {showMore ? (
                      <Typography
                        onClick={() => setShowMore(false)}
                        className="!d-text-btn-sm  !text-secondary hover:!underline hover:!decoration-secondary hover:!underline-offset-4 !cursor-pointer"
                      >
                        {t('seeLess')}
                      </Typography>
                    ) : (
                      <Typography
                        onClick={() => setShowMore(true)}
                        className="!d-text-btn-sm  !text-secondary hover:!underline hover:!decoration-secondary hover:!underline-offset-4 !cursor-pointer"
                      >
                        {t('seeMore')}
                      </Typography>
                    )}
                  </>
                )}
              </Box>
            )}
          </Box>

          <Box className="">
            <Tabs
              variant={'standard'}
              value={activeTab}
              onChange={handleChange}
              className="!w-full !sticky !top-0"
              TabIndicatorProps={{
                sx: {
                  backgroundColor: '#031553'
                }
              }}
            >
              <Tab
                className={
                  activeTab === 'application'
                    ? '!text-secondary !d-text-btn-sm !border-b-secondary !normal-case min-w-[100px] !px-[24px] !pb-[20px]'
                    : '!text-grey !d-text-btn-sm !normal-case min-w-[100px] !px-[24px] !pb-[20px]'
                }
                label={t('applications')}
                value="application"
              />
              <Tab
                className={
                  activeTab === 'activity'
                    ? '!text-secondary !d-text-btn-sm !border-b-secondary !normal-case min-w-[100px] !px-[24px] !pb-[20px]'
                    : '!text-grey !d-text-btn-sm !normal-case min-w-[100px] !px-[24px] !pb-[20px]'
                }
                label={<Box>{t('activityLogTab')}</Box>}
                value="activity"
              />
            </Tabs>
          </Box>
          <Divider className="!border-[1px] w-[98.5%]"></Divider>
          <Box className="">
            {activeTab === 'application' && (
              <AgentTabApplication userId={params.id as string} user={(user as GetUser) ?? {}} agentRole={agentRole} />
            )}
            {activeTab === 'activity' && (
              <AgentTabActivity
                userId={params.id as string}
                clientUser={user as GetUser}
                agentRole={agentRole as 'PATH' | 'HPD' | 'Sponsor' | undefined}
              />
            )}
          </Box>
        </AgentMainBox>
      </Box>
    </Box>
  );
}

export default AgentUserId;
