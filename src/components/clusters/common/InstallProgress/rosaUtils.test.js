import {
  getAWSAccountID,
  getOIDCEndpointNoScheme,
  getOIDCProviderARN,
} from './rosaUtils';
import fixtures from '../../ClusterDetails/__test__/ClusterDetails.fixtures';

describe('ROSA utils', () => {
  it('should return the correct AWS account ID', () => {
    const accountID = getAWSAccountID(fixtures.ROSAManualClusterDetails.cluster);
    expect(accountID).toBe('123456789012');
  });

  it('should return the correct OIDC endpoint without URL scheme', () => {
    const endpoint = getOIDCEndpointNoScheme(fixtures.ROSAManualClusterDetails.cluster);
    expect(endpoint).toBe(
      'rh-oidc.s3.us-east-1.amazonaws.com/1ricsv5bio0domn5gofgaar07aifjpr0',
    );
  });

  it('should return the correct OIDC provider ARN', () => {
    const arn = getOIDCProviderARN(fixtures.ROSAManualClusterDetails.cluster);
    expect(arn).toBe(
      'arn:aws:iam::123456789012:oidc-provider/rh-oidc.s3.us-east-1.amazonaws.com/1ricsv5bio0domn5gofgaar07aifjpr0',
    );
  });
});
