import { OpenIDClaims } from '~/types/clusters_mgmt.v1';

export const githubFormDataTeams = {
  idpId: 'id',
  name: 'name',
  github_ca: 'ca',
  github_auth_mode: 'teams',
  teams: [{ teams: 'a' }, { teams: 'b' }],
  organizations: [{ organizations: 'a' }, { organizations: 'b' }],
  hostname: 'hostname',
  client_id: 'client_id',
  client_secret: 'client_secret',
  bind_password: 'bind_password',
  type: 'GithubIdentityProvider',
};

export const githubTrimFormDataTeams = {
  idpId: 'id',
  name: 'name',
  github_ca: undefined,
  github_auth_mode: 'teams',
  teams: [{ teams: 'a' }, { teams: 'b' }],
  organizations: [{ organizations: 'a' }, { organizations: 'b' }],
  hostname: 'hostname',
  client_id: 'client_id',
  client_secret: 'client_secret',
  bind_password: 'bind_password',
  type: 'GithubIdentityProvider',
};

export const githubFormDataTeamsExpected = {
  github: {
    ca: 'ca',
    client_id: 'client_id',
    client_secret: 'client_secret',
    hostname: 'hostname',
    organizations: undefined,
    teams: ['a', 'b'],
  },
  id: 'id',
  mapping_method: 'claim',
  type: 'GithubIdentityProvider',
};

export const githubTrimFormDataTeamsExpected = {
  github: {
    ca: undefined,
    client_id: 'client_id',
    client_secret: 'client_secret',
    hostname: 'hostname',
    organizations: undefined,
    teams: ['a', 'b'],
  },
  id: 'id',
  mapping_method: 'claim',
  type: 'GithubIdentityProvider',
};

export const githubFormDataOrganizations = {
  idpId: 'id',
  name: 'name',
  github_ca: 'ca',
  github_auth_mode: 'organizations',
  teams: [{ teams: 'a' }, { teams: 'b' }],
  organizations: [{ organizations: 'a' }, { organizations: 'b' }],
  hostname: 'hostname',
  client_id: 'client_id',
  client_secret: 'client_secret',
  type: 'GithubIdentityProvider',
};

export const githubFormDataOrganizationsExpected = {
  github: {
    ca: 'ca',
    client_id: 'client_id',
    client_secret: 'client_secret',
    hostname: 'hostname',
    organizations: ['a', 'b'],
    teams: undefined,
  },
  id: 'id',
  mapping_method: 'claim',
  type: 'GithubIdentityProvider',
};

export const googleFormData = {
  idpId: 'id',
  name: 'name',
  hosted_domain: 'hosted_domain',
  client_id: 'client_id',
  client_secret: 'client_secret',
  type: 'GoogleIdentityProvider',
};

export const googleFormDataExpected = {
  google: {
    client_id: 'client_id',
    hosted_domain: 'hosted_domain',
    client_secret: 'client_secret',
  },
  id: 'id',
  mapping_method: 'claim',
  type: 'GoogleIdentityProvider',
};

export const openIdFormData = {
  idpId: 'id',
  name: 'name',
  openid_ca: 'ca',
  openid_email: [{ openid_email: 'openid_emailA' }, { openid_email: 'openid_emailB' }],
  openid_name: [{ openid_name: 'openid_nameA' }, { openid_name: 'openid_nameB' }],
  openid_preferred_username: [
    { openid_preferred_username: 'openid_preferred_usernameA' },
    { openid_preferred_username: 'openid_preferred_usernameB' },
  ],
  openid_extra_scopes: 'openid_extra_scopes',
  issuer: 'issuer',
  hostname: 'hostname',
  client_id: 'client_id',
  client_secret: 'client_secret',
  type: 'OpenIDIdentityProvider',
};

export const openIdFormDataExpected = {
  id: 'id',
  mapping_method: 'claim',
  open_id: {
    ca: 'ca',
    claims: {
      email: ['openid_emailA', 'openid_emailB'],
      name: ['openid_nameA', 'openid_nameB'],
      preferred_username: ['openid_preferred_usernameA', 'openid_preferred_usernameB'],
    },
    client_id: 'client_id',
    client_secret: 'client_secret',
    extra_scopes: ['openid_extra_scopes'],
    issuer: 'issuer',
  },
  type: 'OpenIDIdentityProvider',
};

export const openIdTrimFormData = {
  idpId: 'id',
  name: 'name',
  openid_email: [{ openid_email: 'openid_emailA' }, { openid_email: 'openid_emailB' }],
  openid_name: [{ openid_name: 'openid_nameA' }, { openid_name: 'openid_nameB' }],
  openid_preferred_username: [
    { openid_preferred_username: 'openid_preferred_usernameA' },
    { openid_preferred_username: 'openid_preferred_usernameB' },
  ],
  openid_extra_scopes: 'openid_extra_scopes',
  issuer: 'issuer',
  hostname: 'hostname',
  client_id: 'client_id',
  client_secret: 'client_secret',
  type: 'OpenIDIdentityProvider',
};

export const openIdTrimFormDataExpected = {
  id: 'id',
  mapping_method: 'claim',
  open_id: {
    ca: undefined,
    claims: {
      email: ['openid_emailA', 'openid_emailB'],
      name: ['openid_nameA', 'openid_nameB'],
      preferred_username: ['openid_preferred_usernameA', 'openid_preferred_usernameB'],
    },
    client_id: 'client_id',
    client_secret: 'client_secret',
    extra_scopes: ['openid_extra_scopes'],
    issuer: 'issuer',
  },
  type: 'OpenIDIdentityProvider',
};

export const ldapFormData = {
  idpId: 'id',
  name: 'name',
  openid_ca: 'ca',
  ldap_id: [{ ldap_id: 'ldap_idA' }, { ldap_id: 'ldap_idB' }],
  ldap_email: [{ ldap_email: 'ldap_emailA' }, { ldap_email: 'ldap_emailB' }],
  ldap_name: [{ ldap_name: 'ldap_nameA' }, { ldap_name: 'ldap_nameB' }],
  ldap_nldap_preferred_usernameame: [
    { ldap_preferred_username: 'ldap_preferred_usernameA' },
    { ldap_preferred_username: 'ldap_preferred_usernameB' },
  ],
  bind_dn: 'bind_dn',
  bind_password: 'bind_password',
  ldap_insecure: 'ldap_insecure',
  ldap_url: 'ldap_url',
  ldap_ca: 'ldap_ca',
  openid_extra_scopes: 'openid_extra_scopes',
  issuer: 'issuer',
  hostname: 'hostname',
  client_id: 'client_id',
  client_secret: 'client_secret',
  type: 'LDAPIdentityProvider',
};

export const ldapFormDataExpected = {
  id: 'id',
  ldap: {
    attributes: {
      email: ['ldap_emailA', 'ldap_emailB'],
      id: ['ldap_idA', 'ldap_idB'],
      name: ['ldap_nameA', 'ldap_nameB'],
      preferred_username: [],
    },
    bind_dn: 'bind_dn',
    bind_password: 'bind_password',
    ca: '',
    insecure: 'ldap_insecure',
    url: 'ldap_url',
  },
  mapping_method: 'claim',
  type: 'LDAPIdentityProvider',
};

export const gitlabFormData = {
  idpId: 'id',
  name: 'name',
  hosted_domain: 'hosted_domain',
  gitlab_url: 'gitlab_url',
  gitlab_ca: 'gitlab_ca',
  client_id: 'client_id',
  client_secret: 'client_secret',
  type: 'GitlabIdentityProvider',
};

export const gitlabFormDataExpected = {
  gitlab: {
    ca: 'gitlab_ca',
    client_id: 'client_id',
    client_secret: 'client_secret',
    url: 'gitlab_url',
  },
  id: 'id',
  mapping_method: 'claim',
  type: 'GitlabIdentityProvider',
};

export const gitlabTrimFormData = {
  idpId: 'id',
  name: 'name',
  hosted_domain: 'hosted_domain',
  gitlab_url: 'gitlab_url',
  client_id: 'client_id',
  client_secret: 'client_secret',
  type: 'GitlabIdentityProvider',
};

export const gitlabTrimFormDataExpected = {
  gitlab: {
    ca: undefined,
    client_id: 'client_id',
    client_secret: 'client_secret',
    url: 'gitlab_url',
  },
  id: 'id',
  mapping_method: 'claim',
  type: 'GitlabIdentityProvider',
};

export const htpassFormData = {
  idpId: 'id',
  name: 'name',
  hosted_domain: 'hosted_domain',
  gitlab_url: 'gitlab_url',
  gitlab_ca: 'gitlab_ca',
  client_id: 'client_id',
  client_secret: 'client_secret',
  users: [
    { username: 'usera', password: 'passa' },
    { username: 'userb', password: 'passb' },
  ],
  type: 'HTPasswdIdentityProvider',
};

export const htpassFormDataExpected = {
  htpasswd: {
    users: {
      items: [
        {
          password: 'passa',
          username: 'usera',
        },
        {
          password: 'passb',
          username: 'userb',
        },
      ],
    },
  },
  id: 'id',
  mapping_method: undefined,
  type: 'HTPasswdIdentityProvider',
};

export const htpassNoIdpFormData = {
  name: 'name',
  hosted_domain: 'hosted_domain',
  gitlab_url: 'gitlab_url',
  gitlab_ca: 'gitlab_ca',
  client_id: 'client_id',
  client_secret: 'client_secret',
  users: [
    { username: 'usera', password: 'passa' },
    { username: 'userb', password: 'passb' },
  ],
  type: 'HTPasswdIdentityProvider',
};

export const htpassNoIdpFormDataExpected = {
  htpasswd: {
    users: {
      items: [
        {
          password: 'passa',
          username: 'usera',
        },
        {
          password: 'passb',
          username: 'userb',
        },
      ],
    },
  },
  id: undefined,
  mapping_method: undefined,
  name: 'name',
  type: 'HTPasswdIdentityProvider',
};

export const clientSecretFormData = {
  idpId: 'id',
  name: 'name',
  github_ca: 'ca',
  github_auth_mode: 'teams',
  hostname: 'hostname',
  client_id: 'client_id',
  client_secret: 'CLIENT_SECRET',
  type: 'GithubIdentityProvider',
};

export const clientSecretFormDataExpected = {
  github: {
    ca: 'ca',
    client_id: 'client_id',
    hostname: 'hostname',
    organizations: undefined,
    teams: [],
  },
  id: 'id',
  mapping_method: 'claim',
  type: 'GithubIdentityProvider',
};

export const bindPassFormData = {
  idpId: 'id',
  name: 'name',
  openid_ca: 'ca',
  ldap_id: [{ ldap_id: 'ldap_idA' }, { ldap_id: 'ldap_idB' }],
  ldap_email: [{ ldap_email: 'ldap_emailA' }, { ldap_email: 'ldap_emailB' }],
  ldap_name: [{ ldap_name: 'ldap_nameA' }, { ldap_name: 'ldap_nameB' }],
  ldap_nldap_preferred_usernameame: [
    { ldap_preferred_username: 'ldap_preferred_usernameA' },
    { ldap_preferred_username: 'ldap_preferred_usernameB' },
  ],
  bind_dn: 'bind_dn',
  bind_password: 'BIND_PASSWORD',
  ldap_insecure: 'ldap_insecure',
  ldap_url: 'ldap_url',
  ldap_ca: 'ldap_ca',
  openid_extra_scopes: 'openid_extra_scopes',
  issuer: 'issuer',
  hostname: 'hostname',
  client_id: 'client_id',
  client_secret: 'client_secret',
  type: 'LDAPIdentityProvider',
};

export const bindPassFormDataExpected = {
  id: 'id',
  ldap: {
    attributes: {
      email: ['ldap_emailA', 'ldap_emailB'],
      id: ['ldap_idA', 'ldap_idB'],
      name: ['ldap_nameA', 'ldap_nameB'],
      preferred_username: [],
    },
    bind_dn: 'bind_dn',
    ca: '',
    insecure: 'ldap_insecure',
    url: 'ldap_url',
  },
  mapping_method: 'claim',
  type: 'LDAPIdentityProvider',
};

export const claims: OpenIDClaims = {
  name: ['openIDName 1', 'openIDName 2'],
  email: ['openIDEmail 1', 'openIDEmail 2'],
  preferred_username: ['openIDUserName 1', 'openIDUserName 2'],
};

export const nameClaimsExpected = [
  { id: 0, openid_name: 'openIDName 1' },
  { id: 1, openid_name: 'openIDName 2' },
];

export const emailClaimsExpected = [
  { id: 0, openid_email: 'openIDEmail 1' },
  { id: 1, openid_email: 'openIDEmail 2' },
];

export const preferredUsernameClaimsExpected = [
  {
    id: 0,
    openid_preferred_username: 'openIDUserName 1',
  },
  {
    id: 1,
    openid_preferred_username: 'openIDUserName 2',
  },
];

export const nameLdapAttributesExpected = [
  { id: 0, ldap_name: 'openIDName 1' },
  { id: 1, ldap_name: 'openIDName 2' },
];

export const emailLdapAttributesExpected = [
  { id: 0, ldap_email: 'openIDEmail 1' },
  { id: 1, ldap_email: 'openIDEmail 2' },
];

export const preferredUsernameLdapAttributesExpected = [
  {
    id: 0,
    ldap_preferred_username: 'openIDUserName 1',
  },
  {
    id: 1,
    ldap_preferred_username: 'openIDUserName 2',
  },
];

export const idLdapAttributesExpected = [
  { id: 0, ldap_id: { index: 'id index 1', openIDUserName: 'id 1' } },
  { id: 1, ldap_id: { index: 'id index 2', openIDUserName: 'id 2' } },
];

export const gitHubTeamsAndOrgsData = {
  teams: ['team a', 'team b'],
  organizations: ['organization a', 'organization b'],
};

export const gitHubOnlyOrgsData = {
  organizations: ['organization a', 'organization b'],
};

export const gitHubTeamsAndOrgsDataExpected = [
  { id: 0, teams: 'team a' },
  { id: 1, teams: 'team b' },
];

export const gitHubOnlyOrgsDataExpected = [
  { id: 0, organizations: 'organization a' },
  { id: 1, organizations: 'organization b' },
];
