import React from 'react';
import { Formik } from 'formik';
import { render, screen, mockUseFeatureGate, waitFor } from '~/testUtils';
import { SECURITY_GROUPS_FEATURE_DAY1 } from '~/redux/constants/featureConstants';
import { FieldId, initialValues } from '../constants';
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

const buildTestComponent = (children: React.ReactNode, formValues = {}) => (
  <Formik
    initialValues={{
      ...initialValues,
      ...formValues,
      [FieldId.SecurityGroups]: {
        applyControlPlaneToAll: true,
        controlPlane: [],
        infra: [],
        worker: [],
      },
    }}
    onSubmit={() => {}}
  >
    {children}
  </Formik>
);

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
    it('the VPC has been selected', async () => {
      render(buildTestComponent(<SecurityGroupsSection {...defaultProps} />));
      await waitFor(() => {
        expect(screen.getByText('Additional security groups')).toBeInTheDocument();
      });
    });

    it('the feature gate is enabled', async () => {
      render(buildTestComponent(<SecurityGroupsSection {...defaultProps} />));
      await waitFor(() => {
        expect(screen.getByText('Additional security groups')).toBeInTheDocument();
      });
    });
  });

  describe('is hidden when', () => {
    it('the VPC has not been selected', async () => {
      render(
        buildTestComponent(
          <SecurityGroupsSection openshiftVersion="4.14.0" selectedVPC={{ id: '', name: '' }} />,
        ),
      );
      await waitFor(() => {
        expect(screen.queryByText('Additional security groups')).not.toBeInTheDocument();
      });
    });

    it('the feature gate is not enabled', async () => {
      mockUseFeatureGate([[SECURITY_GROUPS_FEATURE_DAY1, false]]);
      render(buildTestComponent(<SecurityGroupsSection {...defaultProps} />));
      await waitFor(() => {
        expect(screen.queryByText('Additional security groups')).not.toBeInTheDocument();
      });
    });
  });
});
