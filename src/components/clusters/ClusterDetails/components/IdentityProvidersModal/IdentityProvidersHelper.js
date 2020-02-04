import { toCleanArray } from '../../../../../common/helpers';

const IDPformValues = {
  GITHUB: 'GithubIdentityProvider',
  GOOGLE: 'GoogleIdentityProvider',
  OPENID: 'OpenIDIdentityProvider',
  LDAP: 'LDAPIdentityProvider',
};

const mappingMethodsformValues = {
  CLAIM: 'claim',
  LOOKUP: 'lookup',
  GENERATE: 'generate',
  ADD: 'add',
};

const IDPtypes = [
  {
    name: 'GitHub',
    value: IDPformValues.GITHUB,
  },
  {
    name: 'Google',
    value: IDPformValues.GOOGLE,
  },
  {
    name: 'OpenID',
    value: IDPformValues.OPENID,
  },
  {
    name: 'LDAP',
    value: IDPformValues.LDAP,
  },
];

const IDPTypeNames = {
  [IDPformValues.GITHUB]: 'GitHub',
  [IDPformValues.GOOGLE]: 'Google',
  [IDPformValues.OPENID]: 'OpenID',
  [IDPformValues.LDAP]: 'LDAP',
};

const mappingMethods = [
  {
    name: mappingMethodsformValues.CLAIM,
    value: mappingMethodsformValues.CLAIM,
  },
  {
    name: mappingMethodsformValues.LOOKUP,
    value: mappingMethodsformValues.LOOKUP,
  },
  {
    name: mappingMethodsformValues.GENERATE,
    value: mappingMethodsformValues.GENERATE,
  },
  {
    name: mappingMethodsformValues.ADD,
    value: mappingMethodsformValues.ADD,
  },
];

/**
 * getOauthCallbackURL returns the OAuth callback URL for a given cluster console URL and IDP Name.
 * @param {String} consoleURL a cluster's console URL.
 * @param {String} IDPName an IDP name.
 * @returns {String} The OAuth callback URL for this IDP.
 */
const getOauthCallbackURL = (consoleURL, IDPName) => {
  if (!IDPName || !consoleURL) {
    return '';
  }
  const URLWithSlash = consoleURL.endsWith('/') ? consoleURL : `${consoleURL}/`;
  const URLParts = URLWithSlash.split('.');
  URLParts[0] = 'https://oauth-openshift';

  const oauthURLBase = URLParts.join('.');
  return `${oauthURLBase}oauth2callback/${IDPName}`;
};

/**
 * Does this IDP needs an OAuth callback URL? Currernly only LDAP doesn't, but the helper function
 * is here to make us future proof. If we introduce another IDP that doesn't need the callback URL,
 * this function will need to be modified to account for it.
 * @param {String} IDPType the identity provider type
 */
const IDPNeedsOAuthURL = IDPType => IDPType !== IDPformValues.LDAP;

const LDAPDocLink = 'https://docs.openshift.com/dedicated/4/authentication/identity_providers/configuring-ldap-identity-provider.html';
const GithubDocLink = 'https://docs.openshift.com/dedicated/4/authentication/identity_providers/configuring-github-identity-provider.html';
const GoogleDocLink = 'https://docs.openshift.com/dedicated/4/authentication/identity_providers/configuring-google-identity-provider.html';
const OpenIDDocLink = 'https://docs.openshift.com/dedicated/4/authentication/identity_providers/configuring-oidc-identity-provider.html';

const getCreateIDPRequestData = (formData) => {
  const githubData = {
    client_id: formData.client_id,
    client_secret: formData.client_secret,
    organizations: toCleanArray(formData.organizations),
    teams: toCleanArray(formData.teams),
    hostname: formData.hostname,
    ca: formData.github_ca,
  };

  const googleData = {
    client_id: formData.client_id,
    client_secret: formData.client_secret,
    hosted_domain: formData.hosted_domain,
  };

  const ldapData = {
    attributes: {
      id: toCleanArray(formData.ldap_id),
      email: toCleanArray(formData.ldap_email),
      name: toCleanArray(formData.ldap_name),
      preferred_username: toCleanArray(formData.ldap_preferred_username),
    },
    bind_dn: formData.bind_dn,
    bind_password: formData.bind_password,
    insecure: formData.ldap_insecure,
    url: formData.ldap_url,
    ca: formData.ldap_ca,
  };

  const openIdData = {
    ca: formData.openid_ca,
    claims: {
      email: toCleanArray(formData.openid_email),
      name: toCleanArray(formData.openid_name),
      preferred_username: toCleanArray(formData.openid_preferred_username),
    },
    client_id: formData.client_id,
    client_secret: formData.client_secret,
    extra_scopes: toCleanArray(formData.openid_extra_scopes),
    issuer: formData.issuer,
  };

  const IDPs = {
    GithubIdentityProvider: { name: 'github', data: githubData },
    GoogleIdentityProvider: { name: 'google', data: googleData },
    OpenIDIdentityProvider: { name: 'open_id', data: openIdData },
    LDAPIdentityProvider: { name: 'ldap', data: ldapData },
  };

  const basicData = {
    type: formData.type,
    name: formData.name,
    mapping_method: formData.mappingMethod || 'claim',
  };

  const selectedIDPData = IDPs[formData.type].data;
  const selectedIDPName = IDPs[formData.type].name;

  const requestData = {
    ...basicData,
    [selectedIDPName]: { ...selectedIDPData },
  };

  return requestData;
};

export {
  getCreateIDPRequestData,
  getOauthCallbackURL,
  IDPNeedsOAuthURL,
  IDPtypes,
  IDPTypeNames,
  mappingMethods,
  IDPformValues,
  mappingMethodsformValues,
  LDAPDocLink,
  GithubDocLink,
  OpenIDDocLink,
  GoogleDocLink,
};
