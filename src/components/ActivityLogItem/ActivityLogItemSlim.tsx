import {
  // CaseApplicant,
  // CaseCriterion,
  CaseFile,
  // CaseNote,
  Constants,
  // FamilyMember,
  UserBase,
  ActivityLogs,
  FamilyMember
} from '@namyfile/api-client';
// import { useTranslation } from 'react-i18next';
// import { Case } from '@namyfile/api-client';
export const actionTypes: Array<{ name: string; value: ActivityLogs }> = [
  {
    name: 'activityLogActionsDropDownUpload',
    value: [
      'CLIENT_ADD_CASE_FILES_SELF',
      'AGENT_ADD_CASE_FILE_CLIENT',
      'CLIENT_ADD_CASE_FILES_FAMILY_MEMBER',
      'AGENT_ADD_CASE_FILES_FAMILY_MEMBER'
    ]
  },
  {
    name: 'activityLogActionsDropDownDelete',
    value: ['CLIENT_REMOVE_CASE_FILES_SELF', 'CLIENT_REMOVE_CASE_FILES_FAMILY_MEMBER']
  },
  {
    name: 'activityLogActionsDropDownDownload',
    value: [
      'AGENT_DOWNLOAD_CASE_FILE_CLIENT',
      'AGENT_DOWNLOAD_CASE_FILE_FAMILY_MEMBER',
      'AGENT_DOWNLOAD_ALL_CASE_FILES'
    ]
  },
  // {
  //   name: 'activityLogActionsDropDownEdited',
  //   value: ['CLIENT_UPDATE_CASE_FILE_SELF', 'CLIENT_UPDATE_CASE_FILE_FAMILY_MEMBER']
  // },
  {
    name: 'activityLogActionsDropDownUpdated',
    value: ['CLIENT_UPDATE_CASE_FILE_SELF', 'CLIENT_UPDATE_CASE_FILE_FAMILY_MEMBER']
  },
  {
    name: 'activityLogActionsDropDownResubmit',
    value: [
      // 'AGENT_UPDATE_CASE_FILE_FAMILY_MEMBER',
      // 'AGENT_UPDATE_CASE_FILE_CLIENT',
      'CLIENT_RESUBMIT_CASE_FILES_FAMILY_MEMBER',
      'CLIENT_RESUBMIT_CASE_FILES_SELF'
    ]
  },
  {
    name: 'activityLogActionsDropDownPending',
    value: ['AGENT_PENDING_CASE_FILE_CLIENT', 'AGENT_PENDING_CASE_FILE_FAMILY_MEMBER']
  },
  {
    name: 'activityLogActionsDropDownApproved',
    value: ['AGENT_APPROVE_CASE_FILE_CLIENT', 'AGENT_APPROVE_CASE_FILE_FAMILY_MEMBER']
  },
  {
    name: 'activityLogActionsDropDownUnderReview',
    value: [
      // 'AGENT_PREVIEW_CASE_FILE',
      'AGENT_UNDER_REVIEW_CASE_FILE_CLIENT',
      'AGENT_UNDER_REVIEW_CASE_FILE_FAMILY_MEMBER'
    ]
  },
  {
    name: 'activityLogActionsDropDownstatuschangeResubmit',
    value: ['AGENT_REJECT_CASE_FILE_CLIENT', 'AGENT_REJECT_CASE_FILE_FAMILY_MEMBER']
  },
  { name: 'activityLogActionsDropDownChecklist', value: ['AGENT_APPROVE_DOCUMENT_CHECKLIST'] },
  { name: 'activityLogActionsDropDownClosed', value: ['AGENT_CLOSE_CASE'] },
  { name: 'activityLogActionsDropDownReopened', value: ['AGENT_ACTIVATE_CASE'] },

  { name: 'activityLogActionsNoteAdded', value: ['AGENT_ADD_NEW_CASE_NOTE'] }
];

// export const actionTypes: Array<{ name: string; value: ActivityLogs }> = [
//   {
//     name: 'Uploaded document',
//     value: [
//       'CLIENT_ADD_CASE_FILES_SELF',
//       'AGENT_ADD_CASE_FILE_CLIENT',
//       'CLIENT_ADD_CASE_FILES_FAMILY_MEMBER',
//       'AGENT_ADD_CASE_FILES_FAMILY_MEMBER'
//     ]
//   },
//   {
//     name: 'Deleted document',
//     value: ['CLIENT_REMOVE_CASE_FILES_SELF', 'CLIENT_REMOVE_CASE_FILES_FAMILY_MEMBER']
//   },
//   {
//     name: 'Downloaded document',
//     value: [
//       'AGENT_DOWNLOAD_CASE_FILE_CLIENT',
//       'AGENT_DOWNLOAD_CASE_FILE_FAMILY_MEMBER',
//       'AGENT_DOWNLOAD_ALL_CASE_FILES'
//     ]
//   },
//   {
//     name: 'Edited document',
//     value: ['CLIENT_UPDATE_CASE_FILE_SELF', 'CLIENT_UPDATE_CASE_FILE_FAMILY_MEMBER']
//   },
//   {
//     name: 'Resubmitted document',
//     value: [
//       'AGENT_UPDATE_CASE_FILE_FAMILY_MEMBER',
//       'AGENT_UPDATE_CASE_FILE_CLIENT',
//       'CLIENT_RESUBMIT_CASE_FILES_FAMILY_MEMBER',
//       'CLIENT_RESUBMIT_CASE_FILES_SELF'
//     ]
//   },
//   { name: 'Approved checklist', value: ['AGENT_APPROVE_DOCUMENT_CHECKLIST'] },
//   { name: 'Closed application', value: ['AGENT_CLOSE_CASE'] },
//   {
//     name: 'Status change - Pending',
//     value: ['AGENT_PENDING_CASE_FILE_CLIENT', 'AGENT_PENDING_CASE_FILE_FAMILY_MEMBER']
//   },
//   {
//     name: 'Status change - Approved',
//     value: ['AGENT_APPROVE_CASE_FILE_CLIENT', 'AGENT_APPROVE_CASE_FILE_FAMILY_MEMBER']
//   },
//   {
//     name: 'Status change - Under Review',
//     value: [
//       'AGENT_PREVIEW_CASE_FILE',
//       'AGENT_UNDER_REVIEW_CASE_FILE_CLIENT',
//       'AGENT_UNDER_REVIEW_CASE_FILE_FAMILY_MEMBER'
//     ]
//   },
//   {
//     name: 'Status change - Resubmit',
//     value: ['AGENT_REJECT_CASE_FILE_CLIENT', 'AGENT_REJECT_CASE_FILE_FAMILY_MEMBER']
//   },
//   { name: 'Note added', value: ['AGENT_ADD_NEW_CASE_NOTE'] }
// ];

export const useDaysRange: Array<{ name: string; value: string }> = [
  { name: 'activityLogDateDropDownAny', value: 'Date' },
  { name: 'activityLogDateDropDownToday', value: 'Today' },
  { name: 'activityLogDateDropDownYesterday', value: 'Yesterday' },
  { name: 'activityLogDateDropDownWeek', value: 'Past week' },
  { name: 'activityLogDateDropDownMonth', value: 'Past month' },
  { name: 'activityLogDateDropDownYear', value: 'Past year' }
];

// export const daysRange = ['Any', 'Today', 'Yesterday', 'Past week', 'Past month', 'Past year'];

export const ActivityLogFamilyMember = ({
  activityAction,
  ActivityValue,
  userData
}: {
  activityAction?: Constants['ActivityLogs'][0];
  ActivityValue?: string;
  userData?: UserBase;
}) => {
  const activityData = JSON.parse(ActivityValue ?? '{}');

  const listFamilyMembers = (caseFiles?: CaseFile[]) => {
    let result;
    const getFamilyMembers = caseFiles?.map?.((fm) => {
      const generatedFile = fm?.GeneratedFile;
      if (generatedFile?.UserFamilyMember) {
        return `${generatedFile?.UserFamilyMember?.FirstName} ${generatedFile?.UserFamilyMember?.LastName}`;
      } else {
        return `${userData?.FirstName} ${userData?.LastName}`;
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

  const getFamilyMemberFromGeneratedFile = (file: CaseFile) => {
    if (file.GeneratedFile) {
      if (file.GeneratedFile.UserFamilyMember) {
        return `${file.GeneratedFile.UserFamilyMember?.FirstName} ${file.GeneratedFile.UserFamilyMember?.LastName}`;
      } else {
        return `${userData?.FirstName} ${userData?.LastName}`;
      }
    }
  };

  const getFamilyMember = (familyMember: FamilyMember) => {
    if (familyMember?.FirstName && familyMember?.LastName) {
      return `${familyMember.FirstName} ${familyMember.LastName}`;
    } else {
      return `${userData?.FirstName} ${userData?.LastName}`;
    }
  };

  switch (activityAction) {
    // AGENT_PENDING_CASE_FILE_CLIENT,AGENT_PENDING_CASE_FILE_FAMILY_MEMBER
    // AGENT_UNDER_REVIEW_CASE_FILE_CLIENT,AGENT_UNDER_REVIEW_CASE_FILE_FAMILY_MEMBER
    // Keep it

    case 'AGENT_ACTIVATE_CASE': {
      return '---';
    }

    case 'AGENT_PENDING_CASE_FILE_FAMILY_MEMBER': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      if (activityData.oldValue) {
        return getFamilyMemberFromGeneratedFile(activityData.oldValue);
      } else {
        console.log('here');
        return 'Incorrect data';
      }
    }

    case 'AGENT_PENDING_CASE_FILE_CLIENT': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      if (activityData.oldValue) {
        return getFamilyMemberFromGeneratedFile(activityData.oldValue);
      } else {
        console.log('here');
        return 'Incorrect data';
      }
    }

    case 'AGENT_UNDER_REVIEW_CASE_FILE_CLIENT': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      if (activityData.oldValue) {
        return getFamilyMemberFromGeneratedFile(activityData.oldValue);
      } else {
        console.log('here');
        return 'Incorrect data';
      }
    }

    case 'AGENT_UNDER_REVIEW_CASE_FILE_FAMILY_MEMBER': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      if (activityData.oldValue) {
        return getFamilyMemberFromGeneratedFile(activityData.oldValue);
      } else {
        console.log('here');
        return 'Incorrect data';
      }
    }
    case 'CLIENT_ADD_CASE_FILES_SELF': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      if (activityData.newValue) {
        return listFamilyMembers(activityData.newValue);
      } else {
        console.log('here');
        return 'Incorrect data';
      }
    }

    // Keep it
    case 'CLIENT_ADD_CASE_FILES_FAMILY_MEMBER': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      if (activityData.newValue) {
        return listFamilyMembers(activityData.newValue);
      } else {
        console.log('here');
        return 'Incorrect data';
      }
    }

    // keep it
    case 'CLIENT_REMOVE_CASE_FILES_SELF': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      if (activityData.oldValue) {
        return listFamilyMembers([activityData.newValue]);
      } else {
        console.log('here');
        return 'Incorrect data';
      }
    }

    // keep it
    case 'AGENT_ADD_NEW_CASE_NOTE': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      return '---';
    }

    // keep it
    case 'AGENT_APPROVE_CASE_FILE_CLIENT': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      // return listFamilyMembers(activityData.oldValue);
      if (activityData.oldValue) {
        return getFamilyMemberFromGeneratedFile(activityData.oldValue);
      } else {
        console.log('here');
        return 'Incorrect data';
      }
    }

    // keep it
    case 'AGENT_REJECT_CASE_FILE_CLIENT': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      if (activityData.oldValue) {
        return getFamilyMemberFromGeneratedFile(activityData.oldValue);
      } else {
        console.log('here');
        return 'Incorrect data';
      }
    }

    // Keep it
    case 'AGENT_CLOSE_CASE': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      return `---`;
    }

    // keep it
    case 'AGENT_APPROVE_DOCUMENT_CHECKLIST': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      if (activityData.oldValue) {
        return '---';
      } else {
        console.log('here');
        return 'Incorrect data';
      }
    }

    // keep it
    case 'CLIENT_UPDATE_CASE_FILE_FAMILY_MEMBER': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      if (activityData.oldValue) {
        return listFamilyMembers([activityData.oldValue]);
      } else {
        console.log('here');
        return 'Incorrect data';
      }
    }

    // keep it
    case 'CLIENT_UPDATE_CASE_FILE_SELF': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      if (activityData.oldValue) {
        return listFamilyMembers([activityData.oldValue]);
      } else {
        console.log('here');
        return 'Incorrect data';
      }
    }

    // keep it
    case 'AGENT_UPDATE_CASE_FILE_FAMILY_MEMBER': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      if (activityData.oldValue) {
        return listFamilyMembers([activityData.oldValue]);
      } else {
        console.log('here');
        return 'Incorrect data';
      }
    }

    // keep it
    case 'AGENT_UPDATE_CASE_FILE_CLIENT': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      if (activityData.oldValue) {
        return listFamilyMembers([activityData.oldValue]);
      } else {
        console.log('here');
        return 'Incorrect data';
      }
    }

    // keep it
    case 'AGENT_DOWNLOAD_ALL_CASE_FILES': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      if (activityData.value) {
        return listFamilyMembers(activityData.value);
      } else {
        console.log('here');
        return 'Incorrect data';
      }
    }

    // keep it
    case 'AGENT_DOWNLOAD_CASE_FILE_CLIENT': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      if (userData) {
        return `${userData?.FirstName} ${userData?.LastName}`;
      } else {
        console.log('here');
        return 'Incorrect data';
      }
    }

    //keep it
    case 'AGENT_PREVIEW_CASE_FILE': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      // return 'Under review';
      if (activityData.value) {
        return getFamilyMemberFromGeneratedFile(activityData.value);
      } else {
        console.log('here');
        return 'Incorrect data';
      }
    }

    // keep it
    case 'AGENT_ADD_CASE_FILE_CLIENT': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      if (activityData.newValue) {
        return listFamilyMembers(activityData.newValue);
      } else {
        console.log('here');
        return 'Incorrect data';
      }
    }

    // keep it
    case 'AGENT_ADD_CASE_FILES_FAMILY_MEMBER': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      if (activityData.newValue) {
        return listFamilyMembers(activityData.newValue);
      } else {
        console.log('here');
        return 'Incorrect data';
      }
      // return listFamilyMembers(activityData.newValue);
    }

    // keep it
    case 'CLIENT_RESUBMIT_CASE_FILES_SELF': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      if (activityData.newValue) {
        return listFamilyMembers([activityData.newValue]);
      } else {
        console.log('here');
        return 'Incorrect data';
      }
      // return listFamilyMembers(activityData.newValue);
    }

    case 'CLIENT_RESUBMIT_CASE_FILES_FAMILY_MEMBER': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      if (activityData.newValue) {
        return listFamilyMembers([activityData.newValue]);
      } else {
        console.log('here');
        return 'Incorrect data';
      }
      // return listFamilyMembers(activityData.newValue);
    }

    // keep it
    case 'CLIENT_REMOVE_CASE_FILES_FAMILY_MEMBER': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      if (activityData.oldValue) {
        return listFamilyMembers(activityData.oldValue);
      } else {
        console.log('here');
        return 'Incorrect data';
      }
      // return listFamilyMembers(activityData.oldValue);
    }

    // keep it
    case 'AGENT_APPROVE_CASE_FILE_FAMILY_MEMBER': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      if (activityData.oldValue) {
        return getFamilyMemberFromGeneratedFile(activityData.oldValue);
      } else {
        console.log('here');
        return 'Incorrect data';
      }
    }

    // keep it
    case 'AGENT_REJECT_CASE_FILE_FAMILY_MEMBER': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      if (activityData.oldValue) {
        return getFamilyMemberFromGeneratedFile(activityData.oldValue);
      } else {
        console.log('here');
        return 'Incorrect data';
      }
    }
    // return getFamilyMemberFromGeneratedFile(activityData.oldValue);

    // keep it
    case 'AGENT_DOWNLOAD_CASE_FILE_FAMILY_MEMBER': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      if (activityData.familyMember) {
        return getFamilyMember(activityData.familyMember);
      } else {
        console.log('here');
        return 'Incorrect data';
      }
    }

    default:
      return 'Activity Log not handled';
  }
};

export const ActivityLogItemSlim = ({
  activityAction,
  // user,
  ActivityValue
  // userData
}: {
  activityAction?: Constants['ActivityLogs'][0];
  user?: string;
  ActivityValue?: string;
  userData?: UserBase;
}) => {
  // const { t } = useTranslation('activityLogs');
  const activityData = JSON.parse(ActivityValue ?? '{}');

  const listCaseFiles = (caseFiles?: CaseFile[]) => {
    const counts: Record<string, number> = {};
    caseFiles?.forEach?.((cf) => {
      const fileType = cf.GeneratedFile?.FileType;
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
        result += `(${counts[item]}) ${item}, `;
      } else {
        result += `${item}, `;
      }
    }

    result = result.slice(0, -2);
    return result;
  };

  const getFile = (caseFiles?: CaseFile) => {
    if (caseFiles?.GeneratedFile) {
      return caseFiles?.GeneratedFile.FileType;
    }
  };

  switch (activityAction) {
    case 'AGENT_ACTIVATE_CASE': {
      return 'Application was reset to status pending';
    }

    case 'AGENT_PENDING_CASE_FILE_FAMILY_MEMBER': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      if (activityData.oldValue) {
        return getFile(activityData.oldValue);
      } else {
        console.log('here');
        return 'Incorrect value';
      }
    }

    case 'AGENT_PENDING_CASE_FILE_CLIENT': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      if (activityData.oldValue) {
        return getFile(activityData.oldValue);
      } else {
        console.log('here');
        return 'Incorrect value';
      }
    }

    case 'AGENT_UNDER_REVIEW_CASE_FILE_CLIENT': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      if (activityData.oldValue) {
        return getFile(activityData.oldValue);
      } else {
        console.log('here');
        return 'Incorrect value';
      }
    }
    case 'AGENT_UNDER_REVIEW_CASE_FILE_FAMILY_MEMBER': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      if (activityData.oldValue) {
        return getFile(activityData.oldValue);
      } else {
        console.log('here');
        return 'Incorrect value';
      }
    }
    // Keep it
    case 'CLIENT_ADD_CASE_FILES_SELF': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      if (activityData.newValue) {
        return listCaseFiles(activityData.newValue);
      } else {
        console.log('here');
        return 'Incorrect value';
      }
    }

    // Keep it
    case 'CLIENT_ADD_CASE_FILES_FAMILY_MEMBER': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      if (activityData.newValue) {
        return listCaseFiles(activityData.newValue);
      } else {
        console.log('here');
        return 'Incorrect value';
      }
    }

    // keep it
    case 'CLIENT_REMOVE_CASE_FILES_SELF': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      if (activityData.oldValue) {
        return listCaseFiles(activityData.oldValue);
      } else {
        console.log('here');
        return 'Incorrect value';
      }
    }

    // keep it
    case 'AGENT_ADD_NEW_CASE_NOTE': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      return 'Added note';
    }

    // keep it
    case 'AGENT_APPROVE_CASE_FILE_CLIENT': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);

      if (activityData.oldValue) {
        return getFile(activityData.oldValue);
      } else {
        console.log('here');
        return 'Incorrect value';
      }
    }

    // keep it
    case 'AGENT_REJECT_CASE_FILE_CLIENT': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      if (activityData.oldValue) {
        return getFile(activityData.oldValue);
      } else {
        console.log('here');
        return 'Incorrect value';
      }
      // return getFile(activityData.oldValue);
    }

    // Keep it
    case 'AGENT_CLOSE_CASE': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      return 'Application completed';
      // return `${activityData.case?.CaseType} application was closed`;
    }

    // keep it
    case 'AGENT_APPROVE_DOCUMENT_CHECKLIST': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      if (activityData.oldValue) {
        return `Approved all ROI documents`;
      } else {
        console.log('here');
        return 'Incorrect value';
      }
    }

    // keep it
    case 'CLIENT_UPDATE_CASE_FILE_FAMILY_MEMBER': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      if (activityData.oldValue) {
        return listCaseFiles([activityData.oldValue]);
      } else {
        console.log('here');
        return 'Incorrect value';
      }
    }

    // keep it
    case 'CLIENT_UPDATE_CASE_FILE_SELF': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      if (activityData.oldValue) {
        return listCaseFiles([activityData.oldValue]);
      } else {
        console.log('here');
        return 'Incorrect value';
      }
      // return listCaseFiles([activityData.oldValue]);
    }

    // keep it
    case 'AGENT_UPDATE_CASE_FILE_FAMILY_MEMBER': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      if (activityData.oldValue) {
        return listCaseFiles([activityData.oldValue]);
      } else {
        console.log('here');
        return 'Incorrect value';
      }
      // return listCaseFiles([activityData.oldValue]);
    }

    // keep it
    case 'AGENT_UPDATE_CASE_FILE_CLIENT': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      if (activityData.oldValue) {
        return listCaseFiles(activityData.oldValue);
      } else {
        console.log('here');
        return 'Incorrect value';
      }
      // return listCaseFiles([activityData.oldValue]);
    }

    // keep it
    case 'AGENT_DOWNLOAD_ALL_CASE_FILES': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      if (activityData.value) {
        return listCaseFiles(activityData.value);
      } else {
        console.log('here');
        return 'Incorrect value';
      }
      // return listCaseFiles(activityData.value);
    }

    // keep it
    case 'AGENT_DOWNLOAD_CASE_FILE_CLIENT': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      if (activityData.value.FileType) {
        return activityData.value.FileType;
      } else {
        console.log('here');
        return 'Incorrect value';
      }
      // return getFile(activityData.oldValue);
    }

    //keep it
    case 'AGENT_PREVIEW_CASE_FILE': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      // return 'Under review';
      if (activityData.value) {
        return getFile(activityData.value);
      } else {
        console.log('here');
        return 'Incorrect value';
      }
      // return getFile(activityData.value);
    }

    // keep it
    case 'AGENT_ADD_CASE_FILE_CLIENT': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      if (activityData.newValue) {
        return listCaseFiles(activityData.newValue);
      } else {
        console.log('here');
        return 'Incorrect value';
      }
      // return listCaseFiles(activityData.newValue);
    }

    // keep it
    case 'AGENT_ADD_CASE_FILES_FAMILY_MEMBER': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      if (activityData.newValue) {
        return listCaseFiles(activityData.newValue);
      } else {
        console.log('here');
        return 'Incorrect value';
      }
      // return listCaseFiles(activityData.newValue);
    }

    // keep it
    case 'CLIENT_RESUBMIT_CASE_FILES_SELF': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      if (activityData.newValue) {
        return listCaseFiles([activityData.newValue]);
      } else {
        console.log('here');
        return 'Incorrect value';
      }
      // return listCaseFiles(activityData.newValue);
    }

    case 'CLIENT_RESUBMIT_CASE_FILES_FAMILY_MEMBER': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      if (activityData.newValue) {
        return listCaseFiles([activityData.newValue]);
      } else {
        console.log('here');
        return 'Incorrect value';
      }
      // return listCaseFiles(activityData.newValue);
    }

    // keep it
    case 'CLIENT_REMOVE_CASE_FILES_FAMILY_MEMBER': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      if (activityData.oldValue) {
        return listCaseFiles(activityData.oldValue);
      } else {
        console.log('here');
        return 'Incorrect value';
      }
      // return listCaseFiles(activityData.oldValue);
    }

    // keep it
    case 'AGENT_APPROVE_CASE_FILE_FAMILY_MEMBER': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      if (activityData.oldValue) {
        return getFile(activityData.oldValue);
      } else {
        console.log('here');
        return 'Incorrect value';
      }
      // return getFile(activityData.oldValue);
    }

    // keep it
    case 'AGENT_REJECT_CASE_FILE_FAMILY_MEMBER': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      if (activityData.oldValue) {
        return getFile(activityData.oldValue);
      } else {
        console.log('here');
        return 'Incorrect value';
      }
      // return getFile(activityData.oldValue);
    }

    // keep it
    case 'AGENT_DOWNLOAD_CASE_FILE_FAMILY_MEMBER': {
      console.log('action', activityAction);
      console.log('activityDATA', activityData);
      if (activityData.value) {
        return activityData.value.FileType;
      } else {
        console.log('here');
        return 'Incorrect value';
      }
      // return listCaseFiles(activityData.value);
    }

    default:
      return 'Activity Log not handled';
  }
};
