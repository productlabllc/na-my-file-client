// import DocumentType from './DocumentType';
import { GeneratedUserFile } from '@namyfile/api-client';

interface ChecklistItemType {
  // {
  //     id: '1-doc',
  //     docType: 'ROI',
  //     description: 'Signed universal ROI for the family/household',
  //     info: 'Read info',
  //     status: '',
  //     documents: []
  //   },
  id: string;
  docType: string;
  title: string;
  info: string;
  status: string | null;
  documents: GeneratedUserFile[];
}

export default ChecklistItemType;
