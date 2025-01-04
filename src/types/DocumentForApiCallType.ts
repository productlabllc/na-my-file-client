import FileType from './FileType';
interface DocumentForApiCallType {
  id: string;
  files?: FileType[];
  familyMember?: string;
  thumbnailUrl?: string;
  size?: number;
  documentType?: string;
}

export default DocumentForApiCallType;
