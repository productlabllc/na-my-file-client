import { StateCreator } from 'zustand';
import { StoreTypeIntersection } from './store';
// import PATHApplicationType from '../types/PATHApplicationType';
// import HPDApplicationType from '../types/HPDApplicationType';
// import ChecklistGroupType from '../types/ChecklistGroupType';
// import DocumentForApiCallType from '../types/DocumentForApiCallType';
// import DocumentType from '../types/DocumentType';
// import DocumentForApiCallType from '../types/DocumentForApiCallType';
import * as api from '@myfile/api-client';
// import { useApi } from '../utils/use-api';

type Thumbnail = {
  id: string;
  thumbnail: Blob | MediaSource | File;
};

export interface DocumentsStore {
  loading: boolean;
  uploadSpinner: boolean;
  isAsyncImageLoaded: boolean;
  isAsyncImageFinishedRefetching: boolean;
  isAsyncImageApiCaughtError: boolean;
  // ChecklistItemPage Uploaded documents
  checkListItemUploadedDocuments: api.UserFile[];
  setisAsyncImageApiCaughtError: (isError: boolean) => void;
  setIsAsyncImageLoaded: (isLoaded: boolean) => void;
  setisAsyncImageFinishedRefetching: (isFinishedFetching: boolean) => void;
  setUploadSpinner: (isLoading: boolean) => void;
  removeCheckListItemDocument: (documentId: string) => void;
  getDocumentsFromChecklistItems: () => api.UserFile[];
  addCheckListItemDocument: (document: api.UserFile) => void;
  setcheckListItemUploadedDocumentsToEmptyArray: () => void;

  // ClientDashboard
  userFiles: api.UserFile[];
  fetchUserFiles: () => Promise<void>;
  getUserFiles: () => api.UserFile[];
  downloadUserFile: () => Promise<void>;
  deleteUserFile: (fileId: api.DeleteUserFileRequest) => Promise<void>;
  // Old methods
  documents: api.UserFile[];
  getDocuments: () => api.UserFile[];
  setDocuments: (documents: api.UserFile[]) => void;

  // Merging
  mergeDocuments: () => void;

  // Local document thumbnail
  localThumbnail: Blob | MediaSource | File;
  setLocalThumbnail: (file: File | undefined) => void;
  removeLocalThumbnail: () => void;
  // List of local thumbnails
  thumbnails: Thumbnail[];
  addThumbnail: (id: string, file: File | undefined) => void;
  removeThumbnail: (id: string) => void;
}

export const createDocumentsSlice: StateCreator<StoreTypeIntersection, [], [], DocumentsStore> = (set, get) => ({
  loading: false,
  uploadSpinner: false,
  isAsyncImageFinishedRefetching: false,
  isAsyncImageLoaded: true,
  isAsyncImageApiCaughtError: false,
  userFiles: [],
  setisAsyncImageApiCaughtError: (isError: boolean) => set({ isAsyncImageApiCaughtError: isError }),
  setisAsyncImageFinishedRefetching: (isFinishedFetching: boolean) =>
    set({ isAsyncImageFinishedRefetching: isFinishedFetching }),
  setIsAsyncImageLoaded: (isLoaded) => set({ isAsyncImageLoaded: isLoaded }),
  setUploadSpinner: (isLoading) => set({ uploadSpinner: isLoading }),
  fetchUserFiles: async () => {
    try {
      set({ loading: true, error: null });
      const myFiles = await api.getMyFiles();
      set((state) => ({
        userFiles: [...state.userFiles, ...myFiles],
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  getUserFiles: () => get().userFiles,
  downloadUserFile: async () => {
    await api.getUserFileDownloadUrl({
      uploadVersionId: '',
      fileId: ''
    });
  },
  deleteUserFile: async (userFile: api.DeleteGeneratedFileByIdData) => {
    try {
      set({ loading: true, error: null });
      await api
        .deleteGeneratedFileById({
          id: userFile.id
        })
        .then(() => {
          set((state) => ({
            userFiles: state.userFiles.filter((file) => file !== userFile),
            loading: false
          }));
        });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  documents: [
    // {
    //   id: '231412333',
    //   title: 'Birth Certificate',
    //   createdAt: '01/13/2023',
    //   ownerUserId: 'Yuriy',
    //   thumbnailUrl: 'https://picsum.photos/id/743/1200/600',
    //   familyMember: 'Pavel',
    //   documentUrl: 'https://picsum.photos/id/743/1200/600',
    //   description: 'Hello from Pavel',
    //   status: 'Under review',
    //   files: [
    //     {
    //       id: '1',
    //       thumbnailUrl: 'https://picsum.photos/id/743/1200/600',
    //       name: 'Image 1',
    //       file: 'https://picsum.photos/id/743/1200/600',
    //       size: 4141514,
    //       type: 'image/jpeg'
    //     }
    //   ]
    // },
    // {
    //   id: '3144144142',
    //   title: 'Social Security Card',
    //   createdAt: '01/14/2023',
    //   ownerUserId: 'Yuriy',
    //   thumbnailUrl: 'https://www.nyc.gov/assets/opportunity/pdf/NYCgovPoverty2023_2020DATA_Digital_Final_d3.pdf',
    //   familyMember: 'Leo',
    //   documentUrl: 'https://www.nyc.gov/assets/opportunity/pdf/NYCgovPoverty2023_2020DATA_Digital_Final_d3.pdf',
    //   description: 'Let check description',
    //   status: 'Approved',
    //   files: [
    //     {
    //       id: '2',
    //       thumbnailUrl: 'https://www.nyc.gov/assets/opportunity/pdf/NYCgovPoverty2023_2020DATA_Digital_Final_d3.pdf',
    //       name: 'Image 1',
    //       file: 'https://www.nyc.gov/assets/opportunity/pdf/NYCgovPoverty2023_2020DATA_Digital_Final_d3.pdf',
    //       size: 4142444,
    //       type: 'image/jpeg'
    //     }
    //   ]
    // }
  ],
  checkListItemUploadedDocuments: [],
  getDocumentsFromChecklistItems: () => {
    return get().checkListItemUploadedDocuments;
  },
  removeCheckListItemDocument: (documentId: string) => {
    const filteredList = get().checkListItemUploadedDocuments.filter((doc) => doc.id !== documentId);
    set(() => ({
      checkListItemUploadedDocuments: [...filteredList]
    }));
  },
  addCheckListItemDocument: (document: api.UserFile) => {
    const updatedDoc: api.UserFile = {
      id: document.id,
      Title: document.Title,
      CreatedAt: '04/22/2024',
      ContentType: 'jpg',
      OriginalFilename: 'test'
      // FamilyMember: document.UserFamilyMember?.FirstName,
      // documentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      // description: '',
      // status: 'Under review',
      // files: []
    };
    set((state) => ({
      checkListItemUploadedDocuments: [updatedDoc, ...state.checkListItemUploadedDocuments]
    }));
  },
  mergeDocuments: () => {
    set((state) => ({
      documents: [...state.checkListItemUploadedDocuments, ...state.documents]
    }));
  },
  deleteDocumentFromChecklistAndDashboard: (document: api.UserFile) => {
    const filteredList: api.UserFile[] = get().documents.filter((doc) => {
      return doc.id !== document.id;
    });
    set(() => ({
      documents: [...filteredList]
    }));
  },
  setcheckListItemUploadedDocumentsToEmptyArray: () => {
    set(() => ({
      checkListItemUploadedDocuments: []
    }));
  },

  getDocuments: () => get().documents,
  setDocuments: (documents) => {
    set((state) => ({
      documents: [...documents, ...state.documents]
    }));
  },
  localThumbnail: new Blob(),
  setLocalThumbnail: (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const blob = new Blob([reader.result as ArrayBuffer], { type: file?.type });
      set(() => ({ localThumbnail: blob }));
    };
    if (file) {
      reader.readAsArrayBuffer(file);
    }
  },
  removeLocalThumbnail: () => {
    set(() => ({ localThumbnail: new Blob() }));
  },
  thumbnails: [],
  addThumbnail: (id, file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const blob = new Blob([reader.result as ArrayBuffer], { type: file?.type });
      const thumbnail = {
        id: id,
        thumbnail: blob
      };
      set((state) => ({ thumbnails: [thumbnail, ...state.thumbnails] }));
    };
    if (file) {
      reader.readAsArrayBuffer(file);
    }
  },
  removeThumbnail: (id) =>
    set((state) => ({
      thumbnails: state.thumbnails.filter((t) => t.id !== id)
    }))
});
