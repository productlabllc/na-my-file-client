import { RuleSetValue, RuleSetValueItem } from '../types/RulesetValueType';

export const rulesetsFileTypeExtractor = (rulesets: string) => {
  const fileTypes: string[] = JSON.parse(rulesets ?? '[]')
    .filter((rule: { field: string }) => rule.field === 'fileType')
    .map((ele: RuleSetValue) => ele!.value)
    .flat()
    .map((fileType: RuleSetValueItem) => fileType.name);

  return fileTypes;
};
