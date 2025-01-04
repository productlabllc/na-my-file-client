export const AgentActivityActionType = (activityAction: string) => {
  switch (activityAction) {
    case 'AGENT_CLOSE_CASE': {
      return 'Application status change - Completed';
    }

    case 'AGENT_ACTIVATE_CASE': {
      return 'Application status change - Pending';
    }

    case 'CLIENT_ADD_CASE_FILES_SELF': {
      return 'Uploaded document';
    }

    // Missing content from Neyva
    // Added content by Yuriy
    case 'AGENT_ADD_CASE_FILE_CLIENT': {
      return 'Uploaded document';
    }

    case 'CLIENT_ADD_CASE_FILES_FAMILY_MEMBER': {
      return 'Uploaded document';
    }

    // Missing content from Neyva
    // Added content by Yuriy
    case 'AGENT_ADD_CASE_FILES_FAMILY_MEMBER': {
      return 'Uploaded document';
    }

    case 'AGENT_PREVIEW_CASE_FILE': {
      return 'Document status change - Under review';
    }

    case 'AGENT_PENDING_CASE_FILE_FAMILY_MEMBER': {
      return 'Document status change - Pending';
    }

    case 'AGENT_PENDING_CASE_FILE_CLIENT': {
      return 'Document status change - Pending';
    }

    case 'AGENT_UNDER_REVIEW_CASE_FILE_CLIENT': {
      return 'Document status change - Under review';
    }

    case 'AGENT_UNDER_REVIEW_CASE_FILE_FAMILY_MEMBER': {
      return 'Document status change - Under review';
    }

    case 'CLIENT_REMOVE_CASE_FILES_SELF': {
      return 'Deleted document';
    }

    case 'AGENT_APPROVE_DOCUMENT_CHECKLIST': {
      return 'Approved checklist';
    }

    // Missing content from Neyva
    // Added content by Yuriy
    case 'CLIENT_REMOVE_CASE_FILES_FAMILY_MEMBER': {
      return 'Deleted document';
    }

    case 'CLIENT_UPDATE_CASE_FILE_SELF': {
      return 'Updated document';
    }

    case 'CLIENT_UPDATE_CASE_FILE_FAMILY_MEMBER': {
      return 'Updated document';
    }

    // UI doesn't have functionality to re-submit document for user
    case 'AGENT_UPDATE_CASE_FILE_FAMILY_MEMBER': {
      return 'Resubmitted document';
    }

    // UI doesn't have functionality to re-submit document for user
    case 'AGENT_UPDATE_CASE_FILE_CLIENT': {
      return 'Resubmitted document';
    }

    case 'AGENT_DOWNLOAD_CASE_FILE_CLIENT': {
      return 'Downloaded document';
    }

    case 'AGENT_DOWNLOAD_CASE_FILE_FAMILY_MEMBER': {
      return 'Downloaded document';
    }

    case 'AGENT_DOWNLOAD_ALL_CASE_FILES': {
      return 'Downloaded all files from checklist';
    }

    case 'AGENT_APPROVE_CASE_FILE_CLIENT': {
      return 'Document status change - Approved';
    }

    case 'AGENT_APPROVE_CASE_FILE_FAMILY_MEMBER': {
      return 'Document status change - Approved';
    }

    case 'AGENT_REJECT_CASE_FILE_CLIENT': {
      return 'Document status change - Resubmit';
    }

    case 'AGENT_REJECT_CASE_FILE_FAMILY_MEMBER': {
      return 'Document status change - Resubmit';
    }

    case 'AGENT_ADD_NEW_CASE_NOTE': {
      return 'Added note';
    }

    case 'AGENT_EDIT_CASE_NOTE': {
      return 'Edited note';
    }

    // Missing in ActivityLogItemSlim
    case 'CLIENT_RESUBMIT_CASE_FILES_FAMILY_MEMBER': {
      return 'Resubmitted document';
    }

    case 'CLIENT_RESUBMIT_CASE_FILES_SELF': {
      return 'Resubmitted document';
    }
  }
};
