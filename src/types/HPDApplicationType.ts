import FamilyMember from './FamilyMember';
import ChecklistGroupType from './ChecklistGroupType';

interface HPDApplicationType {
  id: string;
  status: string;
  createdAt: string;
  organization: string;
  ssn?: string;
  familyMembers: FamilyMember[];
  shelterName?: string;
  checklistItems?: ChecklistGroupType[];
}

export default HPDApplicationType;
