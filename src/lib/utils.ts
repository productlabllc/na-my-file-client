import { LOCAL_STORAGE_KEYS, SearchFilterType, ImpersonationContextDataType } from './types-and-interfaces';

export const isValidEmail = (email: string) => /^[\w-\.\+]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

// 1 Capital Letter, 1 Number, 1 Special Character from the following !@#$%^&*()[]_-+=, Must be at least 10 characters in length
export const isValidPassword = (password: string) =>
  /[A-Z]{1,}/.test(password) &&
  /[0-9]{1,}/.test(password) &&
  /[!@#$%^&*()\[\]_\-\+=]{1,}/.test(password) &&
  /.{10,}/.test(password);

export const getCurrentMonthDateRange = () => {
  const d = new Date();
  return {
    firstDayOfPreviousMonthUTC:
      d.getUTCMonth() === 0
        ? `${d.getUTCFullYear() - 1}-12-01`
        : `${d.getUTCFullYear()}-${d.getUTCMonth().toString().padStart(2, '0')}-01`,
    firstDayOfCurrentMonthUTC: `${d.getUTCFullYear()}-${(d.getUTCMonth() + 1).toString().padStart(2, '0')}-01`,
    currentDayOfCurrentMonthUTC: `${d.getUTCFullYear()}-${(d.getUTCMonth() + 1).toString().padStart(2, '0')}-${d
      .getUTCDate()
      .toString()
      .padStart(2, '0')}`,
    lessThanTomorrowUTC: `${d.getUTCFullYear()}-${(d.getUTCMonth() + 1).toString().padStart(2, '0')}-${(
      d.getUTCDate() + 1
    )
      .toString()
      .padStart(2, '0')}`,
  };
};

export const getImpersonationContextFromLocalStorage = (): ImpersonationContextDataType | null => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEYS.IMPERSONATION_CONTEXT);
  return !!data ? (JSON.parse(data) as ImpersonationContextDataType) : null;
};

export const getSearchFilterFromLocalStorage = (): SearchFilterType | null => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEYS.SEARCH_FILTER);
  return !!data ? (JSON.parse(data) as SearchFilterType) : null;
};

// export const formatDate = (date: Date) => {
//   if (!date) return new Date().toLocaleString();

//   // Get the timezone from browser using native methods
//   const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
//   const dateTmp = Date.parse(date.toLocaleString());

//   const localDate = convertToLocalTime(dateTmp, {
//     timeZone: timezone,
//   });

//   return format(localDate, DEFAULT_DATE_FORMAT);
// };

export const formatClaimsValuesMap = {
  DATE_POSTED: (value: string, row: any) => new Date(value.replace(/Z$/, '')).toLocaleDateString(),
  RETAIL_AMOUNT_SUBMITTED: (value: string, row: any) =>
    Intl.NumberFormat(navigator.language, {
      style: 'currency',
      currency: 'USD',
    }).format(Number(value)),
  MEMBER_COPAY: (value: number, row: any) =>
    Intl.NumberFormat(navigator.language, {
      style: 'currency',
      currency: 'USD',
    }).format(value),
  claimCommission: (value: number, row: any) =>
    Intl.NumberFormat(navigator.language, {
      style: 'currency',
      currency: 'USD',
    }).format(row.COMPENSATED_CLAIM_COUNT * value),
  savingsPct: (value: number, row: any) =>
    row.COMPENSATED_CLAIM_COUNT <= 0 ? '-' : Intl.NumberFormat(navigator.language, { style: 'percent' }).format(value),
};

export const formatClaimsKeysMap = {
  UNIQUE_USERID: 'Unique User ID',
  BRAND_NAME_BN: 'Drug Name',
  BRAND_GENERIC_FLAG: 'Brand/Generic',
  COMPENSATED_CLAIM_COUNT: 'Paid Claim Count',
  DOSEAGE_FORM_DESCRIPTION_DOSE: 'Doseage Form',
  DRUG_STRENGTH_DESCRIPTION_STR: 'Drug Strength',
  PACKAGE_DESCRIPTION_PD: 'Package',
  MEMBER_GENDER: 'Gender',
  MEMBER_AGE_RANGE: 'Age Range',
  RETAIL_AMOUNT_SUBMITTED: 'Retail Amount',
  CLAIM_ID: 'Claim ID',
  MEMBER_COPAY: 'Paid Amount',
  // claimCommission: 'Commission', // currently hidden, as requested by Dan
  savingsPct: 'Savings %',
};

export const formatTeamMembersKeysMap = {
  GivenName: 'First Name',
  MemberType: 'Member Type',
  FamilyName: 'Last Name',
};

export const formatPrimaryReferredAccountsKeysMap = {
  GivenName: 'First Name',
  MemberType: 'Member Type',
  FamilyName: 'Last Name',
};

export const formatPlatformMessageValuesMap = {
  IsGlobalMessage: (value: number, row: any) => (value ? 'YES' : 'NO'),
  ExpirationTimestamp: (value: number, row: any) => (value ? new Date(value).toLocaleDateString() : 'No Expiration'),
  CreatedAt: (value: number, row: any) => new Date(value).toLocaleDateString(),
  UpdatedAt: (value: number, row: any) => new Date(value).toLocaleDateString(),
};

export const formatPlatformMessageKeysMap = {
  ExpirationTimestamp: 'Expiration',
  IsGlobalMessage: 'Global Message?',
  CreatedAt: 'Date Created',
  UpdatedAt: 'Last Updated',
};

export const formatReferredAccountValuesMap = {
  CommissionFee: (value: string, row: any) =>
    Intl.NumberFormat(navigator.language, {
      style: 'currency',
      currency: 'USD',
    }).format(Number(value)),
  CommissionFee_PrimaryReferer: (value: string, row: any) =>
    Intl.NumberFormat(navigator.language, {
      style: 'currency',
      currency: 'USD',
    }).format(Number(value)),
};

export const formatReferredAccountKeysMap = {
  GroupNumberValue: 'Group Number',
  CommissionFee: 'Their Commission',
  CommissionFee_PrimaryReferer: 'Your Commission',
};

export const formatPartnerAccountKeysMap = {
  CommonName: 'Partner Name',
  Phone: 'Phone',
  Comments: 'Comments',
};

export const getUserTitle = (platformUser: any) => {
  let title = 'Partner Member';
  if (
    platformUser &&
    platformUser.PartnerUserRoles &&
    platformUser.PartnerUserRoles.some((role: any) =>
      ['PARTNER_ACCOUNT_PRIMARY_MEMBER', 'PARTNER_ACCOUNT_ADMIN'].includes(role.RoleName),
    )
  ) {
    title = 'Primary Member';
  }
  return title;
};
