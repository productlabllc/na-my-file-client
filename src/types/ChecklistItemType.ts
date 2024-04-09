import Document from './Document';
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
  documents: Document[];
}

export default ChecklistItemType;
