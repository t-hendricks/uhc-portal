import { toCleanArray } from '../../../../../common/helpers';

const getCreateIDPRequestData = (formData) => {
  const github = {
    client_id: formData.client_id,
    client_secret: formData.client_secret,
    organizations: toCleanArray(formData.organizations),
    teams: toCleanArray(formData.teams),
    hostname: formData.hostname,
  };

  const google = {
    client_id: formData.client_id,
    client_secret: formData.client_secret,
    hosted_domain: formData.hosted_domain,
  };

  const gitlab = {
    client_id: formData.client_id,
    client_secret: formData.client_secret,
    url: formData.url,
    ca: formData.gitlab_ca,
  };

  const ldap = {
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

  const openId = {
    ca: formData.openid_ca,
    claims: {
      email: toCleanArray(formData.openid_email),
      name: toCleanArray(formData.openid_name),
      preferred_username: toCleanArray(formData.openid_preferred_username),
    },
    client_id: formData.client_id,
    client_secret: formData.client_secret,
    extra_scopes: toCleanArray(formData.openid_extra_scopes),
    urls: {
      authorize: formData.openid_authorize,
      token: formData.openid_token,
      user_info: formData.openid_userinfo,
    },
  };

  const IDPsData = {
    GithubIdentityProvider: github,
    GitlabIdentityProvider: gitlab,
    GoogleIdentityProvider: google,
    OpenIDIdentityProvider: openId,
    LDAPIdentityProvider: ldap,
  };

  const basicData = {
    type: formData.type,
    name: formData.name,
    login: formData.login,
    challenge: formData.challenge,
    mappingMethod: formData.mappingMethod || 'claim',
  };

  const selectedIDPData = IDPsData[formData.type];

  const requestData = {
    ...basicData,
    ...selectedIDPData,
  };

  return requestData;
};

export default getCreateIDPRequestData;
