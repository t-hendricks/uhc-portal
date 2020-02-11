import { generateIDPName } from './IdentityProvidersHelper';

describe('generateIDPName()', () => {
  it('Returns IDP type name if the list is empty', () => {
    expect(generateIDPName('GithubIdentityProvider', [])).toEqual('GitHub');
    expect(generateIDPName('GoogleIdentityProvider', [])).toEqual('Google');
    expect(generateIDPName('OpenIDIdentityProvider', [])).toEqual('OpenID');
    expect(generateIDPName('LDAPIdentityProvider', [])).toEqual('LDAP');
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
