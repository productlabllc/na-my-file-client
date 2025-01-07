export type PartnerClaimDataType = {
  DATE_POSTED: string;
  GROUP_NUMBER: string;
  UNIQUE_USERID: number;
  CLAIM_ID: string;
  CLAIM_STATUS: string;
  COMPENSATED_CLAIM_COUNT: number;
  PHARMACY_NAME: string;
  PHARMACY_ADDRESS: string;
  PHARMACY_CITY: string;
  PHARMACY_STATE: string;
  PHARMACY_ZIP: string;
  BRAND_NAME_BN: string;
  BRAND_GENERIC_FLAG: string;
  DOSEAGE_FORM_DESCRIPTION_DOSE: string;
  DRUG_STRENGTH_DESCRIPTION_STR: string;
  QUANTITY: string;
  PACKAGE_DESCRIPTION_PD: string;
  MEMBER_GENDER: string;
  MEMBER_AGE_RANGE: string;
  RETAIL_AMOUNT_SUBMITTED: string;
  MEMBER_COPAY: string; // was missing somehow!
  PLAN_PAID_AMOUNT: string;
  savingsPct: string;
  claimCommission: number;
};

export enum PARTNER_ROLES {
  PARTNER_ACCOUNT_PRIMARY_MEMBER = 'PARTNER_ACCOUNT_PRIMARY_MEMBER',
  PARTNER_ACCOUNT_ADMIN = 'PARTNER_ACCOUNT_ADMIN',
  PARTNER_ACCOUNT_MEMBER = 'PARTNER_ACCOUNT_MEMBER'
}

export interface UserInfo {
  email: string;
  firstName: string;
  lastName: string;
}

export enum USER_STATUS {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  ARCHIVED = 'ARCHIVED'
}

export enum ROLESMAP {
  PARTNER_ACCOUNT_ADMIN = 'Admin',
  PARTNER_ACCOUNT_MEMBER = 'Standard',
  PARTNER_ACCOUNT_PRIMARY_MEMBER = 'Primary'
}

export enum LOCAL_STORAGE_KEYS {
  IMPERSONATION_CONTEXT = 'ImpersonationContext',
  SEARCH_FILTER = 'SearchFilter'
}

export type SearchFilterType = {
  groupNumberFilter?: Array<string>;
};

export type ImpersonationContextDataType = {
  partnerId?: string;
  partnerRole?: string;
};

export type PartnerGroupNumberHierarchyType = {
  directGroupNumbers: Array<any>;
  primaryGroupNumbers: Array<any>;
  secondaryGroupNumbers: Array<any>;
};
