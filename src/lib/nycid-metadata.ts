export const oidcMetadataNonProd = {
  code_challenge_methods_supported: ['plain', 'S256'],
  display_values_supported: ['page', 'popup'],
  id_token_signing_alg_values_supported: ['RS256'],
  jwks_uri:
    'https://nonprd-login.nyc.gov/oidc/op/v1.0/3_DkZigi2v_eW7z-cZt8PAw-cYWQYg2d8VqABUFRZUhhzxNAdwR5brLl_h8Hqbo7Bm/.well-known/jwks',
  request_parameter_supported: false,
  response_types_supported: [
    'code',
    'id_token',
    'id_token token',
    'code id_token',
    'code token',
    'code id_token token'
  ],
  scopes_supported: ['openid', 'profile', 'email', 'address', 'phone', 'uid', 'gov.nyc.accounts-nonprd'],
  subject_types_supported: ['public', 'pairwise'],
  token_endpoint_auth_methods_supported: ['client_secret_basic', 'client_secret_post'],
  grant_types_supported: ['authorization_code', 'implicit', 'refresh_token', 'client_credentials'],
  acr_values_supported: ['urn:gigya:loa:10', 'urn:gigya:loa:20', 'urn:gigya:loa:30'],
  backchannel_logout_supported: true,
  backchannel_logout_session_supported: false,
  authorization_endpoint:
    'https://nonprd-login.nyc.gov/oidc/op/v1.0/3_DkZigi2v_eW7z-cZt8PAw-cYWQYg2d8VqABUFRZUhhzxNAdwR5brLl_h8Hqbo7Bm/authorize',
  introspection_endpoint:
    'https://nonprd-login.nyc.gov/oidc/op/v1.0/3_DkZigi2v_eW7z-cZt8PAw-cYWQYg2d8VqABUFRZUhhzxNAdwR5brLl_h8Hqbo7Bm/introspect',
  device_authorization_endpoint:
    'https://nonprd-login.nyc.gov/oidc/op/v1.0/3_DkZigi2v_eW7z-cZt8PAw-cYWQYg2d8VqABUFRZUhhzxNAdwR5brLl_h8Hqbo7Bm/device_authorization',
  issuer:
    'https://nonprd-login.nyc.gov/oidc/op/v1.0/3_DkZigi2v_eW7z-cZt8PAw-cYWQYg2d8VqABUFRZUhhzxNAdwR5brLl_h8Hqbo7Bm/',
  registration_endpoint:
    'https://nonprd-login.nyc.gov/oidc/op/v1.0/3_DkZigi2v_eW7z-cZt8PAw-cYWQYg2d8VqABUFRZUhhzxNAdwR5brLl_h8Hqbo7Bm/register',
  revocation_endpoint:
    'https://nonprd-login.nyc.gov/oidc/op/v1.0/3_DkZigi2v_eW7z-cZt8PAw-cYWQYg2d8VqABUFRZUhhzxNAdwR5brLl_h8Hqbo7Bm/revoke',
  token_endpoint:
    // 'https://dkvtc4ni4i.execute-api.us-east-1.amazonaws.com/nycid/token',
    'https://nonprd-login.nyc.gov/oidc/op/v1.0/3_DkZigi2v_eW7z-cZt8PAw-cYWQYg2d8VqABUFRZUhhzxNAdwR5brLl_h8Hqbo7Bm/token',
  userinfo_endpoint:
    // 'https://dkvtc4ni4i.execute-api.us-east-1.amazonaws.com/nycid/userinfo'
    'https://nonprd-login.nyc.gov/oidc/op/v1.0/3_DkZigi2v_eW7z-cZt8PAw-cYWQYg2d8VqABUFRZUhhzxNAdwR5brLl_h8Hqbo7Bm/userinfo'
};
