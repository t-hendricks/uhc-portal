import React from 'react';
import { render, screen, mockUseFeatureGate } from '~/testUtils';
import { SECURITY_GROUPS_FEATURE_DAY1 } from '~/redux/constants/featureConstants';

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
    mockUseFeatureGate([[SECURITY_GROUPS_FEATURE_DAY1, true]]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks();
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
      mockUseFeatureGate([[SECURITY_GROUPS_FEATURE_DAY1, false]]);
      render(<SecurityGroupsSection {...defaultProps} />);
      expect(screen.queryByText('Additional security groups')).not.toBeInTheDocument();
    });
  });
});
