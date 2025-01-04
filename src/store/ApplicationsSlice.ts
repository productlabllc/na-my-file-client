import { StateCreator } from 'zustand';
import { produce } from 'immer';
import { StoreTypeIntersection } from './store';
import PATHApplicationType from '../types/PATHApplicationType';
import HPDApplicationType from '../types/HPDApplicationType';
import ChecklistGroupType from '../types/ChecklistGroupType';
// import DocumentForApiCallType from '../types/DocumentForApiCallType';
// import DocumentType from '../types/DocumentType';
import { GeneratedUserFile, CaseCriterion } from '@namyfile/api-client';

/*
  This slice handles the current user session.
*/

export interface ApplicationsStore {
  selectedForUploadChecklistItem: CaseCriterion | undefined;
  setSelectedForUploadChecklistItem: (caseCriterion: CaseCriterion | undefined) => void;
  getSelectedForUploadChecklistItem: () => CaseCriterion | undefined;

  applicationData: (PATHApplicationType | HPDApplicationType)[];
  beforeSubmittedListOfDocuments: GeneratedUserFile[];
  getApplications: () => (PATHApplicationType | HPDApplicationType)[];
  getAllCheckListItems: (application: string) => ChecklistGroupType[] | [];
  getDocumentsBeforeSubmission: () => GeneratedUserFile[];
  getSubmittedDocuments: (applicationId: string, checkListItemId: string) => GeneratedUserFile[] | undefined;
  setListBeforeSubmitionToEmptyState: () => void;
  addAppicationPATH: (applicationPATH: PATHApplicationType) => void;
  addDocumentsToBeforeSubmittedList: (document: GeneratedUserFile) => void;
  addAppicationHPD: (applicationHPD: HPDApplicationType) => void;
  addSelectedDocumentsBeforeSubmittedList: (documents: GeneratedUserFile[]) => void;
  submitDocumentsToApplicationChecklistItem: (
    applicationId: string,
    checklistItemId: string,
    documents: GeneratedUserFile[]
  ) => void;
  removeDocumentFromTheListBeforeSubmit: (documentId: string) => void;
  deleteDocumentFromSubmittedDocuments: (applicationId: string, checklistItemId: string, documentId: string) => void;
  isApplicationOpenWithStatusActive: () => boolean;

  //   isAddFamilyFormOpened: boolean;
  //   isUpdateFamilyFormOpened: boolean;

  //   getFamilyMembers: () => FamilyMember[];
  //   addFamilyMember: (familyMember: FamilyMember) => void;
  //   removeFamilyMember: (familyMember: string) => void;
  //   updateFamilyMember: (familyMember: FamilyMember) => void;
  //   setIsAddFamilyFormOpened: (isOpened: boolean) => void;
  //   getIsAddFamilyFormOpened: () => boolean;
  //   setIsUpdateFamilyFormOpened: (isOpened: boolean) => void;
  //   getIsUpdateFamilyFormOpened: () => boolean;
}

const checklistItems: Array<any> = [];

export const createApplicationSlice: StateCreator<StoreTypeIntersection, [], [], ApplicationsStore> = (set, get) => ({
  selectedForUploadChecklistItem: undefined,
  setSelectedForUploadChecklistItem: (caseCriterion) => {
    set(() => ({
      selectedForUploadChecklistItem: caseCriterion
    }));
  },
  getSelectedForUploadChecklistItem: () => get().selectedForUploadChecklistItem,
  applicationData: [],
  beforeSubmittedListOfDocuments: [],
  removeDocumentFromTheListBeforeSubmit: (documentId: string) => {
    set((state) => ({
      beforeSubmittedListOfDocuments: [
        ...state.beforeSubmittedListOfDocuments.filter((document) => documentId !== document.id)
      ]
    }));
  },
  submitDocumentsToApplicationChecklistItem: (
    applicationId: string,
    checkListItemId: string,
    documents: GeneratedUserFile[]
  ) => {
    // console.log(applicationId, checkListItemId);
    const application = get().applicationData.findIndex((application) => application.id === applicationId);

    const groupOfListItems = checklistItems?.findIndex((group) =>
      group.typeOfDocument.find((checklistItem: any) => {
        if (checklistItem.id === checkListItemId) {
          return group;
        }
      })
    );
    const groupOfListItemsIndex = checklistItems?.findIndex((group) =>
      group.typeOfDocument.find((checklistItem: any) => {
        if (checklistItem.id === checkListItemId) {
          return group;
        }
      })
    );
    const checkListItem = checklistItems[groupOfListItemsIndex].typeOfDocument.findIndex(
      (checklistItem: any) => checklistItem.id === checkListItemId
    );

    return set(
      produce((state) => {
        state.applicationData[application].checklistItems[groupOfListItems].typeOfDocument[checkListItem].documents = [
          ...documents,
          ...state.applicationData[application].checklistItems[groupOfListItems].typeOfDocument[checkListItem].documents
        ];
      })
    );
  },
  setListBeforeSubmitionToEmptyState: () => {
    set(() => ({
      beforeSubmittedListOfDocuments: []
    }));
  },
  getSubmittedDocuments: (applicationId: string, checklistItemId: string) => {
    const application = get().applicationData.find((application) => {
      application.id === applicationId;
    });
    const checklistItemsGroup = application?.checklistItems?.find((group) => {
      return group.typeOfDocument.find((checkListItem) => checkListItem.id === checklistItemId);
    });

    const checklistItem = checklistItemsGroup?.typeOfDocument.find(
      (checkListItemSearch) => checkListItemSearch.id === checklistItemId
    );
    if (checklistItem?.documents) return checklistItem?.documents;
  },
  deleteDocumentFromSubmittedDocuments: (applicationId: string, checklistItemId: string, documentId: string) => {
    const application = get().applicationData.findIndex((application) => application.id === applicationId);

    const groupOfListItems = checklistItems?.findIndex((group) =>
      group.typeOfDocument.find((checklistItem: any) => {
        console.log(checklistItemId, checklistItem.id);
        if (checklistItem.id === checklistItemId) {
          return group;
        }
      })
    );
    const groupOfListItemsIndex = checklistItems?.findIndex((group) =>
      group.typeOfDocument.find((checklistItem: any) => {
        console.log(checklistItemId, checklistItem.id);
        if (checklistItem.id === checklistItemId) {
          return group;
        }
      })
    );
    const checkListItem = checklistItems[groupOfListItemsIndex].typeOfDocument.findIndex(
      (checklistItem: any) => checklistItem.id === checklistItemId
    );
    return set(
      produce((state) => {
        state.applicationData[application].checklistItems[groupOfListItems].typeOfDocument[checkListItem].documents = [
          ...state.applicationData[application].checklistItems[groupOfListItems].typeOfDocument[
            checkListItem
          ].documents.filter((document: GeneratedUserFile) => document.id !== documentId)
        ];
      })
    );
  },
  addDocumentsToBeforeSubmittedList: (document: GeneratedUserFile) => {
    // const updatedDoc = {
    //   id: document.id,
    //   thumbnailUrl: '',
    //   title: document.Title,
    //   ownerUserId: '12414',
    //   createdAt: '04/22/2024',
    //   familyMember: document?.FromUserFiles?.[0]?.UserFamilyMember?.FirstName,
    //   documentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    // };
    set((state) => ({
      beforeSubmittedListOfDocuments: [document, ...state.beforeSubmittedListOfDocuments]
    }));
  },
  addSelectedDocumentsBeforeSubmittedList: (documents: GeneratedUserFile[]) => {
    set((state) => ({
      beforeSubmittedListOfDocuments: [...documents, ...state.beforeSubmittedListOfDocuments]
    }));
  },
  getDocumentsBeforeSubmission: () => get().beforeSubmittedListOfDocuments,
  isApplicationOpenWithStatusActive: () => {
    const application = get().applicationData.find((application) => application.status === 'Active');

    return Boolean(application);
  },

  addAppicationPATH: (applicationPATH: PATHApplicationType) => {
    set((state) => ({
      applicationData: [{ ...applicationPATH, checklistItems }, ...state.applicationData]
    }));
  },
  addAppicationHPD: (applicationHPD: HPDApplicationType) => {
    set((state) => ({
      applicationData: [{ ...applicationHPD, checklistItems }, ...state.applicationData]
    }));
  },
  getAllCheckListItems: (applicationId: string) => {
    const foundApplication = get().applicationData.find((newApplication) => applicationId === newApplication.id);
    console.log(get().applicationData);
    console.log(foundApplication);
    if (foundApplication?.checklistItems) {
      const foundChecklistItems = foundApplication?.checklistItems;
      return foundChecklistItems;
    }
    return [];
  },
  getApplications: () => get().applicationData

  //   familyData: [],
  //   isAddFamilyFormOpened: false,
  //   isUpdateFamilyFormOpened: false,
  //   setIsUpdateFamilyFormOpened: (isOpened: boolean) =>
  //     set({
  //       isUpdateFamilyFormOpened: isOpened
  //     }),
  //   getIsUpdateFamilyFormOpened: () => get().isUpdateFamilyFormOpened,
  //   getIsAddFamilyFormOpened: () => get().isAddFamilyFormOpened,
  //   setIsAddFamilyFormOpened: (isOpened: boolean) =>
  //     set({ isAddFamilyFormOpened: isOpened }),
  //   addFamilyMember: (member: FamilyMember) => {
  //     set((state) => ({ familyData: [member, ...state.familyData] }));
  //   },
  //   removeFamilyMember: (memberId: string) => {
  //     set((state) => ({
  //       familyData: state.familyData.filter((member) => member.id !== memberId)
  //     }));
  //   },
  //   getFamilyMembers: () => {
  //     // console.log(get().familyData);
  //     return get().familyData;
  //   },
  //   updateFamilyMember: (member: FamilyMember) => {
  //     // console.log(member);

  //     set((state) => {
  //       return {
  //         familyData: state.familyData.map((memberData) =>
  //           memberData.id === member.id
  //             ? { ...memberData, ...member }
  //             : memberData
  //         )
  //       };
  //     });
  //   }
});
