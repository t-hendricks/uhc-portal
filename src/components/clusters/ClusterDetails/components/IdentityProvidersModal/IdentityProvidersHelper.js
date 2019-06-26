import { toCleanArray } from '../../../../../common/helpers';

const IDPtypes = [
  {
    name: 'Github',
    value: 'GithubIdentityProvider',
  },
  {
    name: 'Google',
    value: 'GoogleIdentityProvider',
  },
  {
    name: 'OpenID',
    value: 'OpenIDIdentityProvider',
  },
  {
    name: 'LDAP',
    value: 'LDAPIdentityProvider',
  },
];

const mappingMethods = [
  {
    name: 'claim',
    value: 'claim',
  },
  {
    name: 'lookup',
    value: 'lookup',
  },
  {
    name: 'generate',
    value: 'generate',
  },
  {
    name: 'add',
    value: 'add',
  },
];

const LDAPDocLink = 'https://access.redhat.com/documentation/en-us/openshift_container_platform/4.1/html/authentication/configuring-identity-providers#configuring-ldap-identity-provider';
const GithubDocLink = 'https://access.redhat.com/documentation/en-us/openshift_container_platform/4.1/html/authentication/configuring-identity-providers#configuring-github-identity-provider';
const OpenIDDocLink = 'https://access.redhat.com/documentation/en-us/openshift_container_platform/4.1/html/authentication/configuring-identity-providers#configuring-oidc-identity-provider';
const GoogleDocLink = 'https://access.redhat.com/documentation/en-us/openshift_container_platform/4.1/html/authentication/configuring-identity-providers#configuring-google-identity-provider';

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
  IDPtypes,
  mappingMethods,
  LDAPDocLink,
  GithubDocLink,
  OpenIDDocLink,
  GoogleDocLink,
};
