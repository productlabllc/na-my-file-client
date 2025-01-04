import { useLocation } from 'react-router-dom';
import { Box, Typography, Icon, Divider } from '@mui/material';
import ApplicationChecklistAccordion from '../../components/ApplicationChecklistAccordion/ApplicationChecklistAccordion';

import Header from '../../layouts/Header/Header';
import HPDIcon from '../../assets/HPD.svg';
import PATHIcon from '../../assets/DHSPATH.svg';
import TooltipUI from '../../components/TooltipUI/TooltipUI';
import BackButton from '../../components/BackButton/BackButton';
import { useAsync } from 'react-use';
import { useApi } from '../../utils/use-api';
import { CaseCriterion, CaseFile, GetCaseResponse } from '@myfile/api-client';
// import { CaseCriterion } from '@myfile/api-client';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { renderDeadline } from '../../utils/deadlineCalculatiom';

function ApplicationChecklist() {
  const location = useLocation();
  const urlApplicationId = location.pathname.split('/')[3];
  const urlApplicationOrganization = location.pathname.split('/')[2];

  const { t } = useTranslation('applications');

  const api = useApi();
  const { value } = useAsync(() => api.getCase({ caseId: urlApplicationId, workflowType: urlApplicationOrganization }));

  const foundApplication = value
    ? ({
        ...value,
        status: value.Status
      } as typeof value)
    : ({} as Exclude<typeof value, undefined>);

  const workflowCriterionGroup = foundApplication?.CaseCriteria?.sort(
    (a, b) => parseInt(a.Index ?? '0', 10) - parseInt(b.Index ?? '0', 10)
  )?.reduce(
    (acc, item) => {
      // console.log('current', current);
      // console.log('prev', prev);
      const stageGroup = `${item.CriterionGroupName}`;
      const stageFullfillmentType = `${item.CriterionFulfillmentType}`;
      if (!acc[stageGroup]) {
        acc[stageGroup] = {};
      }

      // Initialize the structure for the requireOption if it doesn't exist
      if (acc[stageGroup][stageFullfillmentType]) {
        acc[stageGroup][stageFullfillmentType].push(item);
      } else {
        acc[stageGroup][stageFullfillmentType] = [item];
      }

      // Add the item to the appropriate group

      return {
        ...acc
      };
    },
    {} as Record<string, Record<string, Array<CaseCriterion>>>
  );

  const HPDWorkflowCriterionGroupROI = foundApplication?.CaseCriteria?.sort(
    (a, b) => parseInt(a.Index ?? '0', 10) - parseInt(b.Index ?? '0', 10)
  )
    ?.filter((item) => item.WorkflowStageCriterion?.WorkflowStage?.StageName === 'ROI & Vital Document Checklist')
    .reduce(
      (acc, item) => {
        // console.log('current', current);
        // console.log('prev', prev);
        const stageGroup = `${item.CriterionGroupName}`;
        const stageFullfillmentType = `${item.CriterionFulfillmentType}`;
        if (!acc[stageGroup]) {
          acc[stageGroup] = {};
        }

        // Initialize the structure for the requireOption if it doesn't exist
        if (acc[stageGroup][stageFullfillmentType]) {
          acc[stageGroup][stageFullfillmentType].push(item);
        } else {
          acc[stageGroup][stageFullfillmentType] = [item];
        }

        // Add the item to the appropriate group

        return {
          ...acc
        };
      },
      {} as Record<string, Record<string, Array<CaseCriterion>>>
    );

  const HPDWorkflowCriterionGroupFinancial = foundApplication?.CaseCriteria?.sort(
    (a, b) => parseInt(a.Index ?? '0', 10) - parseInt(b.Index ?? '0', 10)
  )
    ?.filter((item) => item.WorkflowStageCriterion?.WorkflowStage?.StageName === 'Eligibility Appointment Checklist')
    .reduce(
      (acc, item) => {
        // console.log('current', current);
        // console.log('prev', prev);
        const stageGroup = `${item.CriterionGroupName}`;
        const stageFullfillmentType = `${item.CriterionFulfillmentType}`;
        if (!acc[stageGroup]) {
          acc[stageGroup] = {};
        }

        // Initialize the structure for the requireOption if it doesn't exist
        if (acc[stageGroup][stageFullfillmentType]) {
          acc[stageGroup][stageFullfillmentType].push(item);
        } else {
          acc[stageGroup][stageFullfillmentType] = [item];
        }

        // Add the item to the appropriate group

        return {
          ...acc
        };
      },
      {} as Record<string, Record<string, Array<CaseCriterion>>>
    );

  const isAllChecklistItemApprovedFromROI = useMemo(() => {
    return foundApplication?.CaseCriteria?.filter(
      (item) => item.WorkflowStageCriterion?.WorkflowStage?.StageName === 'ROI & Vital Document Checklist'
    ).some((item) => item.CriterionFulfillmentStatus === 'PENDING');
  }, [foundApplication]);

  const gereratedFiles = Object.values(
    foundApplication?.CaseFiles?.reduce(
      (prev, current) => {
        const key = current.GeneratedFile?.id ?? '';
        if (prev[key]) {
          prev[key].push(current);
        } else {
          prev[key] = [current];
        }
        return {
          ...prev
        };
      },
      {} as Record<string, CaseFile[]>
    ) ?? {}
  );

  const { value: items } = useAsync(() => {
    return api.getUserActivity({
      activityTypes: 'AGENT_APPROVE_DOCUMENT_CHECKLIST',
      pageSize: 10
    });
  }, []);

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
    <div>
      <Header />
      <Box className="!w-full !flex !justify-center">
        <Box className="!w-full sm:!w-[546px] lg:!w-[570px] mt-[70px] px-[16px] md:px-0 pb-[52px]">
          {/*Return button to dashaboard */}
          <Box className="mt-[8px] mb-[16px]">
            <BackButton text={t('return')} navigatePath="/client-dashboard?tab=applications" />
          </Box>
          {/* <Box className="!mb-[24px] !bg-importantBackground !min-h-[40px] !flex !flex-row justify-center !py-[20px]">
            <Alert
              variant="filled"
              severity="warning"
              className="!bg-importantBackground !d-text-body-sm-bold !text-black"
            >
              {t('startUploadingDOcs')}
            </Alert>
          </Box> */}
          {/*HPD icon */}
          <Box className="flex justify-center py-[18px] mb-[16px]">
            {urlApplicationOrganization === 'PATH' && (
              <img src={PATHIcon} className="!w-[192px] !h-[48px] lg:!w-[240px] lg:!h-[92px]"></img>
            )}
            {urlApplicationOrganization === 'HPD' && (
              <img src={HPDIcon} className="!w-[192px] !h-[48px] lg:!w-[240px] lg:!h-[92px]"></img>
            )}
          </Box>
          {/*Paragraph with application status */}
          <Box className="!w-full mb-[16px]">
            <Box className={`flex flex-row !items-center !mb-[8px]`}>
              <Typography className="!mr-[8px] text-nowrap !m-text-body-sm md:!d-text-body-sm ">
                {t('documentCollectionStatus')}
              </Typography>
              <Icon id="agent-application-status">info_outlined_icon</Icon>
              <TooltipUI
                anchorSelect="#agent-application-status"
                place="top"
                content={t('applicationStatusTooltip')}
                onHover={true}
                booletpoint={false}
              />
            </Box>

            {foundApplication.Status === 'OPEN' && (
              <Box className="flex flex-row items-center">
                <Icon className="!mr-[2px] !px-0 !text-applicationClose !scale-50">circle_icon</Icon>
                <Typography className="!text-applicationClose md:!d-text-body-sm-bold !m-text-body-sm-bold ">
                  {t('applicationPending')}
                </Typography>
              </Box>
            )}

            {foundApplication.Status === 'CLOSED' && (
              <Box className="flex flex-row items-center">
                <Icon className="!mr-1 !px-0 !text-applicationActive !scale-50">circle_icon</Icon>
                <Typography className="!text-applicationActive md:!d-text-body-sm-bold !m-text-body-sm-bold  ">
                  {t('applicationClosed')}
                </Typography>
              </Box>
            )}
          </Box>

          {urlApplicationOrganization === 'HPD' &&
            foundApplication?.CaseAttributes &&
            foundApplication.CaseAttributes.length > 0 && (
              <Box className="mb-[16px] ">
                <Typography className="mr-[8px] !m-text-body-sm md:!d-text-body-sm !mb-[8px]">
                  {t('buildingUnitChecklist')}
                </Typography>
                <Typography className="md:!d-text-body-sm-bold !m-text-body-sm-bold">
                  {findBuildingUnit(foundApplication)}
                </Typography>
              </Box>
            )}

          <Divider className="!mb-[16px] !border-[1px] !border-lightGreyBorder" />

          <Typography className="!m-text-body-md-bold md:!d-text-body-md-bold !mb-[8px]">
            {urlApplicationOrganization === 'PATH' && t('PATHdocumentation')}
            {!isAllChecklistItemApprovedFromROI &&
              urlApplicationOrganization === 'HPD' &&
              t('financialDocumentsChecklist')}
          </Typography>
          <Typography className="!mb-[16px] !m-text-body-sm md:!d-text-body-sm">
            {!isAllChecklistItemApprovedFromROI &&
              urlApplicationOrganization === 'HPD' &&
              t('financialDocumentsChecklistDescription')}
          </Typography>
          {!isAllChecklistItemApprovedFromROI && urlApplicationOrganization === 'HPD' && (
            <Typography className="!mb-[16px] !m-text-body-sm md:!d-text-body-sm">
              {foundApplication.Status === 'OPEN' && items && foundApplication.CaseType !== 'PATH'
                ? t('deadlineClient', {
                    deadline: renderDeadline(
                      1,
                      foundApplication?.CreatedAt,
                      // @ts-expect-error LastModifiedAt property not presetn on GetUserActivityResponse type
                      items[0]?.LastModifiedAt,
                      items,
                      // @ts-expect-error LastModifiedAt property not presetn on GetUserActivityResponse type
                      items[0]?.LastModifiedAt ? true : false
                    )
                  })
                : ''}
            </Typography>
          )}

          {urlApplicationOrganization === 'PATH' && (
            <Box className="mb-[16px]">
              <Typography className="!m-text-body-sm md:!d-text-body-sm">
                {t('beginSharingDocumentsOnChecklist')}
              </Typography>
            </Box>
          )}

          <Box>
            {urlApplicationOrganization === 'PATH' &&
              Object.keys(workflowCriterionGroup ?? {}).map((criterionGroup) => {
                return (
                  <Box>
                    <ApplicationChecklistAccordion
                      key={criterionGroup}
                      caseFiles={gereratedFiles}
                      groupTitle={criterionGroup}
                      applicationType={foundApplication.CaseType!}
                      caseCriteria={workflowCriterionGroup?.[criterionGroup] ?? {}}
                    />
                  </Box>
                );
              })}
            {!isAllChecklistItemApprovedFromROI &&
              urlApplicationOrganization === 'HPD' &&
              Object.keys(HPDWorkflowCriterionGroupFinancial ?? {}).map((criterionGroup) => {
                return (
                  <Box className="!mb-[24px]">
                    <Box className="!mb-[24px]">
                      <ApplicationChecklistAccordion
                        key={criterionGroup}
                        caseFiles={gereratedFiles}
                        groupTitle={criterionGroup}
                        applicationType={foundApplication.CaseType!}
                        caseCriteria={HPDWorkflowCriterionGroupFinancial?.[criterionGroup] ?? {}}
                      />
                    </Box>
                  </Box>
                );
              })}
            {urlApplicationOrganization === 'HPD' && !isAllChecklistItemApprovedFromROI && (
              <Divider className="!mb-[16px] !border-[1px] !border-lightGreyBorder" />
            )}
          </Box>
          {urlApplicationOrganization === 'HPD' && (
            <Box className="">
              <Typography className="!m-text-body-md-bold sm:!d-text-body-md-bold !mb-[12px]">
                {t('vitalDocumentsChecklist')}
                <Typography className="!mb-[16px] !m-text-body-sm md:!d-text-body-sm">
                  {t('vitalDocumentsDescription')}
                </Typography>
                {/* <Typography className="!d-text-italic !text-primary">
                  {foundApplication.Status === 'OPEN' && foundApplication.CaseType !== 'PATH'
                    ? t('deadlineClient', {
                        deadline: renderDeadline(
                          0,
                          foundApplication?.CreatedAt,
                          // @ts-expect-error LastModifiedAt property not presetn on GetUserActivityResponse type
                          items[0]?.LastModifiedAt,
                          items,
                          true
                        )
                      })
                    : ''}
                </Typography> */}
              </Typography>
              <Typography className="!mb-[16px] !m-text-body-sm md:!d-text-body-sm">
                {foundApplication.Status === 'OPEN' && items && foundApplication.CaseType !== 'PATH'
                  ? t('deadlineClient', {
                      deadline: renderDeadline(
                        0,
                        foundApplication?.CreatedAt,
                        // @ts-expect-error LastModifiedAt property not presetn on GetUserActivityResponse type
                        items[0]?.LastModifiedAt,
                        items,
                        false
                      )
                    })
                  : ''}
              </Typography>
            </Box>
          )}
          <Box>
            {urlApplicationOrganization === 'HPD' &&
              Object.keys(HPDWorkflowCriterionGroupROI ?? {}).map((criterionGroup) => {
                return (
                  <Box className="!mb-[18px]">
                    <ApplicationChecklistAccordion
                      key={criterionGroup}
                      caseFiles={gereratedFiles}
                      groupTitle={criterionGroup}
                      applicationType={foundApplication.CaseType!}
                      caseCriteria={HPDWorkflowCriterionGroupROI?.[criterionGroup] ?? {}}
                    />
                  </Box>
                );
              })}
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default ApplicationChecklist;
