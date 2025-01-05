// import FamilyMemberType from './FamilyMemberType';
import { FamilyMember, GetCaseResponse } from '@namyfile/api-client';

import ChecklistGroupType from './ChecklistGroupType';

interface HPDApplicationType {
  id: string;
  status: string;
  createdAt: string;
  organization: string;
  ssn?: string;
  caseAttributes?: GetCaseResponse['CaseAttributes'];
  familyMembers: FamilyMember[];
  shelterName?: string;
  buildingUnit?: string;
  checklistItems?: ChecklistGroupType[];
}

export default HPDApplicationType;
