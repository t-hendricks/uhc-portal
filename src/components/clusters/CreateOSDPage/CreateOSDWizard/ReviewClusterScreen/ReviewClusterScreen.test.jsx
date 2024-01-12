import React from 'react';
import { render, screen, mockUseFeatureGate } from '~/testUtils';

import { HCP_AWS_BILLING_SHOW } from '~/redux/constants/featureConstants';
import wizardConnector from '../WizardConnector';
import sampleFormData from './mockHCPCluster';
import ReviewClusterScreen from './ReviewClusterScreen';

const defaultProps = {
  formValues: sampleFormData.values,
  change: () => {},
  clusterRequestParams: {},
  getUserRole: () => {},
  getOCMRole: () => {},
  getOCMRoleResponse: () => {},
  getUserRoleResponse: {},
  clearGetUserRoleResponse: () => {},
  clearGetOcmRoleResponse: () => {},
  goToStepById: () => {},
};

describe('<ReviewClusterScreen />', () => {
  afterAll(() => {
    jest.resetAllMocks();
  });
  describe('AWS Billing account', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    describe('is shown when', () => {
      it('isHypershift, has "show" feature flag, and has value', () => {
        const ConnectedReviewClusterScreen = wizardConnector(ReviewClusterScreen);
        const newProps = { ...defaultProps, isHypershiftSelected: true };
        mockUseFeatureGate([[HCP_AWS_BILLING_SHOW, true]]);
        render(<ConnectedReviewClusterScreen {...newProps} />);

        expect(screen.getByText('AWS infrastructure account ID')).toBeInTheDocument();
        expect(screen.getByText('210987654321')).toBeInTheDocument();
        expect(screen.getByText('AWS billing account ID')).toBeInTheDocument();
        expect(screen.getByText('123456789012')).toBeInTheDocument();
      });

      it('isHypershift, has "show" feature flag, and has no value', () => {
        const ConnectedReviewClusterScreen = wizardConnector(ReviewClusterScreen);
        const newProps = {
          ...defaultProps,
          isHypershiftSelected: true,
          formValues: { ...sampleFormData.values, billing_account_id: undefined },
        };
        mockUseFeatureGate([[HCP_AWS_BILLING_SHOW, true]]);
        render(<ConnectedReviewClusterScreen {...newProps} />);

        expect(screen.getByText('AWS infrastructure account ID')).toBeInTheDocument();
        expect(screen.getByText('210987654321')).toBeInTheDocument();
        expect(screen.getByText('AWS billing account ID')).toBeInTheDocument();
      });
    });
    describe('is hidden when', () => {
      it('isHypershift and "show" feature flag is false', () => {
        const ConnectedReviewClusterScreen = wizardConnector(ReviewClusterScreen);
        const newProps = { ...defaultProps, isHypershiftSelected: true };
        mockUseFeatureGate([[HCP_AWS_BILLING_SHOW, false]]);
        render(<ConnectedReviewClusterScreen {...newProps} />);

        expect(defaultProps.formValues.billing_account_id).toEqual('123456789012');

        expect(screen.getByText('AWS infrastructure account ID')).toBeInTheDocument();
        expect(screen.getByText('210987654321')).toBeInTheDocument();
        expect(screen.queryByText('AWS billing account ID')).not.toBeInTheDocument();
        expect(screen.queryByText('123456789012')).not.toBeInTheDocument();
      });

      it('is not isHypershift', () => {
        const ConnectedReviewClusterScreen = wizardConnector(ReviewClusterScreen);
        const newProps = { ...defaultProps, isHypershiftSelected: false };
        mockUseFeatureGate([[HCP_AWS_BILLING_SHOW, true]]);
        render(<ConnectedReviewClusterScreen {...newProps} />);

        expect(defaultProps.formValues.billing_account_id).toEqual('123456789012');

        expect(screen.getByText('AWS infrastructure account ID')).toBeInTheDocument();
        expect(screen.getByText('210987654321')).toBeInTheDocument();
        expect(screen.queryByText('AWS billing account ID')).not.toBeInTheDocument();
        expect(screen.queryByText('123456789012')).not.toBeInTheDocument();
      });
    });
  });

  describe('Security groups', () => {
    const getPropsWithSecurityGroups = ({ isHypershiftSelected, securityGroups }) => ({
      ...defaultProps,
      isHypershiftSelected,
      formValues: {
        ...defaultProps.formValues,
        securityGroups,
      },
    });

    it('is not shown for Hypershift clusters', () => {
      const ConnectedReviewClusterScreen = wizardConnector(ReviewClusterScreen);
      const newProps = getPropsWithSecurityGroups({
        isHypershiftSelected: true,
        securityGroups: undefined, // The form field is not initialized for HCP
      });
      render(<ConnectedReviewClusterScreen {...newProps} />);

      expect(screen.queryByText('Security groups')).not.toBeInTheDocument();
    });

    it('is shown for ROSA classic clusters', () => {
      const ConnectedReviewClusterScreen = wizardConnector(ReviewClusterScreen);
      const newProps = getPropsWithSecurityGroups({
        isHypershiftSelected: false,
        securityGroups: {
          controlPlane: ['sg-ab'],
          infra: ['sg-cd'],
          worker: ['sg-ef'],
        },
      });
      render(<ConnectedReviewClusterScreen {...newProps} />);

      expect(screen.getByText('Security groups')).toBeInTheDocument();
      expect(screen.getByText('Control plane nodes')).toBeInTheDocument();
      expect(screen.getByText('Infrastructure nodes')).toBeInTheDocument();
      expect(screen.getByText('Worker nodes')).toBeInTheDocument();
    });

    it('shows the controlPlane groups as "All nodes" when "applyControlPlaneToAll" is true', () => {
      const ConnectedReviewClusterScreen = wizardConnector(ReviewClusterScreen);
      const newProps = getPropsWithSecurityGroups({
        isHypershiftSelected: false,
        securityGroups: {
          applyControlPlaneToAll: true,
          controlPlane: ['sg-abc'],
          infra: ['sg-should-be-ignored'],
          worker: ['sg-should-be-ignored-too'],
        },
      });
      render(<ConnectedReviewClusterScreen {...newProps} />);

      expect(screen.getByText('Security groups')).toBeInTheDocument();
      expect(screen.getByText('All nodes')).toBeInTheDocument();

      expect(screen.queryByText('Control plane nodes')).not.toBeInTheDocument();
      expect(screen.queryByText('sg-should-be-ignored')).not.toBeInTheDocument();
      expect(screen.queryByText('sg-should-be-ignored-too')).not.toBeInTheDocument();
    });

    it('does not show a node type that does not have groups', () => {
      const ConnectedReviewClusterScreen = wizardConnector(ReviewClusterScreen);
      const newProps = getPropsWithSecurityGroups({
        isHypershiftSelected: false,
        securityGroups: {
          applyControlPlaneToAll: false,
          controlPlane: ['sg-abc'],
          infra: [],
          worker: ['sg-def'],
        },
      });
      render(<ConnectedReviewClusterScreen {...newProps} />);

      expect(screen.getByText('Security groups')).toBeInTheDocument();
      expect(screen.getByText('Control plane nodes')).toBeInTheDocument();

      expect(screen.queryByText('Infrastructure nodes')).not.toBeInTheDocument();
    });
  });

  describe('Shared VPC settings', () => {
    const getPropsWithSharedVpcSettings = ({ isHypershiftSelected, isSharedVpcSelected }) => ({
      ...defaultProps,
      isHypershiftSelected,
      formValues: {
        ...defaultProps.formValues,
        shared_vpc: {
          is_allowed: true,
          is_selected: isSharedVpcSelected,
          hosted_zone_id: 'ZONE-ID-ABC',
        },
      },
    });
    describe('is shown when', () => {
      it('has checked Shared VPC and it is not Hypershift', () => {
        const ConnectedReviewClusterScreen = wizardConnector(ReviewClusterScreen);
        const newProps = getPropsWithSharedVpcSettings({
          isHypershiftSelected: false,
          isSharedVpcSelected: true,
        });
        render(<ConnectedReviewClusterScreen {...newProps} />);
        expect(screen.getByText('Shared VPC settings')).toBeInTheDocument();
        expect(screen.getByText('Private hosted zone ID')).toBeInTheDocument();
        expect(screen.getByText('ZONE-ID-ABC')).toBeInTheDocument();
      });
    });

    describe('is hidden when', () => {
      it('has checked Shared VPC but it is Hypershift', () => {
        const ConnectedReviewClusterScreen = wizardConnector(ReviewClusterScreen);
        const newProps = getPropsWithSharedVpcSettings({
          isHypershiftSelected: true,
          isSharedVpcSelected: true,
        });

        render(<ConnectedReviewClusterScreen {...newProps} />);

        expect(screen.queryByText('Shared VPC settings')).not.toBeInTheDocument();
        expect(screen.queryByText('ZONE-ID-ABC')).not.toBeInTheDocument();
      });

      it('has not checked Shared VPC', () => {
        const ConnectedReviewClusterScreen = wizardConnector(ReviewClusterScreen);
        const newProps = getPropsWithSharedVpcSettings({
          isHypershiftSelected: false,
          isSharedVpcSelected: false,
        });

        render(<ConnectedReviewClusterScreen {...newProps} />);

        expect(screen.queryByText('Shared VPC settings')).not.toBeInTheDocument();
        expect(screen.queryByText('ZONE-ID-ABC')).not.toBeInTheDocument();
      });
    });
  });

  describe('Selected VPC settings', () => {
    const getPropsWithSelectedVpcSettings = ({
      isHypershiftSelected,
      isVPCNamePresent = true,
    }) => ({
      ...defaultProps,
      isHypershiftSelected,
      formValues: {
        ...defaultProps.formValues,
        ...(isVPCNamePresent
          ? {}
          : { selected_vpc: { id: defaultProps.formValues.selected_vpc.id } }),
      },
    });

    it('is shown for Hypershift clusters', () => {
      const ConnectedReviewClusterScreen = wizardConnector(ReviewClusterScreen);
      const newProps = getPropsWithSelectedVpcSettings({
        isHypershiftSelected: true,
        isVPCNamePresent: true,
      });
      render(<ConnectedReviewClusterScreen {...newProps} />);

      expect(screen.getByText('Install to selected VPC')).toBeInTheDocument();
      // vpc name is displayed when available
      expect(screen.getByText(sampleFormData.values.selected_vpc.name)).toBeInTheDocument();
      expect(screen.queryByText(sampleFormData.values.selected_vpc.id)).not.toBeInTheDocument();
    });

    it('is shown for Hypershift clusters and fallbacks to the VPC id when the name is absent', () => {
      const ConnectedReviewClusterScreen = wizardConnector(ReviewClusterScreen);
      const newProps = getPropsWithSelectedVpcSettings({
        isHypershiftSelected: true,
        isVPCNamePresent: false,
      });
      render(<ConnectedReviewClusterScreen {...newProps} />);

      expect(screen.getByText('Install to selected VPC')).toBeInTheDocument();
      // vpc id displayed only if name is not available
      expect(screen.getByText(sampleFormData.values.selected_vpc.id)).toBeInTheDocument();
      expect(screen.queryByText(sampleFormData.values.selected_vpc.name)).not.toBeInTheDocument();
    });

    it('is not shown for non-Hypershift clusters', () => {
      const ConnectedReviewClusterScreen = wizardConnector(ReviewClusterScreen);
      const newProps = getPropsWithSelectedVpcSettings({
        isHypershiftSelected: false,
      });
      render(<ConnectedReviewClusterScreen {...newProps} />);

      expect(screen.queryByText('Install to selected VPC')).not.toBeInTheDocument();
      expect(screen.queryByText(sampleFormData.values.selected_vpc.name)).not.toBeInTheDocument();
      expect(screen.queryByText(sampleFormData.values.selected_vpc.id)).not.toBeInTheDocument();
    });
  });

  describe('Custom encryption key', () => {
    const customKeyLabel = 'Custom KMS key ARN';
    const keyARN = 'arn:aws:kms:us-east-1:000000000006:key/98a8df03-1d14-4eb5-84dc-82a3f490dfa9';

    it('is shown when present', () => {
      const ConnectedReviewClusterScreen = wizardConnector(ReviewClusterScreen);
      const newProps = {
        ...defaultProps,
        formValues: {
          ...defaultProps.formValues,
          kms_key_arn: keyARN,
        },
      };
      render(<ConnectedReviewClusterScreen {...newProps} />);

      expect(screen.getByText(customKeyLabel)).toBeInTheDocument();
      expect(screen.getByText(keyARN)).toBeInTheDocument();
    });

    it('is absent when not present', () => {
      const ConnectedReviewClusterScreen = wizardConnector(ReviewClusterScreen);
      const newProps = {
        ...defaultProps,
      };
      render(<ConnectedReviewClusterScreen {...newProps} />);

      expect(screen.queryByText(customKeyLabel)).not.toBeInTheDocument();
      expect(screen.queryByText(keyARN)).not.toBeInTheDocument();
    });
  });

  describe('Node drain grace period', () => {
    it('shows if not hypershift', () => {
      const ConnectedReviewClusterScreen = wizardConnector(ReviewClusterScreen);
      const newProps = {
        ...defaultProps,
        isHypershiftSelected: false,
        node_drain_grace_period: 60,
      };
      render(<ConnectedReviewClusterScreen {...newProps} />);

      expect(screen.getByText('Node draining')).toBeInTheDocument();
    });

    it('does not show if hypershift', () => {
      const ConnectedReviewClusterScreen = wizardConnector(ReviewClusterScreen);
      const newProps = {
        ...defaultProps,
        isHypershiftSelected: true,
        node_drain_grace_period: 60,
      };
      render(<ConnectedReviewClusterScreen {...newProps} />);

      expect(screen.queryByText('Node draining')).not.toBeInTheDocument();
    });
  });
});
