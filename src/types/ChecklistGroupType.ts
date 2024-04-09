import ChecklistItemType from './ChecklistItemType';

interface ChecklistGroupType {
  id: string;
  category: string;
  typeOfDocument: ChecklistItemType[];
}

export default ChecklistGroupType;
