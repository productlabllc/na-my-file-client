// export enum STAKEHOLDER_GROUP_ROLES {
//     PLATFORM_ADMIN = ‘Platform Administrator’,
//     PLATFORM_DEV = ‘Platform Development’,
//     PLATFORM_SUPPORT = ‘Platform Support’,
//     CLIENT = ‘Client’,
//     TRUSTED_USER = ‘Client Trusted User’,
//     PATH_AGENT = ‘PATH Employee’,
//     PATH_ADMIN = ‘PATH Administrator’,
//     HPD_AGENT = ‘HPD Employee’,
//     HPD_ADMIN = ‘HPD Administrator’,
//     DHS_AGENT = ‘DHS Employee’,
//     DHS_ADMIN = ‘DHS Administrator’,
//     SPONSOR = ‘Sponsor’,
//     CBO_SUPERVISOR = ‘CBO Supervisor’,
//     CBO_STAFFER = ‘CBO Staffer’,
//   }

export const convertAgentRoleIntoAgency = (agentRole: string) => {
  switch (agentRole) {
    case 'Client Trusted User':
      return 'PATH';
    case 'PATH Employee':
      return 'PATH';
    case 'PATH Administrator':
      return 'PATH';
    case 'HPD Employee':
      return 'HPD';
    case 'HPD Administrator':
      return 'HPD';
    case 'CBO Staffer':
      return 'CBO';
    case 'CBO Supervisor':
      return 'CBO';
    case 'DHS Employee':
      return 'DHS';
    case 'DHS Administrator':
      return 'DHS';
    case 'Sponsor':
      return 'Sponsor';
  }
};
