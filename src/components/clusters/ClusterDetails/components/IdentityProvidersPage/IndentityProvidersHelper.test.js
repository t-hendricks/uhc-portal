import { generateIDPName, isEmptyReduxArray, getOauthCallbackURL } from './IdentityProvidersHelper';

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
  const baseUrl = 'https://console-url.some-domain.test.com';
  const idpName = 'my-idp-name';

  it('Returns empty if the parameters are also empty', () => {
    expect(getOauthCallbackURL('', idpName, false)).toEqual('');
    expect(getOauthCallbackURL(baseUrl, '', false)).toEqual('');
  });

  it('Replaces the base name with the oauth URL for non-Hypershift clusters', () => {
    expect(getOauthCallbackURL(baseUrl, idpName, false)).toEqual(
      'https://oauth-openshift.some-domain.test.com/oauth2callback/my-idp-name',
    );
  });

  it('Replaces the base name with the oauth URL for Hypershift clusters', () => {
    expect(getOauthCallbackURL(baseUrl, idpName, true)).toEqual(
      'https://oauth.some-domain.test.com/oauth2callback/my-idp-name',
    );
  });
});
