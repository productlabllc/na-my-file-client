import {
  ImpersonationContextDataType,
  LOCAL_STORAGE_KEYS,
  // PartnerClaimDataType,
  USER_STATUS
} from './lib/types-and-interfaces';
import { getSession } from './pages/auth/Account';

const { VITE_API_ENDPOINT = '' } = import.meta.env;

const getImpersonationContext = () => {
  const lsImpersonationContextData = localStorage.getItem(
    LOCAL_STORAGE_KEYS.IMPERSONATION_CONTEXT
  );
  const impersonationContext = !!lsImpersonationContextData
    ? (JSON.parse(lsImpersonationContextData) as ImpersonationContextDataType)
    : undefined;
  console.log(
    `lsImpersonationContextData: ${JSON.stringify(lsImpersonationContextData)}`
  );
  console.log(`impersonationContext: ${JSON.stringify(impersonationContext)}`);
  return impersonationContext;
};

// const getImpersonationPartnerId = () => {
//   const { partnerId } = getImpersonationContext() || {};
//   return partnerId;
// };

const getImpersonationContextHeaders = (): Record<string, string> => {
  const impersonationContext = getImpersonationContext();
  return !!impersonationContext
    ? {
        'x-ddn-impersonation': `${impersonationContext.partnerId},${impersonationContext.partnerRole}`
      }
    : {};
};

const getAuthenticatedBaseHeaders = async (contentType?: string) => ({
  'Content-Type': contentType || 'application/json',
  Authorization: `Bearer ${await getUserToken()}`,
  ...getImpersonationContextHeaders()
});

const getUserToken = async () => {
  const userSession = await getSession();
  console.log(`User Token: ${userSession.idToken.jwtToken}`);
  return userSession.idToken.jwtToken;
};

export const getPlatformUserProfile = async () => {
  const {
    idToken: {
      payload: {
        'cognito:username': cognitoUserId,
        nickname: registrationCode,
        email
      }
    }
  } = await getSession();
  let response: Response;
  try {
    response = await fetch(`${VITE_API_ENDPOINT}/user/${cognitoUserId}`, {
      method: 'GET',
      headers: {
        ...(await getAuthenticatedBaseHeaders())
      }
    });
    let data = { status: response.status };
    if (response.ok) {
      data = { ...data, ...(await response.json()) };
    }
    return data as any;
  } catch (error) {
    console.log(`Response: ${JSON.stringify(response!, null, 2)}`);
    if (response!.status === 404 || response!.status === 500) {
      const { PartnerAccountId } = (await validateRegistrationData({
        registrationCode,
        email
      })) as any;
      return confirmPartnerUserRegistration({
        email,
        partnerId: PartnerAccountId
        // partnerId: getImpersonationPartnerId() || PartnerAccountId
      });
    }
  }
};

export type PlatformUserProfileType = {
  avatarId?: string;
  givenName?: string;
  familyName?: string;
  email?: string;
  themeMode?: string;
};

export const updatePlatformUserProfile = async (
  profile: PlatformUserProfileType
) => {
  const {
    idToken: {
      payload: { 'cognito:username': cognitoUserId }
    }
  } = await getSession();
  const response = await fetch(`${VITE_API_ENDPOINT}/user/${cognitoUserId}`, {
    method: 'PATCH',
    headers: {
      ...(await getAuthenticatedBaseHeaders())
    },
    body: JSON.stringify(profile)
  });
  let data = { status: response.status };
  if (response.ok) {
    data = { ...data, ...(await response.json()) };
  }
  return data as {};
};

export const getIngestionStatus = async () => {
  const response = await fetch(
    `${VITE_API_ENDPOINT}/platform/ingestion-status`,
    {
      method: 'GET',
      headers: {
        ...(await getAuthenticatedBaseHeaders())
      }
    }
  );
  let data = { status: response.status };
  if (response.ok) {
    data = { ...data, ...(await response.json()) };
  }
  return data as any;
};

export const getPartnerInfo = async (partnerId: string) => {
  const response = await fetch(
    // `${VITE_API_ENDPOINT}/partner/${getImpersonationPartnerId() || partnerId}`,
    `${VITE_API_ENDPOINT}/partner/${partnerId}`,
    {
      method: 'GET',
      headers: {
        ...(await getAuthenticatedBaseHeaders())
      }
    }
  );
  let data = { status: response.status };
  if (response.ok) {
    data = { ...data, ...(await response.json()) };
  }
  return data as any;
};

export type QueryFilterType = {
  groupNumbers?: Array<string>;
};

export const getPartnerSummary = async (
  partnerId: string,
  dateFrom: Date,
  dateTo: Date,
  filter: QueryFilterType = {}
) => {
  const qs = new URLSearchParams({
    dateFrom: dateFrom.toISOString().split('T')[0],
    dateTo: dateTo.toISOString().split('T')[0],
    filter: JSON.stringify(filter)
  });
  const response = await fetch(
    `${VITE_API_ENDPOINT}/partner/${partnerId}/summary?${qs}`,
    {
      method: 'GET',
      headers: {
        ...(await getAuthenticatedBaseHeaders())
      }
    }
  );
  let data = { status: response.status };
  if (response.ok) {
    data = { ...data, ...(await response.json()) };
  }
  return data as any;
};

export const getPartnerClaimsDetail = async (
  partnerId: string,
  dateFrom: Date,
  dateTo: Date,
  sortBy: string = 'DATE_POSTED',
  sortDirection: string = 'asc',
  pageSize: number = 100,
  page: number = 1,
  download: boolean = false,
  filter: QueryFilterType = {}
) => {
  const qs = new URLSearchParams({
    dateFrom: dateFrom.toISOString().split('T')[0],
    dateTo: dateTo.toISOString().split('T')[0],
    sortBy,
    sortDirection,
    page: page.toString(),
    pageSize: pageSize.toString(),
    download: download.toString(),
    filter: JSON.stringify(filter)
  });
  const response = await fetch(
    `${VITE_API_ENDPOINT}/partner/${partnerId}/claims?${qs}`,
    {
      method: 'GET',
      headers: {
        ...(await getAuthenticatedBaseHeaders())
      }
    }
  );
  let data = { status: response.status };
  if (response.ok) {
    data = { ...data, ...(await response.json()) };
  }
  return data as any;
};

export const downloadPartnerClaimsDetail = async (
  partnerId: string,
  dateFrom: Date,
  dateTo: Date,
  filter: QueryFilterType = {}
) => {
  return getPartnerClaimsDetail(
    partnerId,
    dateFrom,
    dateTo,
    'DATE_POSTED',
    'asc',
    500,
    1,
    true,
    filter
  );
};

export const getPartnerTeamMembers = async (
  partnerId: string,
  isPending: boolean = false
) => {
  const response = await fetch(
    `${VITE_API_ENDPOINT}/partner/${partnerId}/users?isPending=${isPending}`,
    {
      method: 'GET',
      headers: {
        ...(await getAuthenticatedBaseHeaders())
      }
    }
  );
  let data = { status: response.status };
  if (response.ok) {
    data = { ...data, ...(await response.json()) };
  }
  return data as {};
};

export const getPartnerPrimaryReferredAccounts = async (partnerId: string) => {
  const response = await fetch(
    `${VITE_API_ENDPOINT}/partner/${partnerId}/primary-referred`,
    {
      method: 'GET',
      headers: {
        ...(await getAuthenticatedBaseHeaders())
      }
    }
  );
  let data = { status: response.status };
  if (response.ok) {
    data = { ...data, ...(await response.json()) };
  }
  return data as {};
};

export const getPartnerGroupNumberHierarchy = async (partnerId: string) => {
  const response = await fetch(
    `${VITE_API_ENDPOINT}/partner/${partnerId}/group-numbers`,
    {
      method: 'GET',
      headers: {
        ...(await getAuthenticatedBaseHeaders())
      }
    }
  );
  let data = { status: response.status };
  if (response.ok) {
    data = { ...data, ...(await response.json()) };
  }
  return data as {};
};

export const getPendingInvites = async () => {
  const response = await fetch(
    `${VITE_API_ENDPOINT}/platform/invited-members`,
    {
      method: 'GET',
      headers: {
        ...(await getAuthenticatedBaseHeaders())
      }
    }
  );
  let data = { status: response.status };
  if (response.ok) {
    data = { ...data, ...(await response.json()) };
  }
  return data as {};
};

export const deletePartnerTeamMember = async ({
  partnerId,
  userId
}: {
  partnerId: string;
  userId: string;
}) => {
  const response = await fetch(
    `${VITE_API_ENDPOINT}/partner/${partnerId}/users/${userId}`,
    {
      method: 'DELETE',
      headers: {
        ...(await getAuthenticatedBaseHeaders())
      }
    }
  );
  let data = { status: response.status };
  if (response.ok) {
    data = { ...data, ...(await response.json()) };
  }
  return data as {};
};

export const updatePartnerTeamMember = async ({
  partnerId,
  userId,
  status
}: {
  partnerId: string;
  userId: string;
  status: USER_STATUS;
}) => {
  const response = await fetch(
    `${VITE_API_ENDPOINT}/partner/${partnerId}/users/${userId}`,
    {
      method: 'PATCH',
      headers: {
        ...(await getAuthenticatedBaseHeaders())
      },
      body: JSON.stringify({ status })
    }
  );
  let data = { status: response.status };
  if (response.ok) {
    data = { ...data, ...(await response.json()) };
  }
  return data as {};
};

export const deletePlatformMessage = async (messageId: string) => {
  const response = await fetch(
    `${VITE_API_ENDPOINT}/platform/system-message/${messageId}`,
    {
      method: 'DELETE',
      headers: {
        ...(await getAuthenticatedBaseHeaders())
      }
    }
  );
  return response;
};

export const getDdnPartnerAccounts = async (
  // partnerId: string,
  textQuery: string,
  sortBy: string = 'CommonName',
  sortDirection: string = 'asc',
  pageSize: number = 100,
  page: number = 1
) => {
  const qs = new URLSearchParams({
    textQuery,
    sortBy,
    sortDirection,
    page: page.toString(),
    pageSize: pageSize.toString()
  });
  const response = await fetch(`${VITE_API_ENDPOINT}/partner?${qs}`, {
    method: 'GET',
    headers: {
      ...(await getAuthenticatedBaseHeaders())
    }
  });
  let data = { status: response.status };
  if (response.ok) {
    data = { ...data, ...(await response.json()) };
  }
  return data as {};
};

export const getPartnerClaimsDetailDirect = async (
  partnerId: string,
  dateFrom: Date,
  dateTo: Date,
  sortBy: string = 'DATE_POSTED',
  sortDirection: string = 'asc',
  pageSize: number = 100,
  page: number = 1,
  download: boolean = false,
  filter: QueryFilterType = {}
) => {
  const qs = new URLSearchParams({
    dateFrom: dateFrom.toISOString().split('T')[0],
    dateTo: dateTo.toISOString().split('T')[0],
    sortBy,
    sortDirection,
    page: page.toString(),
    pageSize: pageSize.toString(),
    download: download.toString(),
    claimHierarchyType: 'direct',
    filter: JSON.stringify(filter)
  });
  const response = await fetch(
    `${VITE_API_ENDPOINT}/partner/${partnerId}/claims-breakdown?${qs}`,
    {
      method: 'GET',
      headers: {
        ...(await getAuthenticatedBaseHeaders())
      }
    }
  );
  let data = { status: response.status };
  if (response.ok) {
    data = { ...data, ...(await response.json()) };
  }
  return data as any;
};

export const getPartnerClaimsDetailPrimary = async (
  partnerId: string,
  dateFrom: Date,
  dateTo: Date,
  sortBy: string = 'DATE_POSTED',
  sortDirection: string = 'asc',
  pageSize: number = 100,
  page: number = 1,
  download: boolean = false,
  filter: QueryFilterType = {}
) => {
  const qs = new URLSearchParams({
    dateFrom: dateFrom.toISOString().split('T')[0],
    dateTo: dateTo.toISOString().split('T')[0],
    sortBy,
    sortDirection,
    page: page.toString(),
    pageSize: pageSize.toString(),
    download: download.toString(),
    claimHierarchyType: 'primary',
    filter: JSON.stringify(filter)
  });
  const response = await fetch(
    `${VITE_API_ENDPOINT}/partner/${partnerId}/claims-breakdown?${qs}`,
    {
      method: 'GET',
      headers: {
        ...(await getAuthenticatedBaseHeaders())
      }
    }
  );
  let data = { status: response.status };
  if (response.ok) {
    data = { ...data, ...(await response.json()) };
  }
  return data as any;
};

export const getPartnerClaimsDetailSecondary = async (
  partnerId: string,
  dateFrom: Date,
  dateTo: Date,
  sortBy: string = 'DATE_POSTED',
  sortDirection: string = 'asc',
  pageSize: number = 100,
  page: number = 1,
  download: boolean = false,
  filter: QueryFilterType = {}
) => {
  const qs = new URLSearchParams({
    dateFrom: dateFrom.toISOString().split('T')[0],
    dateTo: dateTo.toISOString().split('T')[0],
    sortBy,
    sortDirection,
    page: page.toString(),
    pageSize: pageSize.toString(),
    download: download.toString(),
    claimHierarchyType: 'secondary',
    filter: JSON.stringify(filter)
  });
  const response = await fetch(
    `${VITE_API_ENDPOINT}/partner/${partnerId}/claims-breakdown?${qs}`,
    {
      method: 'GET',
      headers: {
        ...(await getAuthenticatedBaseHeaders())
      }
    }
  );
  let data = { status: response.status };
  if (response.ok) {
    data = { ...data, ...(await response.json()) };
  }
  return data as any;
};

export type InviteTeamMemberType = {
  firstName: string;
  lastName: string;
  email: string;
  partnerId: string;
  role?:
    | 'PARTNER_ACCOUNT_MEMBER'
    | 'PARTNER_ACCOUNT_PRIMARY_MEMBER'
    | 'PARTNER_ACCOUNT_ADMIN';
};

// export const inviteTeamMember = async (inviteData: InviteTeamMemberType) => {
//   const {
//     idToken: {
//       payload: { 'cognito:username': cognitoUserId }
//     }
//   } = await getSession();
//   const response = await fetch(
//     `${VITE_API_ENDPOINT}/registration/generate-partner-registration-code`,
//     {
//       method: 'POST',
//       headers: {
//         ...(await getAuthenticatedBaseHeaders())
//       },
//       body: JSON.stringify(inviteData)
//     }
//   );
//   let data = { status: response.status };
//   if (response.ok) {
//     data = { ...data, ...(await response.json()) };
//   }
//   return data as any;
// };

type ConfirmPartnerUserRegistrationType = {
  partnerId: string;
  email: string;
  regCognitoId?: string;
};
export const confirmPartnerUserRegistration = async ({
  partnerId,
  email,
  regCognitoId
}: ConfirmPartnerUserRegistrationType) => {
  const {
    idToken: {
      payload: { 'cognito:username': cognitoId }
    }
  } = regCognitoId
    ? { idToken: { payload: { 'cognito:username': regCognitoId } } }
    : await getSession();
  const response = await fetch(
    `${VITE_API_ENDPOINT}/partner/${partnerId}/confirm-user-registration`,
    {
      method: 'POST',
      headers: {},
      body: JSON.stringify({ email, cognitoId })
    }
  );
  let data = { status: response.status };
  if (response.ok) {
    data = { ...data, ...(await response.json()) };
  }
  return data as any;
};

type ValidateUserRegistrationDataType = {
  registrationCode: string;
  email: string;
};
export const validateRegistrationData = async ({
  registrationCode,
  email
}: ValidateUserRegistrationDataType) => {
  const qs = new URLSearchParams({
    registrationCode,
    email
  });
  const response = await fetch(
    `${VITE_API_ENDPOINT}/user/get-registered-user?${qs}`,
    {
      method: 'GET',
      headers: {}
    }
  );
  let data = { status: response.status };
  if (response.ok) {
    data = { ...data, ...(await response.json()) };
  }
  return data as any;
};

/* Platform API Calls */

export const getActivePlatformMessage = async () => {
  let response: Response;
  try {
    response = await fetch(`${VITE_API_ENDPOINT}/platform/system-message`, {
      method: 'GET',
      headers: {
        ...(await getAuthenticatedBaseHeaders())
      }
    });
    let data = { status: response.status };
    if (response.ok) {
      data = { ...data, ...(await response.json()) };
    }
    return data as any;
  } catch (error) {
    console.log(`Response: ${JSON.stringify(response!, null, 2)}`);
  }
};

export const getAllPlatformMessages = async () => {
  let response: Response;
  try {
    response = await fetch(`${VITE_API_ENDPOINT}/platform/system-messages`, {
      method: 'GET',
      headers: {
        ...(await getAuthenticatedBaseHeaders())
      }
    });
    let data = { status: response.status } as any;
    if (response.ok) {
      data = { ...data, messages: await response.json() };
    }
    return data as any;
  } catch (error) {
    console.log(`Response: ${JSON.stringify(response!, null, 2)}`);
  }
};

type PlatformMessageCreatePayload = {
  message: string;
  expirationTimestamp?: Date;
  status: 'pending' | 'active' | 'deactivated';
};

export const createPlatformMessage = async (
  payload: PlatformMessageCreatePayload
) => {
  let response: Response;
  try {
    response = await fetch(`${VITE_API_ENDPOINT}/platform/system-message`, {
      method: 'POST',
      headers: {
        ...(await getAuthenticatedBaseHeaders())
      },
      body: JSON.stringify(payload)
    });
    let data = { status: response.status };
    if (response.ok) {
      data = { ...data, ...(await response.json()) };
    }
    return data as any;
  } catch (error) {
    console.log(`Response: ${JSON.stringify(response!, null, 2)}`);
  }
};

export const updatePlatformMessage = async (
  payload: PlatformMessageCreatePayload & { messageId: string }
) => {
  let response: Response;
  const { messageId, ...patchPayload } = payload;
  try {
    response = await fetch(
      `${VITE_API_ENDPOINT}/platform/system-message/${messageId}`,
      {
        method: 'PATCH',
        headers: {
          ...(await getAuthenticatedBaseHeaders())
        },
        body: JSON.stringify(patchPayload)
      }
    );
    let data = { status: response.status };
    if (response.ok) {
      data = { ...data, ...(await response.json()) };
    }
    return data as any;
  } catch (error) {
    console.log(`Response: ${JSON.stringify(response!, null, 2)}`);
  }
};
