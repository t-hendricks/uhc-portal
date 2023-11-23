import React from 'react';
import { render, screen } from '~/testUtils';
import * as hooks from '~/hooks/useFeatureGate';
import { SECURITY_GROUPS_FEATURE } from '~/redux/constants/featureConstants';

import SecurityGroupsSection from './SecurityGroupsSection';

const mockState = {
  applyControlPlaneToAll: true,
  controlPlane: ['sg-abc', 'sg-def'],
  worker: [],
  infra: [],
};

jest.mock('redux-form', () => ({
  ...jest.requireActual('redux-form'),
  formValueSelector: () => () => mockState,
}));

const defaultProps = {
  openshiftVersion: '4.14.0',
  selectedVPC: { id: 'my-vpc', name: 'my vpc' },
};

describe('<SecurityGroupsSection />', () => {
  beforeEach(() => {
    jest
      .spyOn(hooks, 'useFeatureGate')
      .mockImplementation((feature) => feature === SECURITY_GROUPS_FEATURE);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('is displayed when', () => {
    it('the VPC has been selected', () => {
      render(<SecurityGroupsSection {...defaultProps} />);
      expect(screen.getByText('Additional security groups')).toBeInTheDocument();
    });

    it('the feature gate is enabled', () => {
      render(<SecurityGroupsSection {...defaultProps} />);
      expect(screen.getByText('Additional security groups')).toBeInTheDocument();
    });
  });

  describe('is hidden when', () => {
    it('the VPC has not been selected', () => {
      render(
        <SecurityGroupsSection openshiftVersion="4.14.0" selectedVPC={{ id: '', name: '' }} />,
      );
      expect(screen.queryByText('Additional security groups')).not.toBeInTheDocument();
    });

    it('the feature gate is not enabled', () => {
      jest.spyOn(hooks, 'useFeatureGate').mockImplementation(() => false);

      render(<SecurityGroupsSection {...defaultProps} />);
      expect(screen.queryByText('Additional security groups')).not.toBeInTheDocument();
    });
  });
});
