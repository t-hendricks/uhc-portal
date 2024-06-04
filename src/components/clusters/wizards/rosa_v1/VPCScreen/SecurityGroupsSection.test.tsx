import React from 'react';

import { SECURITY_GROUPS_FEATURE_DAY1 } from '~/redux/constants/featureConstants';
import { mockUseFeatureGate, render, screen } from '~/testUtils';

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
    it.each([[false], [true]])(
      'the VPC has been selected. Is hypershift: %s',
      (isHypershift: boolean) => {
        render(<SecurityGroupsSection {...defaultProps} isHypershiftSelected={isHypershift} />);
        expect(screen.getByText('Additional security groups')).toBeInTheDocument();
      },
    );

    it.each([[false], [true]])(
      'the feature gate is enabled. Is hypershift: %s',
      (isHypershift: boolean) => {
        render(<SecurityGroupsSection {...defaultProps} isHypershiftSelected={isHypershift} />);
        expect(screen.getByText('Additional security groups')).toBeInTheDocument();
      },
    );
  });

  describe('is hidden when', () => {
    it.each([[false], [true]])(
      'the VPC has not been selected. Is hypershift: %s',
      (isHypershift: boolean) => {
        render(
          <SecurityGroupsSection
            openshiftVersion="4.14.0"
            selectedVPC={{ id: '', name: '' }}
            isHypershiftSelected={isHypershift}
          />,
        );
        expect(screen.queryByText('Additional security groups')).not.toBeInTheDocument();
      },
    );

    it.each([[false], [true]])(
      'the feature gate is not enabled. Is hypershift: %s',
      (isHypershift: boolean) => {
        mockUseFeatureGate([[SECURITY_GROUPS_FEATURE_DAY1, false]]);
        render(<SecurityGroupsSection {...defaultProps} isHypershiftSelected={isHypershift} />);
        expect(screen.queryByText('Additional security groups')).not.toBeInTheDocument();
      },
    );
  });
});
