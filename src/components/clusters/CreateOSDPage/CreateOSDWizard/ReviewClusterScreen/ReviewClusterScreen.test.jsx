import React from 'react';
import { render, screen } from '~/testUtils';
import * as useFeatureGate from '~/hooks/useFeatureGate';
import { HCP_AWS_BILLING_SHOW } from '~/redux/constants/featureConstants';
import wizardConnector from '../WizardConnector';
import sampleFormData from './mockHCPCluster';
import ReviewClusterScreen from './ReviewClusterScreen';

const setAWSBillingAcctVisible = (gate, awsBillingVisible) => {
  if (gate === HCP_AWS_BILLING_SHOW) {
    return awsBillingVisible;
  }
  return false; // return all other feature flags as false
};
const defaultProps = {
  change: () => {},
  clusterRequestParams: {},
  formValues: sampleFormData.values,
  getUserRole: () => {},
  getOCMRole: () => {},
  getOCMRoleResponse: () => {},
  getUserRoleResponse: {},
  clearGetUserRoleResponse: () => {},
  clearGetOcmRoleResponse: () => {},
  goToStepById: () => {},
};

describe('<ReviewClusterScreen />', () => {
  describe('AWS Billing account', () => {
    const useFeatureGateMock = jest.spyOn(useFeatureGate, 'useFeatureGate');
    afterEach(() => {
      jest.clearAllMocks();
      useFeatureGateMock.mockReset();
    });
    describe('is shown when', () => {
      it('isHypershift, has "show" feature flag, and has value', () => {
        const ConnectedReviewClusterScreen = wizardConnector(ReviewClusterScreen);
        const newProps = { ...defaultProps, isHypershiftSelected: true };
        useFeatureGateMock.mockImplementation((gate) => setAWSBillingAcctVisible(gate, true));
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
        useFeatureGateMock.mockImplementation((gate) => setAWSBillingAcctVisible(gate, true));
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
        useFeatureGateMock.mockImplementation((gate) => setAWSBillingAcctVisible(gate, false));
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
        useFeatureGateMock.mockImplementation((gate) => setAWSBillingAcctVisible(gate, true));
        render(<ConnectedReviewClusterScreen {...newProps} />);

        expect(defaultProps.formValues.billing_account_id).toEqual('123456789012');

        expect(screen.getByText('AWS infrastructure account ID')).toBeInTheDocument();
        expect(screen.getByText('210987654321')).toBeInTheDocument();
        expect(screen.queryByText('AWS billing account ID')).not.toBeInTheDocument();
        expect(screen.queryByText('123456789012')).not.toBeInTheDocument();
      });
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
});
