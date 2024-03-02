// TODO match with DB model

import File from './File';

interface Document {
  id: string;
  thumbnailUrl: string;
  title: string;
  createdAt: string;
  ownerUserId: string;
  familyMemberUser: string;
  documentUrl: string;
  description: string;
  status?: string;
  files: File[];
}

export default Document;
