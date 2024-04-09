import FamilyMember from './FamilyMember';
import ChecklistGroupType from './ChecklistGroupType';
interface PATHApplicationType {
  id: string;
  createdAt: string;
  status: string;
  organization: string;
  caseNumber?: string;
  familyMembers: FamilyMember[];
  checklistItems?: ChecklistGroupType[];
}

export default PATHApplicationType;
