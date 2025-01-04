// TODO match with DB model

// import FileType from './FileType';

interface DocumentType {
  id: string;
  thumbnailUrl: string;
  title?: string;
  createdAt?: string;
  ownerUserId?: string;
  familyMember: string;
  documentUrl?: string;
  description: string;
  status?: string;
  files?: [];
}

export default DocumentType;
