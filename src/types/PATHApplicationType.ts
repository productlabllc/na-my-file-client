// import FamilyMemberType from './FamilyMemberType';
import { FamilyMember, GetCaseResponse } from '@myfile/api-client';

import ChecklistGroupType from './ChecklistGroupType';
interface PATHApplicationType {
  id: string;
  createdAt: string;
  status: string;
  organization: string;
  caseNumber?: string;
  shelterName?: string;
  buildingUnit?: string;
  ssn?: string;
  caseAttributes?: GetCaseResponse['CaseAttributes'];
  familyMembers: FamilyMember[];
  checklistItems?: ChecklistGroupType[];
}

export default PATHApplicationType;
