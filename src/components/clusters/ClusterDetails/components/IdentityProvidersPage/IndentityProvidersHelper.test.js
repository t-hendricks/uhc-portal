import {
  generateIDPName,
  isEmptyReduxArray,
  getOauthCallbackURL,
  IDPTypeNames,
  IDPformValues,
} from './IdentityProvidersHelper';

describe('generateIDPName()', () => {
  it('Returns IDP type name if the list is empty', () => {
    expect(generateIDPName('GithubIdentityProvider', [])).toEqual('GitHub');
    expect(generateIDPName('GoogleIdentityProvider', [])).toEqual('Google');
    expect(generateIDPName('OpenIDIdentityProvider', [])).toEqual('OpenID');
    expect(generateIDPName('LDAPIdentityProvider', [])).toEqual('LDAP');
    expect(generateIDPName('GitlabIdentityProvider', [])).toEqual('GitLab');
    expect(generateIDPName('HTPasswdIdentityProvider', [])).toEqual('htpasswd');
  });

  it('Returns IDP type name if the list only has IDPs with different names', () => {
    expect(
      generateIDPName('GithubIdentityProvider', [{ name: 'foo' }, { name: 'google' }]),
    ).toEqual('GitHub');
  });

  it('Returns GitHub-1 if the list only has one IDP with the name GitHub', () => {
    expect(
      generateIDPName('GithubIdentityProvider', [{ name: 'GitHub' }, { name: 'google' }]),
    ).toEqual('GitHub-1');
  });

  it('Returns IDP type GitHub-2 if the list only has IDPs GitHub, GitHub-1, GitHub-3', () => {
    expect(
      generateIDPName('GithubIdentityProvider', [
        { name: 'GitHub' },
        { name: 'GitHub-1' },
        { name: 'GitHub-3' },
      ]),
    ).toEqual('GitHub-2');
  });
});

describe('isEmptyArray()', () => {
  it('Returns False if at least one claim is present', () => {
    expect(
      isEmptyReduxArray(
        [
          { id: 1, openid_name: 'Test' },
          { id: 2, openid_name: 'Test2' },
        ],
        'openid_name',
      ),
    ).toEqual(false);
  });
  it('Returns true if all the claims is empty', () => {
    expect(
      isEmptyReduxArray(
        [
          { id: 1, openid_name: '' },
          { id: 2, openid_name: '' },
        ],
        'openid_name',
      ),
    ).toEqual(true);
  });
  it('Returns false for different identity provider type when the array is undefined', () => {
    expect(isEmptyReduxArray(undefined, 'openid_name')).toEqual(false);
  });
});

describe('getOauthCallbackURL()', () => {
  const idpName = 'my-idp-name';
  const clusterUrls = {
    console: 'https://console-openshift-console.apps.test-liza.wiex.s1.devshift.org',
    api: 'https://api.test-api-liza.wiex.s1.devshift.org',
  };

  it('Returns empty if the parameters are also empty', () => {
    expect(getOauthCallbackURL({ console: '', api: clusterUrls.api }, idpName, false)).toEqual('');
    expect(getOauthCallbackURL({ console: clusterUrls.console, api: '' }, idpName, true)).toEqual(
      '',
    );
  });

  it('Uses the console url and updates the base name with the oauth URL for non-Hypershift clusters', () => {
    expect(getOauthCallbackURL(clusterUrls, idpName, false)).toEqual(
      'https://oauth-openshift.apps.test-liza.wiex.s1.devshift.org/oauth2callback/my-idp-name',
    );
  });

  it('Uses the API url and updates the base name for Hypershift clusters', () => {
    expect(getOauthCallbackURL(clusterUrls, idpName, true)).toEqual(
      'https://oauth.test-api-liza.wiex.s1.devshift.org/oauth2callback/my-idp-name',
    );
  });

  it('Removes the API Url port for Hypershift clusters if IDP is not OPENID', () => {
    const withPort = {
      ...clusterUrls,
      api: 'https://api.test-liza.wiex.s1.devshift.org:456',
    };
    expect(getOauthCallbackURL(withPort, idpName, true)).toEqual(
      'https://oauth.test-liza.wiex.s1.devshift.org/oauth2callback/my-idp-name',
    );
  });

  it('Leaves the API Url port for Hypershift clusters if IDP is OPENID', () => {
    const withPort = {
      ...clusterUrls,
      api: 'https://api.test-liza.wiex.s1.devshift.org:456',
    };
    expect(getOauthCallbackURL(withPort, IDPTypeNames[IDPformValues.OPENID], true)).toEqual(
      'https://oauth.test-liza.wiex.s1.devshift.org:456/oauth2callback/OpenID',
    );
  });
});
