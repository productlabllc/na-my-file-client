import dayjs from 'dayjs';
import { Box, Typography, Icon } from '@mui/material';
import ActivityLogItemBox from '../../layouts/ActivityLogItemBox/ActivityLogItemBox';
import {
  // CaseApplicant,
  CaseCriterion,
  CaseFile,
  // CaseNote,
  Constants,
  FamilyMember,
  UserBase,
  ActivityLogs
} from '@namyfile/api-client';
import { Case } from '@namyfile/api-client';
import { useTranslation, Trans } from 'react-i18next';
import { ReactNode } from 'react-markdown/lib/ast-to-react';
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';

export const actionTypes: Array<{ name: string; value: ActivityLogs }> = [
  {
    name: 'activityLogSelectActionUploadedDocument',
    value: [
      'CLIENT_UPLOAD_DOCUMENT_SELF',
      'CLIENT_UPLOAD_DOCUMENT_FAMILY_MEMBER',
      'CLIENT_ADD_CASE_FILES_SELF',
      'AGENT_ADD_CASE_FILE_CLIENT',
      'CLIENT_ADD_CASE_FILES_FAMILY_MEMBER',
      'AGENT_ADD_CASE_FILES_FAMILY_MEMBER'
    ]
  },
  {
    name: 'activityLogSelectActionDeletedDocument',
    value: [
      'CLIENT_DELETE_DOCUMENT_SELF',
      'CLIENT_DELETE_DOCUMENT_FAMILY_MEMBER',
      'CLIENT_REMOVE_CASE_FILES_SELF',
      'CLIENT_REMOVE_CASE_FILES_FAMILY_MEMBER'
    ]
  },
  {
    name: 'activityLogSelectActionDownloadedDocument',
    value: [
      'CLIENT_DOWNLOAD_DOCUMENT_SELF',
      'CLIENT_DOWNLOAD_DOCUMENT_FAMILY_MEMBER',
      'AGENT_DOWNLOAD_CASE_FILE_CLIENT',
      'AGENT_DOWNLOAD_CASE_FILE_FAMILY_MEMBER',
      'AGENT_DOWNLOAD_ALL_CASE_FILES'
    ]
  },
  {
    name: 'activityLogSelectActionUpdatedDocument',
    value: [
      'CLIENT_UPDATE_DOCUMENT_SELF',
      'CLIENT_UPDATE_DOCUMENT_FAMILY_MEMBER',
      'CLIENT_UPDATE_CASE_FILE_SELF',
      'CLIENT_UPDATE_CASE_FILE_FAMILY_MEMBER'
    ]
  },
  {
    name: 'activityLogSelectActionOpenCloseApplication',
    value: ['AGENT_CLOSE_CASE', 'AGENT_ACTIVATE_CASE', 'CLIENT_CREATE_CASE']
  },
  {
    name: 'activityLogSelectActionResubmitDocument',
    value: ['CLIENT_RESUBMIT_CASE_FILES_FAMILY_MEMBER', 'CLIENT_RESUBMIT_CASE_FILES_SELF']
  },
  // { name: 'Approved checklist', value: ['AGENT_APPROVE_DOCUMENT_CHECKLIST'] },
  // { name: 'Closed application checklists', value: 'CLOSED_APPLICATION' },
  {
    name: 'activityLogSelectActionDocumentStatusApproved',
    value: [
      'AGENT_APPROVE_CASE_FILE_CLIENT',
      'AGENT_APPROVE_CASE_FILE_FAMILY_MEMBER',
      'AGENT_APPROVE_DOCUMENT_CHECKLIST'
    ]
  },
  {
    name: 'activityLogSelectActionDocumentStatusResubmit',
    value: ['AGENT_REJECT_CASE_FILE_CLIENT', 'AGENT_REJECT_CASE_FILE_FAMILY_MEMBER']
  },
  {
    name: 'activityLogSelectActionDocumentStatusUnderReview',
    value: [
      // 'AGENT_PREVIEW_CASE_FILE',
      'AGENT_UNDER_REVIEW_CASE_FILE_CLIENT',
      'AGENT_UNDER_REVIEW_CASE_FILE_FAMILY_MEMBER'
    ]
  },
  {
    name: 'activityLogSelectActionDocumentStatusPending',
    value: ['AGENT_PENDING_CASE_FILE_CLIENT', 'AGENT_PENDING_CASE_FILE_FAMILY_MEMBER']
  }

  // { name: 'Document status (re-uploaded)', value: 'STATUS_APPLICATION' }
];

// export const daysRange = ['Any', 'Today', 'Yesterday', 'Past week', 'Past month', 'Past year'];
export const daysRange: Array<{ name: string; value: string }> = [
  { name: 'activityLogDateDropDownAny', value: 'Any' },
  { name: 'activityLogDateDropDownToday', value: 'Today' },
  { name: 'activityLogDateDropDownYesterday', value: 'Yesterday' },
  { name: 'activityLogDateDropDownWeek', value: 'Past week' },
  { name: 'activityLogDateDropDownMonth', value: 'Past month' },
  { name: 'activityLogDateDropDownYear', value: 'Past year' }
];

const iconToActionMap = {
  view: (
    <Box className="basis-1/5 flex justify-center items-center">
      <Icon className="!text-secondary">remove_red_eye_outlined</Icon>
    </Box>
  ),
  creation: (
    <Box className="basis-1/5 flex justify-center items-center">
      <Icon className="!text-secondary">post_add_outlined</Icon>
    </Box>
  ),
  redo: (
    <Box className="basis-1/5 flex justify-center items-center">
      <Icon className="!text-secondary">redo_outlined</Icon>
    </Box>
  ),
  approve: (
    <Box className="basis-1/5 flex justify-center items-center">
      <Icon className="!text-secondary">assignment_turned_in_outlined</Icon>
    </Box>
  ),
  approveChecklist: (
    <Box className="basis-1/5 flex justify-center items-center">
      <Icon className="!text-secondary">checklist_icon</Icon>
    </Box>
  ),
  reject: (
    <Box className="basis-1/5 flex justify-center items-center">
      <Icon className="!text-secondary">do_disturb_alt_outlined</Icon>
    </Box>
  ),
  createUser: (
    <Box className="basis-1/5 flex justify-center items-center">
      <Icon className="!text-secondary">person_add_outline</Icon>
    </Box>
  ),
  upload: (
    <Box className="w-1/5 flex justify-center items-center">
      <Icon className="!text-secondary">upload_file_icon</Icon>
    </Box>
  ),
  download: (
    <Box className="w-1/5  flex justify-center items-center">
      <Icon className="!text-secondary">download_icon</Icon>
    </Box>
  ),
  edit: (
    <Box className="w-1/5 flex justify-center items-center">
      <Icon className="!text-secondary">edit_outlined_icon</Icon>
    </Box>
  ),
  delete: (
    <Box className="w-1/5 flex justify-center items-center">
      <Icon className="!text-secondary">delete_outlined_icon</Icon>
    </Box>
  ),
  deleteUsers: (
    <Box className="w-1/5 flex justify-center items-center">
      <Icon className="!text-secondary">group_remove_outlined</Icon>
    </Box>
  ),
  closedCase: (
    <Box className="w-1/5 flex justify-center items-center">
      <Icon className="!text-secondary">folder_off_outlined_icon</Icon>
    </Box>
  ),
  pending: (
    <Box className="w-1/5 flex justify-center items-center">
      <PendingActionsOutlinedIcon className="!text-secondary" />
    </Box>
  ),
  reopen: (
    <Box className="w-1/5 flex justify-center items-center">
      <FolderOpenOutlinedIcon className="!text-secondary"></FolderOpenOutlinedIcon>
    </Box>
  )
};

export const ActivityLogItem = ({
  activityAction,
  user,
  dateAndTime,
  ActivityValue,
  userData,
  clientData
}: {
  activityAction?: Constants['ActivityLogs'][0];
  user?: string;
  dateAndTime?: string | Date;
  ActivityValue?: string;
  userData?: UserBase;
  clientData?: UserBase;
}) => {
  const { t } = useTranslation('activityLogs');
  const activityData = JSON.parse(ActivityValue ?? '{}');

  const getCriterionName = (caseCriterion: CaseCriterion) => {
    let subGroupName = caseCriterion.CriterionSubGroupName;
    subGroupName = subGroupName ? ` - ${subGroupName}` : '';
    return `${caseCriterion.WorkflowStageCriterion?.CriterionGroupName}${subGroupName}`;
  };

  const getCaseCriterionNameFromList = (caseFile: CaseFile[]) => {
    if (caseFile && caseFile.length > 0) {
      const foundCaseFile = caseFile.find((caseFile) => caseFile.CaseCriterion?.Name);
      console.log('caseCriterionName', foundCaseFile?.CaseCriterion?.Name);
      return foundCaseFile?.CaseCriterion?.Name;
    }
  };

  // const getCriterionTitle = (caseCriterion: CaseCriterion) => {
  //   return caseCriterion.Name;
  // };

  const documentNewValue = () => {
    console.log('newVal', activityData.newValue);
    return activityData.newValue?.FileType.replace(/[^a-zA-Z]/g, ' ');
  };

  const documentOldValue = () => {
    console.log('oldVal', activityData.oldValue);
    return activityData.oldValue?.FileType.replace(/[^a-zA-Z]/g, ' ');
  };

  const documentValue = () => {
    console.log('value', activityData.value);
    return activityData.value.FileType.replace(/[^a-zA-Z]/g, ' ');
  };

  // const listFamilyMembers = (familyMembers?: FamilyMember[]) => {
  //   return familyMembers?.map((fm) => {
  //     if (fm && fm.FirstName) {
  //       return `${fm.FirstName}`;
  //     } else {
  //       return 'NOT FOUND FAMILY MEMBERS NAME';
  //     }
  //   });
  //   // .join(', ')
  //   // .replace(/,([^,]*)$/, ` ${t('and')}$1`);
  // };
  const listFamilyMembers = (familyMembers?: FamilyMember[]) => {
    let result;
    const getFamilyMembers = familyMembers?.map?.((fm) => {
      if (fm && fm.FirstName) {
        return `${fm.FirstName}`;
      }
    });

    const removeDuplicates = getFamilyMembers?.filter?.((item, index) => getFamilyMembers.indexOf(item) === index);

    if (removeDuplicates && removeDuplicates?.length > 1) {
      result = removeDuplicates?.join(', ');
    } else {
      result = removeDuplicates?.join();
    }
    return result;
  };
  const agentUser = (user?: UserBase) => {
    return user?.Email;
  };

  const clientUser = () => {
    return `${clientData?.FirstName}`;
  };

  // const clientUser = (user?: UserBase) => {
  //   return `${user?.FirstName} ${user?.LastName}`;
  // };

  const caseClient = (caseParam?: Case) => {
    const client = caseParam?.CaseTeamAssignments?.find((cta) => cta.CaseRole === 'CLIENT');
    return client?.User?.FirstName;
  };

  // const listCaseFiles = (caseFiles?: CaseFile[]) => {
  //   return `${caseFiles
  //     ?.map((cf) => {
  //       if (cf.GeneratedFile?.FileType) {
  //         return `${cf.GeneratedFile?.FileType}`;
  //       } else {
  //         return 'Wrong data';
  //       }
  //       // const familyMember = cf.GeneratedFile?.UserFamilyMember;
  //       // const familyMemberString = familyMember
  //       //   ? `${t('for')} ${familyMember.FirstName} ${familyMember.LastName}(${familyMember.Relationship})`
  //       //   : t('forThemselves');
  //     })
  //     .join(
  //       ', '
  //     )
  //   // ?.replace(/,([^,]*)$/, ` ${t('and')}$1`)}`;
  //   }`;
  // };

  const listCaseFiles = (caseFiles?: CaseFile[]) => {
    const counts: Record<string, number> = {};
    caseFiles?.forEach?.((cf) => {
      const fileType = cf.GeneratedFile?.FileType?.replace(/[^a-zA-Z]/g, ' ');
      // const familyMember = cf.GeneratedFile?.UserFamilyMember;
      // const familyMemberString = familyMember
      //   ? `${t('for')} ${familyMember.FirstName} ${familyMember.LastName}(${familyMember.Relationship})`
      //   : t('forThemselves');
      if (fileType) {
        counts[fileType] = (counts[fileType] || 0) + 1;
      }
    });
    let result = '';

    for (const item in counts) {
      if (counts[item] > 1) {
        result += `${item} (${counts[item]}), `;
      } else {
        result += `${item}, `;
      }
    }
    // result = result.replace(/,([^,&#39']*[0-9])$/, ``);
    result = result.slice(0, -2);
    return result;
  };

  const generatedFileFamilyMember = (familyMember?: FamilyMember) => {
    return `${familyMember?.FirstName}`;
  };

  const criterionFulfillment = (caseFiles?: CaseFile[]) => {
    const caseCriterion = caseFiles?.[0]?.CaseCriterion;

    return `${caseCriterion?.Name}`;
  };

  // const getCaseNoteText = (caseNote: CaseNote) => {
  //   return caseNote.NoteText;
  // };

  // const getAuthorAgentUser = (caseNote: CaseNote) => {
  //   return caseNote.AuthorUser?.Email;
  // };

  const dateTimeComp = (
    <Typography>
      <span className="!m-text-body-md-bold lg:!d-text-body-md-bold mr-[12px] ">{`${dayjs(dateAndTime).format(
        'MM/DD/YYYY'
      )}`}</span>
      <span className="!m-text-body-md lg:!d-text-body-md italic">{`${dayjs(dateAndTime).format('hh:mmA')}`}</span>
    </Typography>
  );

  const logMessage = (message: ReactNode | string, extra?: string) => {
    return (
      <Typography className="flex flex-wrap">
        <Typography className="!m-text-body-md lg:!d-text-body-md !mb-[4px] !mr-[4px]">{message}</Typography>
        {extra ? (
          <span className="!m-text-body-md-link lg:!d-text-body-md-link decoration-2 text-secondary underline underline-offset-4 !mb-[6px]">
            {extra}
          </span>
        ) : null}
      </Typography>
    );
  };

  const highlightDocumentText = (
    <span className="!text-secondary underline underline-offset-2 !font-bold decoration-2"></span>
  );

  console.log('GLOBAL ACtivity Action', activityAction);

  switch (activityAction) {
    // case 'CLIENT_CREATE_FAMILY_MEMBER': {
    //   return (
    //     <ActivityLogItemBox>
    //       {iconToActionMap.createUser}
    //       <Box className="">
    //         {logMessage(
    //           t('CLIENT_CREATE_FAMILY_MEMBER', {
    //             userName: user,
    //             familyMember: listFamilyMembers([activityData.newValue])
    //           })
    //         )}
    //         {dateTimeComp}
    //       </Box>
    //     </ActivityLogItemBox>
    //   );
    // }

    // keep it
    case 'CLIENT_UPLOAD_DOCUMENT_SELF': {
      console.log('activityAction', activityAction);
      console.log('activityData', activityData);
      return (
        <ActivityLogItemBox>
          {iconToActionMap.upload}
          <Box className="w-4/5 sm:px-[8px]">
            {/* {logMessage(
              t('CLIENT_UPLOAD_DOCUMENT_SELF', {
                userName: user,
                document: documentNewValue()
              })
            )} */}
            {logMessage(
              <Trans
                ns="activityLogs"
                i18nKey={'CLIENT_UPLOAD_DOCUMENT_SELF'}
                values={{ userName: user, document: documentNewValue() }}
                components={{
                  span: highlightDocumentText
                }}
              />
            )}
            {dateTimeComp}
          </Box>
        </ActivityLogItemBox>
      );
    }

    // keep it
    case 'CLIENT_UPLOAD_DOCUMENT_FAMILY_MEMBER': {
      console.log('activityAction', activityAction);
      console.log('activityData', activityData);
      return (
        <ActivityLogItemBox>
          {iconToActionMap.upload}
          <Box className="w-4/5 sm:px-[8px]">
            {/* {logMessage(
              t('CLIENT_UPLOAD_DOCUMENT_FAMILY_MEMBER', {
                userName: user,
                familyMember: listFamilyMembers([activityData.familyMember]),
                document: documentNewValue()
              })
            )} */}
            {logMessage(
              <Trans
                ns="activityLogs"
                i18nKey={'CLIENT_UPLOAD_DOCUMENT_FAMILY_MEMBER'}
                values={{
                  userName: user,
                  familyMember: listFamilyMembers([activityData.familyMember]),
                  document: documentNewValue()
                }}
                components={{
                  span: highlightDocumentText
                }}
              />
            )}
            {dateTimeComp}
          </Box>
        </ActivityLogItemBox>
      );
    }

    // keep it
    case 'CLIENT_DOWNLOAD_DOCUMENT_SELF': {
      console.log('activityAction', activityAction);
      console.log('activityData', activityData);
      documentValue();
      console.log('CLIENT_DOWNLOAD_DOCUMENT_SELF', documentNewValue(), documentOldValue());
      return (
        <ActivityLogItemBox>
          {iconToActionMap.download}
          <Box className="w-4/5 sm:px-[8px]">
            {logMessage(
              <Trans
                ns="activityLogs"
                i18nKey={'CLIENT_DOWNLOAD_DOCUMENT_SELF'}
                values={{ userName: user, document: documentValue() }}
                components={{
                  span: highlightDocumentText
                }}
              />
            )}
            {dateTimeComp}
          </Box>
        </ActivityLogItemBox>
      );
    }

    // keep it
    case 'CLIENT_DOWNLOAD_DOCUMENT_FAMILY_MEMBER': {
      console.log('activityAction', activityAction);
      console.log('activityData', activityData);
      documentValue();
      console.log('CLIENT_DOWNLOAD_DOCUMENT_FAMILY_MEMBER', documentNewValue(), documentOldValue());
      return (
        <ActivityLogItemBox>
          {iconToActionMap.download}
          <Box className="w-4/5 sm:px-[8px]">
            {/* {logMessage(
              t('CLIENT_DOWNLOAD_DOCUMENT_FAMILY_MEMBER', {
                userName: user,
                familyMember: listFamilyMembers([activityData.familyMember]),
                document: documentValue()
              })
            )} */}
            {logMessage(
              <Trans
                ns="activityLogs"
                i18nKey={'CLIENT_DOWNLOAD_DOCUMENT_FAMILY_MEMBER'}
                values={{
                  userName: user,
                  familyMember: listFamilyMembers([activityData.familyMember]),
                  document: documentValue()
                }}
                components={{
                  span: highlightDocumentText
                }}
              />
            )}
            {dateTimeComp}
          </Box>
        </ActivityLogItemBox>
      );
    }

    // keep it
    case 'CLIENT_UPDATE_DOCUMENT_SELF': {
      console.log('activityAction', activityAction);
      console.log('activityData', activityData);

      return (
        <ActivityLogItemBox>
          {iconToActionMap.edit}
          <Box className="w-4/5 sm:px-[8px]">
            {logMessage(
              <Trans
                ns="activityLogs"
                i18nKey={'CLIENT_UPDATE_DOCUMENT_SELF'}
                values={{ userName: user, document: documentNewValue() }}
                components={{
                  span: highlightDocumentText
                }}
              />
            )}
            {dateTimeComp}
          </Box>
        </ActivityLogItemBox>
      );
    }

    // keep it
    case 'CLIENT_UPDATE_DOCUMENT_FAMILY_MEMBER': {
      console.log('activityAction', activityAction);
      console.log('activityData', activityData);
      return (
        <ActivityLogItemBox>
          {iconToActionMap.edit}
          <Box className="w-4/5 sm:px-[8px]">
            {/* {logMessage(
              t('CLIENT_UPDATE_DOCUMENT_FAMILY_MEMBER', {
                userName: user,
                familyMember: listFamilyMembers([activityData.familyMember]),
                document: documentNewValue()
              })
            )} */}
            {logMessage(
              <Trans
                ns="activityLogs"
                i18nKey={'CLIENT_UPDATE_DOCUMENT_FAMILY_MEMBER'}
                values={{
                  userName: user,
                  familyMember: listFamilyMembers([activityData.familyMember]),
                  document: documentNewValue()
                }}
                components={{
                  span: highlightDocumentText
                }}
              />
            )}
            {dateTimeComp}
          </Box>
        </ActivityLogItemBox>
      );
    }

    // keep it
    case 'CLIENT_DELETE_DOCUMENT_SELF': {
      console.log('activityAction', activityAction);
      console.log('activityData', activityData);
      return (
        <ActivityLogItemBox>
          {iconToActionMap.delete}
          <Box className="w-4/5 sm:px-[8px]">
            {/* {logMessage(
              t('CLIENT_DELETE_DOCUMENT_SELF', {
                userName: user,
                document: documentOldValue()
              })
            )} */}
            {logMessage(
              <Trans
                ns="activityLogs"
                i18nKey={'CLIENT_DELETE_DOCUMENT_SELF'}
                values={{ userName: user, document: documentOldValue() }}
                components={{
                  span: highlightDocumentText
                }}
              />
            )}
            {dateTimeComp}
          </Box>
        </ActivityLogItemBox>
      );
    }

    // keep ot
    case 'CLIENT_DELETE_DOCUMENT_FAMILY_MEMBER': {
      console.log('activityAction', activityAction);
      console.log('activityData', activityData);
      return (
        <ActivityLogItemBox>
          {iconToActionMap.delete}
          <Box className="w-4/5 sm:px-[8px]">
            {/* {logMessage(
              t('CLIENT_DELETE_DOCUMENT_FAMILY_MEMBER', {
                userName: user,
                familyMember: listFamilyMembers([activityData.familyMember]),
                document: documentOldValue()
              })
            )} */}
            {logMessage(
              <Trans
                ns="activityLogs"
                i18nKey={'CLIENT_DELETE_DOCUMENT_FAMILY_MEMBER'}
                values={{
                  userName: user,
                  familyMember: listFamilyMembers([activityData.familyMember]),
                  document: documentOldValue()
                }}
                components={{
                  span: highlightDocumentText
                }}
              />
            )}
            {dateTimeComp}
          </Box>
        </ActivityLogItemBox>
      );
    }

    // keep it
    case 'CLIENT_CREATE_CASE': {
      console.log('activityAction', activityAction);
      console.log('activityData', activityData);
      return (
        <ActivityLogItemBox>
          {iconToActionMap.creation}
          <Box className="w-4/5 sm:px-[8px]">
            {/* {logMessage(
              t('CLIENT_CREATE_CASE', { userName: user, caseType: activityData.case?.CaseType }),
              activityData.case?.Title
            )} */}
            <Trans
              ns="activityLogs"
              i18nKey={'CLIENT_CREATE_CASE'}
              values={{
                userName: user,
                caseType: activityData.case?.CaseType
              }}
              components={{
                span: highlightDocumentText
              }}
            />
            {dateTimeComp}
          </Box>
        </ActivityLogItemBox>
      );
    }
    // case 'CLIENT_DELETE_CASE': {
    //   return (
    //     <ActivityLogItemBox>
    //       {iconToActionMap.delete}
    //       {logMessage(
    //         t('CLIENT_DELETE_CASE', { userName: user, caseType: activityData.case?.CaseType }),
    //         activityData.case?.Title
    //       )}
    //       <Box className="w-4/5 sm:px-[8px]">{dateTimeComp}</Box>
    //     </ActivityLogItemBox>
    //   );
    // }

    // case 'CLIENT_ADD_CASE_FAMILY_MEMBERS': {
    //   return (
    //     <ActivityLogItemBox>
    //       {iconToActionMap.createUser}
    //       {logMessage(
    //         t('CLIENT_ADD_CASE_FAMILY_MEMBERS', {
    //           userName: user,
    //           caseType: activityData.case?.CaseType,
    //           familyMembers: listFamilyMembers(activityData.newValue)
    //         }),
    //         activityData.case?.Title
    //       )}
    //       <Box className="w-4/5 sm:px-[8px]">{dateTimeComp}</Box>
    //     </ActivityLogItemBox>
    //   );
    // }

    // keep it
    case 'CLIENT_ADD_CASE_FILES_SELF': {
      console.log('activityAction', activityAction);
      console.log('activityData', activityData);
      return (
        <ActivityLogItemBox>
          {iconToActionMap.creation}
          {/* {logMessage(
            t('CLIENT_ADD_CASE_FILES_SELF', {
              userName: user,
              caseType: activityData.case?.CaseType,
              // fulfill: criterionFulfillment(activityData.newValue),
              caseFiles: listCaseFiles(activityData.newValue)
            }),
            activityData.case?.Title
          )} */}
          <Box className="w-4/5 sm:px-[8px]">
            {logMessage(
              <Trans
                ns="activityLogs"
                i18nKey={'CLIENT_ADD_CASE_FILES_SELF'}
                values={{
                  // userName: agentUser(userData),
                  // familyMember: listFamilyMembers([activityData.familyMember]),
                  // // fulfill: activityData.,
                  // caseFiles: activityData.value.FileType,
                  // caseType: activityData.case?.CaseType
                  userName: user,
                  // client: clientUser(),
                  fulfill: criterionFulfillment(activityData.newValue),
                  caseFiles: listCaseFiles(activityData.newValue),
                  caseType: activityData.case?.CaseType
                }}
                components={{
                  span: highlightDocumentText
                }}
              />
            )}
            {dateTimeComp}
          </Box>
        </ActivityLogItemBox>
      );
    }

    // keep it
    case 'CLIENT_ADD_CASE_FILES_FAMILY_MEMBER': {
      console.log('activityAction', activityAction);
      console.log('activityData', activityData);
      return (
        <ActivityLogItemBox>
          {iconToActionMap.creation}
          {/* {logMessage(
            t('CLIENT_ADD_CASE_FILES_FAMILY_MEMBER', {
              userName: user,
              caseType: activityData.case?.CaseType,
              fulfill: criterionFulfillment(activityData.newValue),
              caseFiles: listCaseFiles(activityData.newValue)
            }),
            activityData.case?.Title
          )} */}
          <Box className="w-4/5 sm:px-[8px]">
            {' '}
            {logMessage(
              <Trans
                ns="activityLogs"
                i18nKey={'CLIENT_ADD_CASE_FILES_FAMILY_MEMBER'}
                values={{
                  // userName: agentUser(userData),
                  familyMember: listFamilyMembers(activityData.familyMember),
                  // // fulfill: activityData.,
                  // caseFiles: activityData.value.FileType,
                  // caseType: activityData.case?.CaseType
                  userName: user,
                  // client: clientUser(),
                  fulfill: criterionFulfillment(activityData.newValue),
                  caseFiles: listCaseFiles(activityData.newValue),
                  caseType: activityData.case?.CaseType
                }}
                components={{
                  span: highlightDocumentText
                }}
              />
            )}
            {dateTimeComp}
          </Box>
        </ActivityLogItemBox>
      );
    }

    // keep it
    case 'CLIENT_REMOVE_CASE_FILES_SELF': {
      console.log('activityAction', activityAction);
      console.log('activityData', activityData);
      return (
        <ActivityLogItemBox>
          {iconToActionMap.delete}
          {/* {logMessage(
            t('CLIENT_REMOVE_CASE_FILES_SELF', {
              userName: user,
              caseType: activityData.case?.CaseType,
              fulfill: criterionFulfillment(activityData.oldValue),
              caseFiles: listCaseFiles(activityData.oldValue)
            }),
            activityData.case?.Title
          )} */}
          <Box className="w-4/5 sm:px-[8px]">
            {logMessage(
              <Trans
                ns="activityLogs"
                i18nKey={'CLIENT_REMOVE_CASE_FILES_SELF'}
                values={{
                  // userName: agentUser(userData),
                  // familyMember: listFamilyMembers([activityData.familyMember]),
                  // // fulfill: activityData.,
                  // caseFiles: activityData.value.FileType,
                  // caseType: activityData.case?.CaseType
                  userName: user,
                  // client: clientUser(),
                  fulfill: criterionFulfillment(activityData.oldValue),
                  caseFiles: listCaseFiles(activityData.oldValue),
                  caseType: activityData.case?.CaseType
                }}
                components={{
                  span: highlightDocumentText
                }}
              />
            )}
            {dateTimeComp}
          </Box>
        </ActivityLogItemBox>
      );
    }

    case 'CLIENT_REMOVE_CASE_FILES_FAMILY_MEMBER': {
      console.log('activityAction', activityAction);
      console.log('activityData', activityData);
      return (
        <ActivityLogItemBox>
          {iconToActionMap.delete}
          {/* {logMessage(
            t('CLIENT_REMOVE_CASE_FILES_SELF', {
              userName: agentUser(userData),
              client: caseClient(activityData.case),
              caseFiles: listCaseFiles(activityData.oldValue),
              caseType: activityData.case?.CaseType
            }),
            activityData.case?.Title
          )} */}
          <Box className="w-4/5 sm:px-[8px]">
            {logMessage(
              <Trans
                ns="activityLogs"
                i18nKey={'CLIENT_REMOVE_CASE_FILES_FAMILY_MEMBER'}
                values={{
                  familyMember: listFamilyMembers(activityData.familyMember),
                  userName: user,
                  fulfill: criterionFulfillment(activityData.oldValue),
                  caseFiles: listCaseFiles(activityData.oldValue),
                  caseType: activityData.case?.CaseType
                }}
                components={{
                  span: highlightDocumentText
                }}
              />
            )}
            {dateTimeComp}
          </Box>
        </ActivityLogItemBox>
      );
    }

    // case 'CLIENT_DELETE_FAMILY_MEMBERS': {
    //   return (
    //     <ActivityLogItemBox>
    //       {iconToActionMap.deleteUsers}
    //       {logMessage(
    //         t('CLIENT_DELETE_FAMILY_MEMBERS', {
    //           userName: user,
    //           familyMembers: listFamilyMembers(activityData.oldValue)
    //         })
    //       )}
    //       <Box className="w-4/5 sm:px-[8px]">{dateTimeComp}</Box>
    //     </ActivityLogItemBox>
    //   );
    // }

    // case 'AGENT_ADD_NEW_CASE_NOTE': {
    //   return (
    //     <ActivityLogItemBox>
    //       {iconToActionMap.creation}
    //       {logMessage(
    //         t('AGENT_ADD_NEW_CASE_NOTE', {
    //           userName: agentUser(userData),
    //           client: caseClient(activityData.case),
    //           caseType: activityData.case?.CaseType,
    //           noteText: getCaseNoteText(activityData.newValue)
    //         }),
    //         activityData.case?.Title
    //       )}
    //       <Box className="w-4/5 sm:px-[8px]">{dateTimeComp}</Box>
    //     </ActivityLogItemBox>
    //   );
    // }

    // case 'AGENT_REPLY_TO_CASE_NOTE': {
    //   return (
    //     <ActivityLogItemBox>
    //       {iconToActionMap.creation}
    //       {logMessage(
    //         t('AGENT_REPLY_TO_CASE_NOTE', {
    //           userName: agentUser(userData),
    //           client: caseClient(activityData.case),
    //           author: getAuthorAgentUser(activityData.newValue),
    //           caseType: activityData.case?.CaseType,
    //           noteText: getCaseNoteText(activityData.newValue)
    //         }),
    //         activityData.case?.Title
    //       )}
    //       <Box className="w-4/5 sm:px-[8px]">{dateTimeComp}</Box>
    //     </ActivityLogItemBox>
    //   );
    // }

    // case 'AGENT_EDIT_CASE_NOTE': {
    //   return (
    //     <ActivityLogItemBox>
    //       {iconToActionMap.edit}
    //       {logMessage(
    //         t('AGENT_EDIT_CASE_NOTE', {
    //           userName: agentUser(userData),
    //           client: caseClient(activityData.case),
    //           caseType: activityData.case?.CaseType,
    //           noteText: getCaseNoteText(activityData.newValue),
    //           previousNote: getCaseNoteText(activityData.oldValue)
    //         }),
    //         activityData.case?.Title
    //       )}
    //       <Box className="w-4/5 sm:px-[8px]">{dateTimeComp}</Box>
    //     </ActivityLogItemBox>
    //   );
    // }

    // case 'AGENT_REMOVE_CASE_NOTE': {
    //   return (
    //     <ActivityLogItemBox>
    //       {iconToActionMap.delete}
    //       {logMessage(
    //         t('AGENT_REMOVE_CASE_NOTE', {
    //           userName: agentUser(userData),
    //           client: caseClient(activityData.case),
    //           caseType: activityData.case?.CaseType,
    //           noteText: getCaseNoteText(activityData.newValue)
    //         }),
    //         activityData.case?.Title
    //       )}
    //       <Box className="w-4/5 sm:px-[8px]">{dateTimeComp}</Box>
    //     </ActivityLogItemBox>
    //   );
    // }

    // case 'CLIENT_REMOVE_CASE_FAMILY_MEMBERS': {
    //   return (
    //     <ActivityLogItemBox>
    //       {iconToActionMap.delete}
    //       {logMessage(
    //         t('CLIENT_REMOVE_CASE_FAMILY_MEMBERS', {
    //           userName: user,
    //           caseType: activityData.case?.CaseType,
    //           familyMembers: listFamilyMembers(activityData.oldValue)
    //         }),
    //         activityData.case?.Title
    //       )}
    //       <Box className="w-4/5 sm:px-[8px]">{dateTimeComp}</Box>
    //     </ActivityLogItemBox>
    //   );
    // }

    // keep it
    case 'AGENT_APPROVE_CASE_FILE_CLIENT': {
      console.log('activityAction', activityAction);
      console.log('activityData', activityData);
      return (
        <ActivityLogItemBox>
          {iconToActionMap.approve}
          {/* {logMessage(
            // t('AGENT_APPROVE_CASE_FILE_CLIENT', {
            //   userName: agentUser(userData),
            //   client: caseClient(activityData.case),
            //   caseType: activityData.case?.CaseType,
            //   fulfill: criterionFulfillment(activityData.newValue.CriterionGroupName),
            //   caseFiles: listCaseFiles(activityData.oldValue.GeneratedFile.FileType)
            // }),
            activityData.case?.Title
          )} */}
          <Box className="w-4/5 sm:px-[8px]">
            {logMessage(
              <Trans
                ns="activityLogs"
                i18nKey={'AGENT_APPROVE_CASE_FILE_CLIENT'}
                values={{
                  userName: agentUser(userData),
                  client: clientUser(),
                  // familyMember: generatedFileFamilyMember(activityData.newValue.GeneratedFile.UserFamilyMember),
                  caseType: activityData.case?.CaseType,
                  caseFiles: listCaseFiles([activityData.newValue]),
                  fullfill: criterionFulfillment([activityData.newValue])
                }}
                components={{
                  span: highlightDocumentText
                }}
              />
            )}
            {dateTimeComp}
          </Box>
        </ActivityLogItemBox>
      );
    }

    case 'AGENT_APPROVE_CASE_FILE_FAMILY_MEMBER': {
      return (
        <ActivityLogItemBox>
          {iconToActionMap.approve}
          {/* {logMessage(
            t('AGENT_APPROVE_CASE_FILE_FAMILY_MEMBER', {
              userName: agentUser(userData),
              client: caseClient(activityData.case),
              caseType: activityData.case?.CaseType,
              fulfill: criterionFulfillment(activityData.newValue),
              caseFiles: listCaseFiles(activityData.newValue),
              familyMembers: listFamilyMembers(activityData.value)
            }),
            activityData.case?.Title
          )} */}
          <Box className="w-4/5 sm:px-[8px]">
            {logMessage(
              <Trans
                ns="activityLogs"
                i18nKey={'AGENT_APPROVE_CASE_FILE_FAMILY_MEMBER'}
                values={{
                  userName: agentUser(userData),
                  // client: clientUser(),
                  familyMember: listFamilyMembers([activityData.newValue.GeneratedFile.UserFamilyMember]),
                  caseType: activityData.case?.CaseType,
                  caseFiles: listCaseFiles([activityData.newValue]),
                  fullfill: criterionFulfillment([activityData.newValue])
                }}
                components={{
                  span: highlightDocumentText
                }}
              />
            )}
            {dateTimeComp}
          </Box>
        </ActivityLogItemBox>
      );
    }

    // keep it
    case 'AGENT_REJECT_CASE_FILE_CLIENT': {
      console.log('activityAction', activityAction);
      console.log('activityData', activityData);
      return (
        <ActivityLogItemBox>
          {iconToActionMap.reject}
          {/* {logMessage(
            t('AGENT_REJECT_CASE_FILE_CLIENT', {
              userName: agentUser(userData),
              client: caseClient(activityData.case),
              caseType: activityData.case?.CaseType,
              fulfill: criterionFulfillment(activityData.newValue),
              caseFiles: listCaseFiles(activityData.newValue)
            }),
            activityData.case?.Title
          )} */}
          <Box className="w-4/5 sm:px-[8px]">
            {logMessage(
              <Trans
                ns="activityLogs"
                i18nKey={'AGENT_REJECT_CASE_FILE_CLIENT'}
                values={{
                  userName: agentUser(userData),
                  client: clientUser(),
                  // familyMember: generatedFileFamilyMember(activityData.newValue.GeneratedFile.UserFamilyMember),
                  caseType: activityData.case?.CaseType,
                  caseFiles: listCaseFiles([activityData.newValue])
                }}
                components={{
                  span: highlightDocumentText
                }}
              />
            )}
            {dateTimeComp}
          </Box>
        </ActivityLogItemBox>
      );
    }

    case 'AGENT_REJECT_CASE_FILE_FAMILY_MEMBER': {
      console.log('activityAction', activityAction);
      console.log('activityData', activityData);
      return (
        <ActivityLogItemBox>
          {iconToActionMap.reject}
          {/* {logMessage(
            t('AGENT_REJECT_CASE_FILE_CLIENT', {
              userName: agentUser(userData),
              client: caseClient(activityData.case),
              caseType: activityData.case?.CaseType,
              fulfill: criterionFulfillment(activityData.newValue),
              caseFiles: listCaseFiles(activityData.newValue)
            }),
            activityData.case?.Title
          )} */}
          <Box className="w-4/5 sm:px-[8px]">
            {logMessage(
              <Trans
                ns="activityLogs"
                i18nKey={'AGENT_REJECT_CASE_FILE_FAMILY_MEMBER'}
                values={{
                  userName: agentUser(userData),
                  client: clientUser(),
                  familyMember: generatedFileFamilyMember(activityData.newValue.GeneratedFile.UserFamilyMember),
                  caseType: activityData.case?.CaseType,
                  caseFiles: listCaseFiles([activityData.newValue])
                }}
                components={{
                  span: highlightDocumentText
                }}
              />
            )}
            {dateTimeComp}
          </Box>
        </ActivityLogItemBox>
      );
    }

    // keep it
    case 'AGENT_CLOSE_CASE': {
      console.log('activityAction', activityAction);
      console.log('activityData', activityData);

      return (
        <ActivityLogItemBox>
          {iconToActionMap.closedCase}

          {/* {logMessage(
            t('AGENT_CLOSE_CASE', {
              // userName: agentUser(userData),
              // client: caseClient(activityData.case),
              caseType: activityData.case?.CaseType
            })
            // activityData.case?.Title
          )} */}
          <Box className="w-4/5 sm:px-[8px]">
            {logMessage(
              <Trans
                ns="activityLogs"
                i18nKey={'AGENT_CLOSE_CASE'}
                values={{
                  userName: agentUser(userData),
                  client: caseClient(activityData.case),
                  caseType: activityData.case?.CaseType
                }}
                components={{
                  span: highlightDocumentText
                }}
              />
            )}
            {dateTimeComp}
          </Box>
        </ActivityLogItemBox>
      );
    }

    case 'AGENT_ACTIVATE_CASE': {
      console.log('activityAction', activityAction);
      console.log('activityData', activityData);
      return (
        <ActivityLogItemBox>
          {iconToActionMap.reopen}

          {/* {logMessage(
            t('AGENT_CLOSE_CASE', {
              // userName: agentUser(userData),
              // client: caseClient(activityData.case),
              caseType: activityData.case?.CaseType
            })
            // activityData.case?.Title
          )} */}
          <Box className="w-4/5 sm:px-[8px]">
            {logMessage(
              <Trans
                ns="activityLogs"
                i18nKey={'AGENT_ACTIVATE_CASE'}
                values={{
                  userName: agentUser(userData),
                  client: caseClient(activityData.case),
                  caseType: activityData.case?.CaseType
                }}
                components={{
                  span: highlightDocumentText
                }}
              />
            )}
            {dateTimeComp}
          </Box>
        </ActivityLogItemBox>
      );
    }

    // case 'CLIENT_UPDATE_CASE': {
    //   return (
    //     <ActivityLogItemBox>
    //       {iconToActionMap.edit}
    //       {logMessage(
    //         t('CLIENT_UPDATE_CASE', {
    //           userName: user,
    //           caseType: activityData.case?.CaseType
    //         }),
    //         activityData.case?.Title
    //       )}
    //       <Box className="w-4/5 sm:px-[8px]">{dateTimeComp}</Box>
    //     </ActivityLogItemBox>
    //   );
    // }

    // keep it
    case 'AGENT_APPROVE_DOCUMENT_CHECKLIST': {
      console.log('activityAction', activityAction);
      console.log('activityData', activityData);
      return (
        <ActivityLogItemBox>
          {iconToActionMap.approveChecklist}
          <Box className="w-4/5 sm:px-[8px]">
            {/* {logMessage(
              t('AGENT_APPROVE_DOCUMENT_CHECKLIST', {
                client: caseClient(activityData.case),
                userName: agentUser(userData),
                criterionName: getCriterionName(activityData.oldValue),
                caseType: activityData.case?.CaseType
              }),
              activityData.case?.Title
            )} 
            {dateTimeComp} */}
            {logMessage(
              <Trans
                ns="activityLogs"
                i18nKey={'AGENT_APPROVE_DOCUMENT_CHECKLIST'}
                values={{
                  client: caseClient(activityData.case),
                  userName: agentUser(userData),
                  criterionName: getCriterionName(activityData.oldValue),
                  caseType: activityData.case?.CaseType
                }}
                components={{
                  span: highlightDocumentText
                }}
              />
            )}
            {dateTimeComp}
          </Box>
        </ActivityLogItemBox>
      );
    }

    // case 'AGENT_UPDATE_CASE_CRITERION': {
    //   return (
    //     <ActivityLogItemBox>
    //       {iconToActionMap.edit}
    //       {logMessage(
    //         t('AGENT_UPDATE_CASE_CRITERION', {
    //           client: caseClient(activityData.case),
    //           userName: agentUser(userData),
    //           criterionName: getCriterionTitle(activityData.newValue),
    //           caseType: activityData.case?.CaseType
    //         }),
    //         activityData.case?.Title
    //       )}
    //       <Box className="w-4/5 sm:px-[8px]">{dateTimeComp}</Box>
    //     </ActivityLogItemBox>
    //   );
    // }

    // case 'AGENT_UPDATE_CASE_FILE_CLIENT': {
    //   return (
    //     <ActivityLogItemBox>
    //       {iconToActionMap.edit}
    //       {logMessage(
    //         t('AGENT_UPDATE_CASE_FILE_CLIENT', {
    //           client: caseClient(activityData.case),
    //           userName: agentUser(userData),
    //           caseFiles: listCaseFiles([activityData.oldValue]),
    //           caseType: activityData.case?.CaseType
    //         }),
    //         activityData.case?.Title
    //       )}
    //       <Box className="w-4/5 sm:px-[8px]">{dateTimeComp}</Box>
    //     </ActivityLogItemBox>
    //   );
    // }

    // case 'AGENT_REMOVE_CASE_WORKFLOW_CRITERIA': {
    //   return (
    //     <ActivityLogItemBox>
    //       {iconToActionMap.delete}
    //       {logMessage(
    //         t('AGENT_REMOVE_CASE_WORKFLOW_CRITERIA', {
    //           client: caseClient(activityData.case),
    //           userName: agentUser(userData),
    //           criterionName: getCriterionTitle(activityData.oldValue),
    //           caseType: activityData.case?.CaseType
    //         }),
    //         activityData.case?.Title
    //       )}
    //       <Box className="w-4/5 sm:px-[8px]">{dateTimeComp}</Box>
    //     </ActivityLogItemBox>
    //   );
    // }

    // case 'CLIENT_UPDATE_FAMILY_MEMBER': {
    //   return (
    //     <ActivityLogItemBox>
    //       {iconToActionMap.edit}
    //       {logMessage(
    //         t('CLIENT_UPDATE_FAMILY_MEMBER', {
    //           userName: user,
    //           familyMember: listFamilyMembers([activityData.newValue])
    //         })
    //       )}
    //       <Box className="w-4/5 sm:px-[8px]">{dateTimeComp}</Box>
    //     </ActivityLogItemBox>
    //   );
    // }

    // case 'CLIENT_UPDATE_PROFILE_SELF': {
    //   return (
    //     <ActivityLogItemBox>
    //       {iconToActionMap.edit}
    //       {logMessage(
    //         t('CLIENT_UPDATE_PROFILE_SELF', {
    //           userName: user
    //         })
    //       )}
    //       <Box className="w-4/5 sm:px-[8px]">{dateTimeComp}</Box>
    //     </ActivityLogItemBox>
    //   );
    // }

    // keep it
    case 'AGENT_DOWNLOAD_ALL_CASE_FILES': {
      console.log('activityAction', activityAction);
      console.log('activityData', activityData);
      return (  
        <ActivityLogItemBox>
          {iconToActionMap.download}
          {/* {logMessage(
            t('AGENT_DOWNLOAD_ALL_CASE_FILES', {
              userName: agentUser(userData),
              client: user,
              fulfill: criterionFulfillment(activityData.value),
              caseType: activityData.case?.CaseType
            }),
            activityData.case?.Title
          )} */}
          <Box className="w-4/5 sm:px-[8px]">
            {logMessage(
              <Trans
                ns="activityLogs"
                i18nKey={'AGENT_DOWNLOAD_ALL_CASE_FILES'}
                values={{
                  client: caseClient(activityData.case),
                  userName: agentUser(userData),
                  criterionName: getCaseCriterionNameFromList(activityData.value),
                  caseType: activityData.case?.CaseType
                }}
                components={{
                  span: highlightDocumentText
                }}
              />
            )}
            {dateTimeComp}
          </Box>
        </ActivityLogItemBox>
      );
    }

    // keep it
    case 'AGENT_DOWNLOAD_CASE_FILE_CLIENT': {
      console.log('activityAction', activityAction);
      console.log('activityData', activityData);
      return (
        <ActivityLogItemBox>
          {iconToActionMap.download}
          {/* {logMessage(
            t('AGENT_DOWNLOAD_CASE_FILE_CLIENT', {
              userName: agentUser(userData),
              client: user,
              fulfill: criterionFulfillment(activityData.value),
              caseType: activityData.case?.CaseType
            }),
            activityData.case?.Title
          )} */}
          <Box className="w-4/5 sm:px-[8px]">
            {logMessage(
              <Trans
                ns="activityLogs"
                i18nKey={'AGENT_DOWNLOAD_CASE_FILE_CLIENT'}
                values={{
                  // userName: agentUser(userData),
                  // familyMember: listFamilyMembers([activityData.familyMember]),
                  // // fulfill: activityData.,
                  // caseFiles: activityData.value.FileType,
                  // caseType: activityData.case?.CaseType
                  userName: agentUser(userData),
                  client: clientUser(),
                  // fulfill: criterionFulfillment(activityData.value),
                  caseFiles: activityData.value.FileType,
                  caseType: activityData.case?.CaseType
                }}
                components={{
                  span: highlightDocumentText
                }}
              />
            )}
            {dateTimeComp}
          </Box>
        </ActivityLogItemBox>
      );
    }

    /// Need to check typo about firstname and lastName
    case 'AGENT_DOWNLOAD_CASE_FILE_FAMILY_MEMBER': {
      console.log('activityAction', activityAction);
      console.log('activityData', activityData);
      return (
        <ActivityLogItemBox>
          {iconToActionMap.download}

          <Box className="w-4/5 sm:px-[8px]">
            {/* {logMessage(
              t('AGENT_DOWNLOAD_CASE_FILE_FAMILY_MEMBER', {
                userName: agentUser(userData),
                familyMember: 'TEST TEST',
                // fulfill: activityData.,
                caseFiles: activityData.value.FileType,
                caseType: activityData.case?.CaseType
              })
            )} */}
            {logMessage(
              <Trans
                ns="activityLogs"
                i18nKey={'AGENT_DOWNLOAD_CASE_FILE_FAMILY_MEMBER'}
                values={{
                  userName: agentUser(userData),
                  familyMember: listFamilyMembers([activityData.familyMember]),
                  // fulfill: activityData.,
                  caseFiles: activityData.value.FileType,
                  caseType: activityData.case?.CaseType
                }}
                components={{
                  span: highlightDocumentText
                }}
              />
            )}
            {dateTimeComp}
          </Box>
        </ActivityLogItemBox>
      );
    }

    // case 'CLIENT_GET_FAMILY_MEMBER_BY_ID': {
    //   return (
    //     <ActivityLogItemBox>
    //       {iconToActionMap.view}
    //       {logMessage(
    //         t('CLIENT_GET_FAMILY_MEMBER_BY_ID', {
    //           userName: user,
    //           fulfill: listFamilyMembers([activityData.value])
    //         })
    //       )}
    //       <Box className="w-4/5 sm:px-[8px]">{dateTimeComp}</Box>
    //     </ActivityLogItemBox>
    //   );
    // }

    // case 'AGENT_GET_ALL_USER_CASES': {
    //   return (
    //     <ActivityLogItemBox>
    //       {iconToActionMap.view}
    //       {logMessage(
    //         t('AGENT_GET_ALL_USER_CASES', {
    //           userName: agentUser(userData),
    //           client: caseClient(activityData.case)
    //         })
    //       )}
    //       <Box className="w-4/5 sm:px-[8px]">{dateTimeComp}</Box>
    //     </ActivityLogItemBox>
    //   );
    // }

    // case 'CLIENT_GET_ALL_USER_FAMILY_MEMBERS': {
    //   return (
    //     <ActivityLogItemBox>
    //       {iconToActionMap.view}
    //       {logMessage(
    //         t('CLIENT_GET_ALL_USER_FAMILY_MEMBERS', {
    //           userName: user,
    //           familyMembers: listFamilyMembers(activityData.value)
    //         })
    //       )}
    //       <Box className="w-4/5 sm:px-[8px]">{dateTimeComp}</Box>
    //     </ActivityLogItemBox>
    //   );
    // }

    // case 'CLIENT_GET_CASE_FAMILY_MEMBERS': {
    //   return (
    //     <ActivityLogItemBox>
    //       {iconToActionMap.view}
    //       {logMessage(
    //         t('CLIENT_GET_CASE_FAMILY_MEMBERS', {
    //           userName: agentUser(userData),
    //           client: caseClient(activityData.case),
    //           caseType: activityData.case?.CaseType,
    //           familyMembers: listFamilyMembers(activityData.value.map((v: CaseApplicant) => v?.UserFamilyMember))
    //         }),
    //         activityData.case?.Title
    //       )}
    //       <Box className="w-4/5 sm:px-[8px]">{dateTimeComp}</Box>
    //     </ActivityLogItemBox>
    //   );
    // }

    // case 'AGENT_GET_CASE_FILE_LISTING': {
    //   return (
    //     <ActivityLogItemBox>
    //       {iconToActionMap.view}
    //       {logMessage(
    //         t('AGENT_GET_CASE_FILE_LISTING', {
    //           userName: agentUser(userData),
    //           client: caseClient(activityData.case),
    //           caseType: activityData.case?.CaseType,
    //           fulfill: criterionFulfillment(activityData.value),
    //           caseFiles: listCaseFiles(activityData.value)
    //         }),
    //         activityData.case?.Title
    //       )}
    //       <Box className="w-4/5 sm:px-[8px]">{dateTimeComp}</Box>
    //     </ActivityLogItemBox>
    //   );
    // }

    // keep it
    case 'AGENT_PREVIEW_CASE_FILE': {
      console.log('activityAction', activityAction);
      console.log('activityData', activityData);
      return (
        <ActivityLogItemBox>
          {iconToActionMap.view}
          {logMessage(
            t('AGENT_PREVIEW_CASE_FILE', {
              userName: agentUser(userData),
              client: caseClient(activityData.case),
              caseType: activityData.case?.CaseType,
              fulfill: criterionFulfillment([activityData.value])
            }),
            activityData.case?.Title
          )}
          <Box className="w-4/5 sm:px-[8px]">{dateTimeComp}</Box>
        </ActivityLogItemBox>
      );
    }

    // case 'CLIENT_GET_CASE_BY_ID': {
    //   return (
    //     <ActivityLogItemBox>
    //       {iconToActionMap.view}
    //       {logMessage(
    //         t('CLIENT_GET_CASE_BY_ID', {
    //           userName: agentUser(userData),
    //           client: caseClient(activityData.value),
    //           caseType: activityData.value.CaseType
    //         }),
    //         activityData.value?.Title
    //       )}
    //       <Box className="w-4/5 sm:px-[8px]">{dateTimeComp}</Box>
    //     </ActivityLogItemBox>
    //   );
    // // }

    // case 'CLIENT_VIEW_CASE_FAMILY_MEMBERS': {
    //   return (
    //     <ActivityLogItemBox>
    //       {iconToActionMap.view}
    //       {logMessage(
    //         t('CLIENT_VIEW_CASE_FAMILY_MEMBERS', {
    //           userName: agentUser(userData),
    //           client: caseClient(activityData.case),
    //           familyMembers: listFamilyMembers(activityData.value),
    //           caseType: activityData.case?.CaseType
    //         }),
    //         activityData.case?.Title
    //       )}
    //       <Box className="w-4/5 sm:px-[8px]">{dateTimeComp}</Box>
    //     </ActivityLogItemBox>
    //   );
    // }

    // case 'CLIENT_VIEW_CASE_FILE_LIST': {
    //   return (
    //     <ActivityLogItemBox>
    //       {iconToActionMap.view}
    //       {logMessage(
    //         t('CLIENT_VIEW_CASE_FILE_LIST', {
    //           userName: agentUser(userData),
    //           client: caseClient(activityData.case),
    //           caseType: activityData.case?.CaseType
    //         }),
    //         activityData.case?.Title
    //       )}
    //       <Box className="w-4/5 sm:px-[8px]">{dateTimeComp}</Box>
    //     </ActivityLogItemBox>
    //   );
    // }

    // case 'AGENT_VIEW_CASE_NOTES': {
    //   return (
    //     <ActivityLogItemBox>
    //       {iconToActionMap.view}
    //       {logMessage(
    //         t('AGENT_VIEW_CASE_NOTES', {
    //           userName: agentUser(userData),
    //           client: caseClient(activityData.case),
    //           caseType: activityData.case?.CaseType
    //         }),
    //         activityData.case?.Title
    //       )}
    //       <Box className="w-4/5 sm:px-[8px]">{dateTimeComp}</Box>
    //     </ActivityLogItemBox>
    //   );
    // }

    // case 'CLIENT_VIEW_CASE_TEAM_MEMBERS': {
    //   return (
    //     <ActivityLogItemBox>
    //       {iconToActionMap.view}
    //       {logMessage(
    //         t('CLIENT_VIEW_CASE_TEAM_MEMBERS', {
    //           userName: agentUser(userData),
    //           client: caseClient(activityData.case),
    //           caseType: activityData.case?.CaseType
    //         }),
    //         activityData.case?.Title
    //       )}
    //       <Box className="w-4/5 sm:px-[8px]">{dateTimeComp}</Box>
    //     </ActivityLogItemBox>
    //   );
    // }

    // keep it
    case 'AGENT_ADD_CASE_FILE_CLIENT': {
      console.log('activityAction', activityAction);
      console.log('activityData', activityData);
      return (
        <ActivityLogItemBox>
          {iconToActionMap.creation}
          {/* {logMessage(
            t('AGENT_ADD_CASE_FILE_CLIENT', {
              userName: agentUser(userData),
              client: caseClient(activityData.case),
              fulfill: criterionFulfillment(activityData.newValue),
              caseFiles: listCaseFiles(activityData.newValue),
              caseType: activityData.case?.CaseType
            }),
            activityData.case?.Title
          )} */}
          <Box className="w-4/5 sm:px-[8px]">
            {logMessage(
              <Trans
                ns="activityLogs"
                i18nKey={'AGENT_ADD_CASE_FILE_CLIENT'}
                values={{
                  userName: agentUser(userData),
                  client: clientUser(),
                  fulfill: criterionFulfillment(activityData.newValue),
                  caseFiles: listCaseFiles(activityData.newValue),
                  caseType: activityData.case?.CaseType
                }}
                components={{
                  span: highlightDocumentText
                }}
              />
            )}
            {dateTimeComp}
          </Box>
        </ActivityLogItemBox>
      );
    }

    // keep it
    case 'AGENT_ADD_CASE_FILES_FAMILY_MEMBER': {
      console.log('activityAction', activityAction);
      console.log('activityData', activityData);
      return (
        <ActivityLogItemBox>
          {iconToActionMap.creation}
          {/* {logMessage(
            t('AGENT_ADD_CASE_FILE_FAMILY_MEMBER', {
              userName: agentUser(userData),
              client: caseClient(activityData.case),
              fulfill: criterionFulfillment(activityData.newValue),
              caseFiles: listCaseFiles(activityData.newValue),
              caseType: activityData.case?.CaseType,
              familyMembers: listFamilyMembers(activityData.value)
            }),
            activityData.case?.Title
          )} */}
          <Box className="w-4/5 sm:px-[8px]">
            {logMessage(
              <Trans
                ns="activityLogs"
                i18nKey={'AGENT_ADD_CASE_FILES_FAMILY_MEMBER'}
                values={{
                  userName: agentUser(userData),
                  familyMember: generatedFileFamilyMember(activityData.familyMember),
                  fulfill: criterionFulfillment(activityData.newValue),
                  caseFiles: listCaseFiles(activityData.newValue),
                  caseType: activityData.case?.CaseType
                }}
                components={{
                  span: highlightDocumentText
                }}
              />
            )}
            {dateTimeComp}
          </Box>
        </ActivityLogItemBox>
      );
    }

    // case 'AGENT_RESUBMIT_CASE_FILES_CLIENT': {
    //   return (
    //     <ActivityLogItemBox>
    //       {iconToActionMap.redo}
    //       {logMessage(
    //         t('AGENT_RESUBMIT_CASE_FILES_CLIENT', {
    //           userName: agentUser(userData),
    //           client: caseClient(activityData.case),
    //           fulfill: criterionFulfillment(activityData.newValue),
    //           caseFiles: listCaseFiles(activityData.newValue),
    //           caseType: activityData.case?.CaseType
    //         }),
    //         activityData.case?.Title
    //       )}
    //       <Box className="w-4/5 sm:px-[8px]">{dateTimeComp}</Box>
    //     </ActivityLogItemBox>
    //   );
    // }

    // case 'AGENT_RESUBMIT_CASE_FILES_FAMILY_MEMBER': {
    //   return (
    //     <ActivityLogItemBox>
    //       {iconToActionMap.redo}
    //       {logMessage(
    //         t('AGENT_RESUBMIT_CASE_FILES_FAMILY_MEMBER', {
    //           userName: agentUser(userData),
    //           client: caseClient(activityData.case),
    //           fulfill: criterionFulfillment(activityData.newValue),
    //           caseFiles: listCaseFiles(activityData.newValue),
    //           caseType: activityData.case?.CaseType,
    //           familyMembers: listFamilyMembers(activityData.value)
    //         }),
    //         activityData.case?.Title
    //       )}
    //       <Box className="w-4/5 sm:px-[8px]">{dateTimeComp}</Box>
    //     </ActivityLogItemBox>
    //   );
    // }

    // keep it
    case 'AGENT_PENDING_CASE_FILE_CLIENT': {
      console.log('activityAction', activityAction);
      console.log('activityData', activityData);
      return (
        <ActivityLogItemBox>
          {iconToActionMap.pending}
          {/* {logMessage(
            t('AGENT_PENDING_CASE_FILE_CLIENT', {
              userName: agentUser(userData),
              client: caseClient(activityData.case),
              fulfill: criterionFulfillment(activityData.newValue),
              caseFiles: listCaseFiles(activityData.newValue),
              caseType: activityData.case?.CaseType
            }),
            activityData.case?.Title
          )} */}
          <Box className="w-4/5 sm:px-[8px]">
            {' '}
            {logMessage(
              <Trans
                ns="activityLogs"
                i18nKey={'AGENT_PENDING_CASE_FILE_CLIENT'}
                values={{
                  userName: agentUser(userData),
                  client: clientUser(),
                  fulfill: criterionFulfillment([activityData.newValue]),
                  caseFiles: listCaseFiles([activityData.newValue]),
                  caseType: activityData.case?.CaseType
                  // familyMember: generatedFileFamilyMember(activityData.newValue.GeneratedFile?.UserFamilyMember)
                  // familyMember: 'JOHN'
                }}
                components={{
                  span: highlightDocumentText
                }}
              />
            )}
            {dateTimeComp}
          </Box>
        </ActivityLogItemBox>
      );
    }

    // keep it
    case 'AGENT_PENDING_CASE_FILE_FAMILY_MEMBER': {
      console.log('activityAction', activityAction);
      console.log('activityData', activityData);
      return (
        <ActivityLogItemBox>
          {iconToActionMap.pending}
          {/* {iconToActionMap.redo}
          {logMessage(
            t('AGENT_PENDING_CASE_FILE_FAMILY_MEMBER', {
              userName: agentUser(userData),
              client: caseClient(activityData.case),
              fulfill: criterionFulfillment(activityData.newValue),
              caseFiles: listCaseFiles(activityData.newValue),
              caseType: activityData.case?.CaseType,
              familyMembers: listFamilyMembers(activityData.value)
            }),
            activityData.case?.Title
          )} */}
          <Box className="w-4/5 sm:px-[8px]">
            {' '}
            {logMessage(
              <Trans
                ns="activityLogs"
                i18nKey={'AGENT_PENDING_CASE_FILE_FAMILY_MEMBER'}
                values={{
                  userName: agentUser(userData),
                  client: clientUser(),
                  fulfill: criterionFulfillment([activityData.newValue]),
                  caseFiles: listCaseFiles([activityData.newValue]),
                  caseType: activityData.case?.CaseType,
                  familyMember: generatedFileFamilyMember(activityData.newValue.GeneratedFile?.UserFamilyMember)
                  // familyMember: 'JOHN'
                }}
                components={{
                  span: highlightDocumentText
                }}
              />
            )}
            {dateTimeComp}
          </Box>
        </ActivityLogItemBox>
      );
    }

    // keep it
    case 'AGENT_UNDER_REVIEW_CASE_FILE_CLIENT': {
      console.log('activityAction', activityAction);
      console.log('activityData', activityData);
      return (
        <ActivityLogItemBox>
          {iconToActionMap.view}
          {/* {logMessage(
            t('AGENT_UNDER_REVIEW_CASE_FILE_CLIENT', {
              userName: agentUser(userData),
              client: caseClient(activityData.case),
              // fulfill: criterionFulfillment(activityData.newValue),
              caseFiles: listCaseFiles(activityData.oldValue),
              caseType: activityData.case?.CaseType
            }),
            activityData.case?.Title
          )} */}
          <Box className="w-4/5 sm:px-[8px]">
            {logMessage(
              <Trans
                ns="activityLogs"
                i18nKey={'AGENT_UNDER_REVIEW_CASE_FILE_CLIENT'}
                values={{
                  userName: agentUser(userData),
                  client: clientUser(),
                  // fulfill: criterionFulfillment(activityData.newValue),
                  fulfill: criterionFulfillment([activityData.newValue]),
                  caseFiles: listCaseFiles([activityData.newValue]),
                  caseType: activityData.case?.CaseType
                  // familyMember: generatedFileFamilyMember(activityData.newValue.GeneratedFile?.UserFamilyMember)
                  // familyMember: 'JOHN'
                }}
                components={{
                  span: highlightDocumentText
                }}
              />
            )}
            {dateTimeComp}
          </Box>
        </ActivityLogItemBox>
      );
    }

    // keep it
    case 'AGENT_UNDER_REVIEW_CASE_FILE_FAMILY_MEMBER': {
      console.log('activityAction', activityAction);
      console.log('activityData', activityData);
      return (
        <ActivityLogItemBox>
          {iconToActionMap.view}
          {/* {logMessage(
            t('AGENT_UNDER_REVIEW_CASE_FILE_FAMILY_MEMBER', {
              userName: agentUser(userData),
              client: caseClient(activityData.case),
              fulfill: criterionFulfillment(activityData.newValue),
              caseFiles: listCaseFiles(activityData.newValue),
              caseType: activityData.case?.CaseType,
              familyMembers: listFamilyMembers(activityData.value)
            }),
            activityData.case?.Title
          )} */}
          <Box className="w-4/5 sm:px-[8px]">
            {logMessage(
              <Trans
                ns="activityLogs"
                i18nKey={'AGENT_UNDER_REVIEW_CASE_FILE_FAMILY_MEMBER'}
                values={{
                  userName: agentUser(userData),
                  // client: caseClient(activityData.case),
                  // fulfill: criterionFulfillment(activityData.newValue),
                  fulfill: criterionFulfillment([activityData.newValue]),
                  caseFiles: listCaseFiles([activityData.newValue]),
                  caseType: activityData.case?.CaseType,
                  familyMember: generatedFileFamilyMember(activityData.newValue.GeneratedFile?.UserFamilyMember)
                  // familyMember: 'JOHN'
                }}
                components={{
                  span: highlightDocumentText
                }}
              />
            )}
            {dateTimeComp}
          </Box>
        </ActivityLogItemBox>
      );
    }

    // keep it
    case 'CLIENT_RESUBMIT_CASE_FILES_SELF': {
      console.log('activityAction', activityAction);
      console.log('activityData', activityData);
      return (
        <ActivityLogItemBox>
          {iconToActionMap.redo}
          {/* {logMessage(
            t('CLIENT_RESUBMIT_CASE_FILES_SELF', {
              userName: user,
              fulfill: criterionFulfillment(activityData.newValue),
              caseFiles: listCaseFiles(activityData.newValue),
              caseType: activityData.case?.CaseType
            }),
            activityData.case?.Title
          )} */}
          <Box className="w-4/5 sm:px-[8px]">
            {logMessage(
              <Trans
                ns="activityLogs"
                i18nKey={'CLIENT_RESUBMIT_CASE_FILES_SELF'}
                values={{
                  userName: user,
                  // client: caseClient(activityData.case),
                  fulfill: criterionFulfillment([activityData.newValue]),
                  caseFiles: listCaseFiles([activityData.newValue]),
                  caseType: activityData.case?.CaseType
                  // familyMember: generatedFileFamilyMember(activityData.newValue.GeneratedFile?.UserFamilyMember)
                  // familyMember: 'JOHN'
                }}
                components={{
                  span: highlightDocumentText
                }}
              />
            )}
            {dateTimeComp}
          </Box>
        </ActivityLogItemBox>
      );
    }

    // keep it
    case 'CLIENT_RESUBMIT_CASE_FILES_FAMILY_MEMBER': {
      console.log('activityAction', activityAction);
      console.log('activityData', activityData);
      return (
        <ActivityLogItemBox>
          {iconToActionMap.redo}
          {/* {logMessage(
            t('CLIENT_RESUBMIT_CASE_FILES_FAMILY_MEMBER', {
              userName: user,
              fulfill: criterionFulfillment(activityData.newValue),
              caseFiles: listCaseFiles(activityData.newValue),
              caseType: activityData.case?.CaseType,
              familyMembers: listFamilyMembers(activityData.value)
            }),
            activityData.case?.Title
          )} */}
          <Box className="w-4/5 sm:px-[8px]">
            {' '}
            {logMessage(
              <Trans
                ns="activityLogs"
                i18nKey={'CLIENT_RESUBMIT_CASE_FILES_FAMILY_MEMBER'}
                values={{
                  userName: user,
                  // client: caseClient(activityData.case),
                  fulfill: criterionFulfillment([activityData.newValue]),
                  caseFiles: listCaseFiles([activityData.newValue]),
                  caseType: activityData.case?.CaseType,
                  familyMember: listFamilyMembers([activityData.newValue?.GeneratedFile.UserFamilyMember])
                  // familyMember: generatedFileFamilyMember(activityData.newValue.GeneratedFile?.UserFamilyMember)
                  // familyMember: 'JOHN'
                }}
                components={{
                  span: highlightDocumentText
                }}
              />
            )}
            {dateTimeComp}
          </Box>
        </ActivityLogItemBox>
      );
    }

    // case 'AGENT_UPDATE_DOCUMENT_FAMILY_MEMBER': {
    //   return (
    //     <ActivityLogItemBox>
    //       {iconToActionMap.edit}
    //       {logMessage(
    //         t('AGENT_UPDATE_DOCUMENT_FAMILY_MEMBER', {
    //           userName: agentUser(userData),
    //           client: clientUser(activityData.client),
    //           document: documentNewValue,
    //           familyMember: listFamilyMembers([activityData.familyMember])
    //         }),
    //         activityData.case?.Title
    //       )}
    //       <Box className="w-4/5 sm:px-[8px]">{dateTimeComp}</Box>
    //     </ActivityLogItemBox>
    //   );
    // }

    // case 'AGENT_UPDATE_DOCUMENT_CLIENT': {
    //   return (
    //     <ActivityLogItemBox>
    //       {iconToActionMap.edit}
    //       {logMessage(
    //         t('AGENT_UPDATE_DOCUMENT_CLIENT', {
    //           userName: agentUser(userData),
    //           client: clientUser(activityData.client),
    //           document: documentNewValue
    //         }),
    //         activityData.case?.Title
    //       )}
    //       <Box className="w-4/5 sm:px-[8px]">{dateTimeComp}</Box>
    //     </ActivityLogItemBox>
    //   );
    // }

    // case 'AGENT_UPLOAD_DOCUMENT_CLIENT': {
    //   return (
    //     <ActivityLogItemBox>
    //       {iconToActionMap.upload}
    //       {logMessage(
    //         t('AGENT_UPLOAD_DOCUMENT_CLIENT', {
    //           userName: agentUser(userData),
    //           client: clientUser(activityData.client),
    //           document: documentNewValue
    //         }),
    //         activityData.case?.Title
    //       )}
    //       <Box className="w-4/5 sm:px-[8px]">{dateTimeComp}</Box>
    //     </ActivityLogItemBox>
    //   );
    // }

    // case 'AGENT_UPLOAD_DOCUMENT_FAMILY_MEMBER': {
    //   return (
    //     <ActivityLogItemBox>
    //       {iconToActionMap.upload}
    //       {logMessage(
    //         t('AGENT_UPLOAD_DOCUMENT_FAMILY_MEMBER', {
    //           userName: agentUser(userData),
    //           client: clientUser(activityData.client),
    //           familyMember: listFamilyMembers([activityData.familyMember]),
    //           document: documentNewValue
    //         }),
    //         activityData.case?.Title
    //       )}
    //       <Box className="w-4/5 sm:px-[8px]">{dateTimeComp}</Box>
    //     </ActivityLogItemBox>
    //   );
    // }

    // keep it
    case 'CLIENT_UPDATE_CASE_FILE_FAMILY_MEMBER': {
      console.log('activityAction', activityAction);
      console.log('activityData', activityData);
      return (
        <ActivityLogItemBox>
          {iconToActionMap.edit}
          {/* {logMessage(
            t('CLIENT_UPDATE_CASE_FILE', {
              userName: user,
              caseFiles: listCaseFiles([activityData.oldValue]),
              caseType: activityData.case?.CaseType
            }),
            activityData.case?.Title
          )} */}
          <Box className="w-4/5 sm:px-[8px]">
            {logMessage(
              <Trans
                ns="activityLogs"
                i18nKey={'CLIENT_UPDATE_CASE_FILE_FAMILY_MEMBER'}
                values={{
                  userName: user,
                  // client: clientUser(),
                  familyMember: generatedFileFamilyMember(activityData.newValue.GeneratedFile.UserFamilyMember),
                  fulfill: criterionFulfillment([activityData.newValue]),
                  caseFiles: listCaseFiles([activityData.newValue]),
                  caseType: activityData.case?.CaseType
                }}
                components={{
                  span: highlightDocumentText
                }}
              />
            )}
            {dateTimeComp}
          </Box>
        </ActivityLogItemBox>
      );
    }

    // case 'AGENT_UPDATE_PROFILE_SELF': {
    //   return (
    //     <ActivityLogItemBox>
    //       {iconToActionMap.edit}
    //       {logMessage(
    //         t('AGENT_UPDATE_PROFILE_SELF', {
    //           userName: user
    //         })
    //       )}
    //       <Box className="w-4/5 sm:px-[8px]">{dateTimeComp}</Box>
    //     </ActivityLogItemBox>
    //   );
    // }

    // keep it
    case 'CLIENT_UPDATE_CASE_FILE_SELF': {
      console.log('activityAction', activityAction);
      console.log('activityData', activityData);
      return (
        <ActivityLogItemBox>
          {iconToActionMap.edit}
          {/* {logMessage(
            t('CLIENT_UPDATE_CASE_FILE', {
              userName: user,
              caseFiles: listCaseFiles([activityData.oldValue]),
              caseType: activityData.case?.CaseType
            }),
            activityData.case?.Title
          )} */}
          <Box className="w-4/5 sm:px-[8px]">
            {logMessage(
              <Trans
                ns="activityLogs"
                i18nKey={'CLIENT_UPDATE_CASE_FILE_SELF'}
                values={{
                  userName: user,
                  // client: clientUser(),
                  fulfill: criterionFulfillment([activityData.newValue]),
                  caseFiles: listCaseFiles([activityData.newValue]),
                  caseType: activityData.case?.CaseType
                }}
                components={{
                  span: highlightDocumentText
                }}
              />
            )}
            {dateTimeComp}
          </Box>
        </ActivityLogItemBox>
      );
    }

    // keep it
    case 'AGENT_UPDATE_CASE_FILE_FAMILY_MEMBER': {
      console.log('activityAction', activityAction);
      console.log('activityData', activityData);
      return (
        <ActivityLogItemBox>
          {iconToActionMap.edit}
          {logMessage(
            t('AGENT_UPDATE_CASE_FILE_CLIENT', {
              client: caseClient(activityData.case),
              userName: agentUser(userData),
              caseFiles: listCaseFiles([activityData.oldValue]),
              caseType: activityData.case?.CaseType
            }),
            activityData.case?.Title
          )}
          <Box className="w-4/5 sm:px-[8px]">{dateTimeComp}</Box>
        </ActivityLogItemBox>
      );
    }

    // keep it

    // keep it

    default:
      return 'Activity Log not handled';
  }
};
