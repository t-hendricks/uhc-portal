import React from 'react';
import { shallow } from 'enzyme';

import { render, screen, checkAccessibility } from '~/testUtils';

import SubscriptionCompliancy from '../components/SubscriptionCompliancy';
import fixtures from './ClusterDetails.fixtures';
import {
  subscriptionSettings,
  subscriptionSupportLevels,
} from '../../../../common/subscriptionTypes';

const { SUPPORT_LEVEL } = subscriptionSettings;
const { EVAL, STANDARD, NONE } = subscriptionSupportLevels;

describe('<SubscriptionCompliancy />', () => {
  const { OCPClusterDetails, clusterDetails, organization } = fixtures;
  const openModal = jest.fn();
  let wrapper;
  let props;
  beforeEach(() => {
    props = {
      cluster: OCPClusterDetails.cluster,
      canSubscribeOCP: false,
      organization,
      openModal,
    };
    wrapper = shallow(<SubscriptionCompliancy {...props} />);
  });

  it('should warn during evaluation period', async () => {
    const cluster = { ...OCPClusterDetails.cluster, canEdit: true };
    cluster.subscription[SUPPORT_LEVEL] = EVAL;
    cluster.subscription.capabilities = [
      {
        name: 'capability.cluster.subscribed_ocp',
        value: 'true',
        inherited: true,
      },
    ];
    const newProps = { ...props, cluster };
    const { container } = render(<SubscriptionCompliancy {...newProps} />);
    expect(screen.getByLabelText('Warning Alert')).toBeInTheDocument();
    expect(screen.getByText('OpenShift evaluation expiration date')).toBeInTheDocument();
    expect(
      screen.queryByText(
        'The cluster owner or an Organization Administrator can edit subscription settings for non-evaluation use.',
        { exact: false },
      ),
    ).not.toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('should warn during evaluation period without an ability to edit', async () => {
    const cluster = { ...OCPClusterDetails.cluster, canEdit: true };
    cluster.subscription[SUPPORT_LEVEL] = EVAL;
    cluster.subscription.capabilities = [
      {
        name: 'capability.cluster.subscribed_ocp',
        value: 'true',
        inherited: true,
      },
    ];
    cluster.canEdit = false;
    const newProps = { ...props, cluster };
    const { container } = render(<SubscriptionCompliancy {...newProps} />);
    expect(screen.getByLabelText('Warning Alert')).toBeInTheDocument();
    expect(screen.getByText('OpenShift evaluation expiration date')).toBeInTheDocument();
    expect(
      screen.getByText(
        'The cluster owner or an Organization Administrator can edit subscription settings for non-evaluation use.',
        { exact: false },
      ),
    ).toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('should warn when evaluation is expired', async () => {
    const cluster = { ...OCPClusterDetails.cluster, canEdit: true };
    cluster.subscription[SUPPORT_LEVEL] = NONE;
    cluster.subscription.capabilities = [];
    const newProps = { ...props, cluster };
    const { container } = render(<SubscriptionCompliancy {...newProps} />);
    expect(screen.getByLabelText('Danger Alert')).toBeInTheDocument();
    expect(screen.getByText('Your 60-day OpenShift evaluation has expired')).toBeInTheDocument();
    expect(
      screen.queryByText(
        'The cluster owner or an Organization Administrator can edit subscription settings for non-evaluation use.',
        { exact: false },
      ),
    ).not.toBeInTheDocument();
    await checkAccessibility(container);
  });
  it('should warn when evaluation is expired without an ability to edit', async () => {
    const cluster = { ...OCPClusterDetails.cluster, canEdit: true };
    cluster.subscription[SUPPORT_LEVEL] = NONE;
    cluster.subscription.capabilities = [];
    cluster.canEdit = false;
    const newProps = { ...props, cluster };
    const { container } = render(<SubscriptionCompliancy {...newProps} />);
    expect(screen.getByLabelText('Danger Alert')).toBeInTheDocument();
    expect(screen.getByText('Your 60-day OpenShift evaluation has expired')).toBeInTheDocument();
    expect(
      screen.getByText(
        'The cluster owner or an Organization Administrator can edit subscription settings for non-evaluation use.',
        { exact: false },
      ),
    ).toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('should not render when it has a valid support', () => {
    const cluster = { ...OCPClusterDetails.cluster };
    cluster.subscription[SUPPORT_LEVEL] = STANDARD;
    wrapper.setProps({ cluster }, () => {
      expect(wrapper).toMatchObject({});
    });
  });

  it('should not render when it is not OCP', () => {
    const cluster = { ...clusterDetails.cluster };
    wrapper.setProps({ cluster }, () => {
      expect(wrapper).toMatchObject({});
    });
  });
});
