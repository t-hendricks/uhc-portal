import { getExternalAuthenticationProviderCommand } from '../externalAuthHelper';

describe('getExternalAuthenticationProvierCommand', () => {
  it('should return the correct command', () => {
    const result = getExternalAuthenticationProviderCommand({
      clusterName: 'clusterName',
      providerName: 'providerName',
      issuerUrl: 'issuerUrl',
      issuerAudiences: 'issuerAudiences',
      groupsClaim: 'groupsClaim',
      usernameClaim: 'usernameClaim',
    });

    expect(result).toBe(
      `rosa create external-auth-provider --cluster=clusterName  --name=providerName --issuer-url=issuerUrl  --issuer-audiences=issuerAudiences  --claim-mapping-groups-claim=groupsClaim  --claim-mapping-username-claim=usernameClaim `,
    );
  });
});
