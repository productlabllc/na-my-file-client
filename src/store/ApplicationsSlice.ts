import { StateCreator } from 'zustand';
import { StoreTypeIntersection } from './store';
import PATHApplicationType from '../types/PATHApplicationType';
import HPDApplicationType from '../types/HPDApplicationType';
import ChecklistGroupType from '../types/ChecklistGroupType';

/*
  This slice handles the current user session.
*/

export interface ApplicationsStore {
  applicationData: (PATHApplicationType | HPDApplicationType)[];
  addAppicationPATH: (applicationPATH: PATHApplicationType) => void;
  isApplicationOpenWithStatusActive: () => boolean;
  getApplications: () => (PATHApplicationType | HPDApplicationType)[];
  addAppicationHPD: (applicationHPD: HPDApplicationType) => void;
  getAllCheckListItems: (application: string) => ChecklistGroupType[] | [];
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

const checklistItems = [
  {
    id: '1',
    category: 'Identification',
    typeOfDocument: [
      {
        id: '1-doc',
        docType: 'ROI',
        title: 'Signed universal ROI for the family/household',
        info: 'Read info',
        status: '',
        documents: []
      },
      {
        id: '2-doc',
        docType: 'Birth cetificate',
        title: 'Birth Certificates',
        info: 'Read info',
        status: '',
        documents: []
      },
      {
        id: '3-doc',
        docType: 'ID',
        title: 'Picture IDs',
        info: 'Read info',
        status: '',
        documents: []
      }
    ]
  },
  {
    id: '2',
    category: 'If applicable',
    typeOfDocument: [
      {
        id: '1-doc',
        docType: 'ROI',
        title: 'Signed universal ROI for the family/household',
        info: 'Read info',
        status: '',
        documents: []
      },
      {
        id: '2-doc',
        docType: 'Birth cetificate',
        title: 'Birth Certificates',
        info: 'Read info',
        status: '',
        documents: []
      },
      {
        id: '3-doc',
        docType: 'ID',
        title: 'Picture IDs',
        info: 'Read info',
        status: '',
        documents: []
      }
    ]
  }
];

export const createApplicationSlice: StateCreator<
  StoreTypeIntersection,
  [],
  [],
  ApplicationsStore
> = (set, get) => ({
  applicationData: [
    {
      id: '1',
      status: 'Closed',
      organization: 'PATH',
      createdAt: '02/02/2024',
      caseNumber: '241415',
      familyMembers: [
        {
          id: '1414',
          firstName: 'Dane',
          lastName: 'Joe',
          dateOfBirth: '01/05/1929',
          relationship: 'Father'
        }
      ],
      checklistItems: [...checklistItems]
    }
    // {
    //   id: '2',
    //   status: 'Active',
    //   organization: 'HPD',
    //   ssn: '241415',
    //   createdAt: '02/04/2024',
    //   shelterName: 'Shelter',
    //   familyMembers: [
    //     {
    //       id: '14',
    //       firstName: 'John',
    //       lastName: 'Bere',
    //       dateOfBirth: '01/05/1995',
    //       relationship: 'Son'
    //     }
    //   ]
    // }
  ],
  isApplicationOpenWithStatusActive: () => {
    const application = get().applicationData.find(
      (application) => application.status === 'Active'
    );

    return Boolean(application);
  },

  addAppicationPATH: (applicationPATH: PATHApplicationType) => {
    set((state) => ({
      applicationData: [
        { ...applicationPATH, checklistItems },
        ...state.applicationData
      ]
    }));
  },
  addAppicationHPD: (applicationHPD: HPDApplicationType) => {
    set((state) => ({
      applicationData: [
        { ...applicationHPD, checklistItems },
        ...state.applicationData
      ]
    }));
  },
  getAllCheckListItems: (applicationId: string) => {
    const foundApplication = get().applicationData.find(
      (newApplication) => applicationId === newApplication.id
    );
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
