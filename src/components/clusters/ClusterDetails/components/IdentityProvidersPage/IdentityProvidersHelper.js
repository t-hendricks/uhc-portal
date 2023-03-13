import isEmpty from 'lodash/isEmpty';
import { strToCleanArray, multiInputToCleanArray } from '../../../../../common/helpers';

const IDPformValues = {
  GITHUB: 'GithubIdentityProvider',
  GOOGLE: 'GoogleIdentityProvider',
  OPENID: 'OpenIDIdentityProvider',
  LDAP: 'LDAPIdentityProvider',
  GITLAB: 'GitlabIdentityProvider',
  HTPASSWD: 'HTPasswdIdentityProvider',
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
  {
    name: 'GitLab',
    value: IDPformValues.GITLAB,
  },
  {
    name: 'HTPasswd',
    value: IDPformValues.HTPASSWD,
  },
];

const IDPTypeNames = {
  [IDPformValues.GITHUB]: 'GitHub',
  [IDPformValues.GOOGLE]: 'Google',
  [IDPformValues.OPENID]: 'OpenID',
  [IDPformValues.LDAP]: 'LDAP',
  [IDPformValues.GITLAB]: 'GitLab',
  [IDPformValues.HTPASSWD]: 'htpasswd',
};

const singularFormIDP = {
  [IDPformValues.GITHUB]: 'a GitHub',
  [IDPformValues.GOOGLE]: 'a Google',
  [IDPformValues.OPENID]: 'an OpenID',
  [IDPformValues.LDAP]: 'an LDAP',
  [IDPformValues.GITLAB]: 'a GitLab',
  [IDPformValues.HTPASSWD]: 'an HTPasswd',
};

const IDPObjectNames = {
  [IDPformValues.GITHUB]: 'github',
  [IDPformValues.GOOGLE]: 'google',
  [IDPformValues.OPENID]: 'open_id',
  [IDPformValues.LDAP]: 'ldap',
  [IDPformValues.GITLAB]: 'gitlab',
  [IDPformValues.HTPASSWD]: 'htpasswd',
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
 * @param {Boolean} isHypershift indicates if it's a Hypershift cluster
 * @returns {String} The OAuth callback URL for this IDP.
 */
const getOauthCallbackURL = (consoleURL, IDPName, isHypershift) => {
  if (!IDPName || !consoleURL) {
    return '';
  }
  const URLWithSlash = consoleURL.endsWith('/') ? consoleURL : `${consoleURL}/`;

  const URLParts = URLWithSlash.split('.');
  URLParts[0] = isHypershift ? 'https://oauth' : 'https://oauth-openshift';

  const oauthURLBase = URLParts.join('.');
  return `${oauthURLBase}oauth2callback/${IDPName}`;
};

/**
 * Does this IDP needs an OAuth callback URL? Currernly only LDAP doesn't, but the helper function
 * is here to make us future proof. If we introduce another IDP that doesn't need the callback URL,
 * this function will need to be modified to account for it.
 * @param {String} IDPType the identity provider type
 */
const IDPNeedsOAuthURL = (IDPType) =>
  ![IDPformValues.LDAP, IDPformValues.HTPASSWD].includes(IDPType);

/**
 * Generate a usable IDP name, based on the IDP Type and already-configured IDPs.
 * It'll default to the IDP type name, and add numbers if there's already one configured
 * until it finds an unused name. If you have GitHub, GitHub-1 and GitHub-3,
 * the function should pick GitHub-2.
 *
 * @param {String} IDPType An IDP Type name as defined in IDPTypeNames
 * @param {Array<Object>} IDPList An array of IDP objects returned from the server
 */
const generateIDPName = (IDPType, IDPList) => {
  const idpNameList = IDPList.map((idp) => idp.name);
  let idpNumber = 0;

  const baseName = IDPTypeNames[IDPType];
  if (!idpNameList.includes(baseName)) {
    return baseName;
  }

  let idpName = `${baseName}-${idpNumber + 1}`;
  while (idpNameList.includes(idpName)) {
    idpNumber += 1;
    idpName = `${baseName}-${idpNumber + 1}`;
  }
  return idpName;
};

const getldapca = (formData) => {
  if (formData.ldap_ca) {
    if (!formData.ldap_insecure) {
      return formData.ldap_ca.trim();
    }
    return '';
  }
  return formData.ldap_ca;
};

const getCreateIDPRequestData = (formData) => {
  const githubData = () => ({
    client_id: formData.client_id.trim(),
    client_secret: formData.client_secret.trim(),
    organizations:
      formData.github_auth_mode === 'organizations'
        ? multiInputToCleanArray(formData, 'organizations')
        : undefined,
    teams:
      formData.github_auth_mode === 'teams' ? multiInputToCleanArray(formData, 'teams') : undefined,
    hostname: formData.hostname,
    ca: formData.github_ca ? formData.github_ca.trim() : formData.github_ca,
  });

  const googleData = () => ({
    client_id: formData.client_id.trim(),
    client_secret: formData.client_secret.trim(),
    hosted_domain: formData.hosted_domain,
  });

  const ldapData = () => ({
    attributes: {
      id: multiInputToCleanArray(formData, 'ldap_id'),
      email: multiInputToCleanArray(formData, 'ldap_email'),
      name: multiInputToCleanArray(formData, 'ldap_name'),
      preferred_username: multiInputToCleanArray(formData, 'ldap_preferred_username'),
    },
    bind_dn: formData.bind_dn,
    bind_password: formData.bind_password,
    insecure: formData.ldap_insecure,
    url: formData.ldap_url,
    ca: getldapca(formData),
  });

  const gitlabData = () => ({
    client_id: formData.client_id.trim(),
    client_secret: formData.client_secret.trim(),
    url: formData.gitlab_url,
    ca: formData.gitlab_ca ? formData.gitlab_ca.trim() : formData.gitlab_ca,
  });

  const openIdData = () => ({
    ca: formData.openid_ca ? formData.openid_ca.trim() : formData.openid_ca,
    claims: {
      email: multiInputToCleanArray(formData, 'openid_email'),
      name: multiInputToCleanArray(formData, 'openid_name'),
      preferred_username: multiInputToCleanArray(formData, 'openid_preferred_username'),
    },
    client_id: formData.client_id.trim(),
    client_secret: formData.client_secret.trim(),
    extra_scopes: strToCleanArray(formData.openid_extra_scopes),
    issuer: formData.issuer,
  });

  const htpasswdData = () => ({
    username: formData.htpasswd_username,
    password: formData.htpasswd_password,
  });

  const IDPs = {
    GithubIdentityProvider: { name: 'github', data: githubData },
    GoogleIdentityProvider: { name: 'google', data: googleData },
    OpenIDIdentityProvider: { name: 'open_id', data: openIdData },
    LDAPIdentityProvider: { name: 'ldap', data: ldapData },
    GitlabIdentityProvider: { name: 'gitlab', data: gitlabData },
    HTPasswdIdentityProvider: { name: 'htpasswd', data: htpasswdData },
  };

  const basicData = {
    type: formData.type,
    name: formData.name,
    id: formData.idpId,
  };

  const selectedIDPData = IDPs[formData.type].data();
  const selectedIDPName = IDPs[formData.type].name;

  if (selectedIDPName !== 'htpasswd') {
    basicData.mapping_method = formData.mappingMethod || mappingMethodsformValues.CLAIM;
  }

  if (formData.idpId && formData.idpId !== '') {
    delete basicData.name;
    if (selectedIDPData.client_secret === 'CLIENT_SECRET') {
      delete selectedIDPData.client_secret;
    }
    if (selectedIDPData.bind_password && selectedIDPData.bind_password === 'BIND_PASSWORD') {
      delete selectedIDPData.bind_password;
    }
  }

  const requestData = {
    ...basicData,
    [selectedIDPName]: { ...selectedIDPData },
  };
  return requestData;
};

const getOpenIdClaims = (claims, type) => {
  const openIdClaimsData = [];
  if (claims && claims[type]) {
    switch (type) {
      case 'name': {
        claims[type].forEach((openIDName, index) => {
          const obj = {
            id: index,
            openid_name: openIDName,
          };
          openIdClaimsData.push(obj);
        });
        break;
      }
      case 'email': {
        claims[type].forEach((openIDEmail, index) => {
          const obj = {
            id: index,
            openid_email: openIDEmail,
          };
          openIdClaimsData.push(obj);
        });
        break;
      }
      case 'preferred_username': {
        claims[type].forEach((openIDUserName, index) => {
          const obj = {
            id: index,
            openid_preferred_username: openIDUserName,
          };
          openIdClaimsData.push(obj);
        });
        break;
      }
      default: {
        break;
      }
    }
  }

  return openIdClaimsData;
};

const getldapAttributes = (attributes, type) => {
  const ldapAttributesData = [];
  if (attributes && attributes[type]) {
    switch (type) {
      case 'name': {
        attributes[type].forEach((name, index) => {
          const obj = {
            id: index,
            ldap_name: name,
          };
          ldapAttributesData.push(obj);
        });
        break;
      }
      case 'email': {
        attributes[type].forEach((email, index) => {
          const obj = {
            id: index,
            ldap_email: email,
          };
          ldapAttributesData.push(obj);
        });
        break;
      }
      case 'preferred_username': {
        attributes[type].forEach((userName, index) => {
          const obj = {
            id: index,
            ldap_preferred_username: userName,
          };
          ldapAttributesData.push(obj);
        });
        break;
      }
      case 'id': {
        attributes[type].forEach((id, index) => {
          const obj = {
            id: index,
            ldap_id: id,
          };
          ldapAttributesData.push(obj);
        });
        break;
      }
      default: {
        break;
      }
    }
  }

  return ldapAttributesData;
};

const getGitHubTeamsAndOrgsData = (type) => {
  const data = [];

  if (type.teams) {
    type.teams.forEach((name, index) => {
      const obj = {
        id: index,
        teams: name,
      };
      data.push(obj);
    });
  } else if (type.organizations) {
    type.organizations.forEach((name, index) => {
      const obj = {
        id: index,
        organizations: name,
      };
      data.push(obj);
    });
  }

  return data;
};

/**
 * Returns `true` if the provided array of `ReduxFieldArray` values has only empty values,
 * false otherwise.
 * @param {Array} arr array of `ReduxFieldArray` values
 * @param {String} key Field name of the `ReduxFieldArray`
 */

const isEmptyReduxArray = (arr, key) =>
  arr ? arr.map((currentValue) => isEmpty(currentValue[key])).every((item) => item) : false;

export {
  getCreateIDPRequestData,
  getOauthCallbackURL,
  IDPNeedsOAuthURL,
  IDPtypes,
  IDPTypeNames,
  singularFormIDP,
  mappingMethods,
  IDPformValues,
  mappingMethodsformValues,
  generateIDPName,
  IDPObjectNames,
  getldapAttributes,
  getOpenIdClaims,
  getGitHubTeamsAndOrgsData,
  isEmptyReduxArray,
};
