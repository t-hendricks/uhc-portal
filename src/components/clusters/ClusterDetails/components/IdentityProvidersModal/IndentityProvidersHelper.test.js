import { generateIDPName, isEmptyReduxArray } from './IdentityProvidersHelper';

describe('generateIDPName()', () => {
  it('Returns IDP type name if the list is empty', () => {
    expect(generateIDPName('GithubIdentityProvider', [])).toEqual('GitHub');
    expect(generateIDPName('GoogleIdentityProvider', [])).toEqual('Google');
    expect(generateIDPName('OpenIDIdentityProvider', [])).toEqual('OpenID');
    expect(generateIDPName('LDAPIdentityProvider', [])).toEqual('LDAP');
    expect(generateIDPName('GitlabIdentityProvider', [])).toEqual('GitLab');
    expect(generateIDPName('HTPasswdIdentityProvider', [])).toEqual('HTPasswd');
  });

  it('Returns IDP type name if the list only has IDPs with different names', () => {
    expect(generateIDPName('GithubIdentityProvider', [{ name: 'foo' }, { name: 'google' }])).toEqual('GitHub');
  });

  it('Returns GitHub-1 if the list only has one IDP with the name GitHub', () => {
    expect(generateIDPName('GithubIdentityProvider', [{ name: 'GitHub' }, { name: 'google' }])).toEqual('GitHub-1');
  });

  it('Returns IDP type GitHub-2 if the list only has IDPs GitHub, GitHub-1, GitHub-3', () => {
    expect(generateIDPName('GithubIdentityProvider', [{ name: 'GitHub' }, { name: 'GitHub-1' }, { name: 'GitHub-3' }])).toEqual('GitHub-2');
  });
});

describe('isEmptyArray()', () => {
  it('Returns False if atleast one claim is present', () => {
    expect(isEmptyReduxArray([{ id: 1, openid_name: 'Test' }, { id: 2, openid_name: 'Test2' }], 'openid_name')).toEqual(false);
  });
  it('Returns true if all the claims is empty', () => {
    expect(isEmptyReduxArray([{ id: 1, openid_name: '' }, { id: 2, openid_name: '' }], 'openid_name')).toEqual(true);
  });
  it('Returns false for different identity provider type when the array is undefined', () => {
    expect(isEmptyReduxArray(undefined, 'openid_name')).toEqual(false);
  });
});
