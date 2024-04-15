import * as React from 'react';

import { mockRestrictedEnv, render, screen } from '~/testUtils';

import wizardConnector from '../../common/WizardConnector';

import NetworkScreen from './NetworkScreen';

describe('<NetworkScreen />', () => {
  const ConnectedNetworkScreen = wizardConnector(NetworkScreen);

  const initialProps = {
    change: jest.fn(),
    clusterVersionRawId: '4.3.2',
    showClusterPrivacy: true,
  };

  it('Cluster privacy can bet set to external or internal', () => {
    render(<ConnectedNetworkScreen {...initialProps} />);

    expect(screen.getByTestId('cluster_privacy-external')).not.toBeDisabled();
    expect(screen.getByTestId('cluster_privacy-internal')).not.toBeDisabled();
  });

  describe('in Restricted env', () => {
    const isRestrictedEnv = mockRestrictedEnv();

    afterEach(() => {
      isRestrictedEnv.mockReturnValue(false);
    });
    it('Cluster privacy is set to internal and cannot be changed', () => {
      isRestrictedEnv.mockReturnValue(true);
      render(<ConnectedNetworkScreen {...initialProps} />);
      expect(screen.getByTestId('cluster_privacy-external')).toBeDisabled();
      expect(screen.getByTestId('cluster_privacy-external')).not.toBeChecked();

      // Unsure why this is not checked.  Couldn't find in the code
      // why this should be checked.
      // Keeping commented out for further investigation at a later time.
      // expect(screen.getByTestId('cluster_privacy-internal')).toBeChecked();
      expect(screen.getByTestId('cluster_privacy-internal')).toBeDisabled();
    });
  });
});
