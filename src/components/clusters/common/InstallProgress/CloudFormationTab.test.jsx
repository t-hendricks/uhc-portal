import React from 'react';
import { shallow } from 'enzyme';
import produce from 'immer';
import CloudFormationTab, {
  getAWSAccountID,
  getOIDCEndpointNoScheme,
  getOIDCProviderARN,
  getAccountRolePrefix,
} from './CloudFormationTab';
import fixtures from '../../ClusterDetails/__test__/ClusterDetails.fixtures';

describe('<CloudFormationTab />', () => {
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

  it('should return the correct account role prefix', () => {
    const prefix = getAccountRolePrefix(fixtures.ROSAManualClusterDetails.cluster);
    expect(prefix).toBe('ManagedOpenShift');
  });

  it('should return the custom account role prefix', () => {
    const customPrefix = produce(fixtures.ROSAManualClusterDetails, (draft) => {
      draft.cluster.aws.sts.role_arn = 'arn:aws:iam::123456789012:role/Custom-Prefix-Installer-Role';
    });
    const prefix = getAccountRolePrefix(customPrefix.cluster);
    expect(prefix).toBe('Custom-Prefix');
  });

  it('should render correctly', () => {
    const wrapper = shallow(
      <CloudFormationTab cluster={fixtures.ROSAManualClusterDetails.cluster} />,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
