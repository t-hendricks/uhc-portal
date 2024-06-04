import React from 'react';

import { render, screen, waitFor, within } from '~/testUtils';

import { subscriptionCapabilities } from '../../../../common/subscriptionCapabilities';
import {
  subscriptionProductBundles,
  subscriptionServiceLevels,
  subscriptionSettings,
  subscriptionStatuses,
  subscriptionSupportLevels,
  subscriptionSystemUnits,
  subscriptionUsages,
} from '../../../../common/subscriptionTypes';

import EditSubscriptionSettingsDialog from './EditSubscriptionSettingsDialog';

// TODO: either add back or remove PRODUCT_BUNDLE
const {
  SUPPORT_LEVEL,
  USAGE,
  SERVICE_LEVEL,
  PRODUCT_BUNDLE,
  SYSTEM_UNITS,
  // CLUSTER_BILLING_MODEL,
  CPU_TOTAL,
} = subscriptionSettings;

const { EVAL, STANDARD, NONE } = subscriptionSupportLevels;

const { L1_L3 } = subscriptionServiceLevels;

const { PRODUCTION } = subscriptionUsages;

const { OPENSHIFT } = subscriptionProductBundles;

const { CORES_VCPU, SOCKETS } = subscriptionSystemUnits;

const { ACTIVE, DISCONNECTED } = subscriptionStatuses;

const { SUBSCRIBED_OCP, SUBSCRIBED_OCP_MARKETPLACE } = subscriptionCapabilities;

describe('<EditSubscriptionSettingsDialog />', () => {
  const billingModelInfoAlert = () => screen.getByText('Info alert:');

  const supportPremiumRadio = () => screen.getByRole('radio', { name: 'Premium' });
  const supportStandardRadio = () => screen.getByRole('radio', { name: 'Standard' });
  const supportSelfSupport = () => screen.getByRole('radio', { name: 'Self-Support' });

  const usageProductionRadio = () => screen.getByRole('radio', { name: 'Production' });
  const usageDevelopmentRadio = () => screen.getByRole('radio', { name: 'Development/Test' });
  const usageDisasterRadio = () => screen.getByRole('radio', { name: 'Disaster Recovery' });

  const serviceLevelL1Radio = () => screen.getByRole('radio', { name: 'Red Hat support (L1-L3)' });
  const serviceLevelL3Radio = () => screen.getByRole('radio', { name: 'Partner support (L3)' });

  const systemUnitsCoresRadio = () => screen.getByRole('radio', { name: 'Cores or vCPUs' });
  const systemUnitsSocketsRadio = () => screen.getByRole('radio', { name: 'Sockets' });

  const cpuSocketNumberText = () => screen.getByText('0 Cores or vCPUs');

  const saveButton = () => screen.getByRole('button', { name: 'Save' });
  const cancelButton = () => screen.getByRole('button', { name: 'Cancel' });

  const closeModal = jest.fn();
  const onClose = jest.fn();
  const submit = jest.fn();
  const requestState = {
    fulfilled: false,
    error: false,
    pending: false,
  };

  const baseProps = {
    isOpen: true,
    closeModal,
    onClose,
    submit,
    requestState,
  };

  const newOCPSubscription = (supportLevel, systemUnits, status) => ({
    id: '0',
    [SUPPORT_LEVEL]: supportLevel,
    [USAGE]: PRODUCTION,
    [SERVICE_LEVEL]: L1_L3,
    [PRODUCT_BUNDLE]: OPENSHIFT,
    [SYSTEM_UNITS]: systemUnits,
    status,
    capabilities: [],
  });

  const withStandardSub = (sub) => {
    sub.capabilities.push({ name: SUBSCRIBED_OCP, value: 'true' });
    return sub;
  };

  const withMarketplaceSub = (sub) => {
    sub.capabilities.push({ name: SUBSCRIBED_OCP_MARKETPLACE, value: 'true' });
    return sub;
  };

  afterEach(() => {
    jest.clearAllMocks();
  });
  it.only('renders correctly', () => {
    const subscription = withStandardSub(newOCPSubscription(STANDARD, CORES_VCPU, ACTIVE));

    render(<EditSubscriptionSettingsDialog {...baseProps} subscription={subscription} />);

    expect(billingModelInfoAlert()).toBeInTheDocument();

    expect(supportPremiumRadio()).toBeEnabled();
    expect(supportStandardRadio()).toBeEnabled();
    expect(supportSelfSupport()).toBeEnabled();

    expect(usageProductionRadio()).toBeEnabled();
    expect(usageDevelopmentRadio()).toBeEnabled();
    expect(usageDisasterRadio()).toBeEnabled();

    expect(serviceLevelL1Radio()).toBeEnabled();
    expect(serviceLevelL3Radio()).toBeEnabled();

    expect(systemUnitsCoresRadio()).toBeEnabled();
    expect(systemUnitsSocketsRadio()).toBeEnabled();

    expect(cpuSocketNumberText()).toBeInTheDocument();

    expect(saveButton()).toBeEnabled();
    expect(cancelButton()).toBeEnabled();
  });

  it.only('renders eval support correctly', () => {
    const subscription = withStandardSub(newOCPSubscription(EVAL, SOCKETS, ACTIVE));
    render(<EditSubscriptionSettingsDialog {...baseProps} subscription={subscription} />);

    expect(billingModelInfoAlert()).toBeInTheDocument();

    expect(supportPremiumRadio()).toBeEnabled();
    expect(supportStandardRadio()).toBeEnabled();
    expect(supportSelfSupport()).toBeEnabled();
    expect(screen.getByRole('radio', { name: 'Self-Support 60-day evaluation' })).toBeEnabled();

    expect(usageProductionRadio()).toBeDisabled();
    expect(usageDevelopmentRadio()).toBeDisabled();
    expect(usageDisasterRadio()).toBeDisabled();

    expect(serviceLevelL1Radio()).toBeDisabled();
    expect(serviceLevelL3Radio()).toBeDisabled();

    expect(systemUnitsCoresRadio()).toBeDisabled();
    expect(systemUnitsSocketsRadio()).toBeDisabled();

    expect(screen.getByText('0 Sockets')).toBeInTheDocument();

    expect(saveButton()).toBeDisabled();
    expect(cancelButton()).toBeEnabled();
  });

  it.only('renders none support correctly', () => {
    const subscription = withStandardSub(newOCPSubscription(NONE, CPU_TOTAL, DISCONNECTED));
    render(<EditSubscriptionSettingsDialog {...baseProps} subscription={subscription} />);

    expect(billingModelInfoAlert()).toBeInTheDocument();

    expect(supportPremiumRadio()).toBeEnabled();
    expect(supportStandardRadio()).toBeEnabled();
    expect(supportSelfSupport()).toBeEnabled();
    expect(screen.getByText('Expired evaluation')).toBeInTheDocument();

    expect(usageProductionRadio()).toBeDisabled();
    expect(usageDevelopmentRadio()).toBeDisabled();
    expect(usageDisasterRadio()).toBeDisabled();

    expect(serviceLevelL1Radio()).toBeDisabled();
    expect(serviceLevelL3Radio()).toBeDisabled();

    expect(systemUnitsCoresRadio()).toBeDisabled();
    expect(systemUnitsSocketsRadio()).toBeDisabled();

    expect(
      screen.getByRole('spinbutton', {
        name: 'Number of compute cores (excluding control plane nodes)',
      }),
    ).toBeDisabled();

    expect(saveButton()).toBeDisabled();
    expect(cancelButton()).toBeInTheDocument();
  });

  it.only('renders correctly with billing_model: marketplace', () => {
    const subscription = withMarketplaceSub(newOCPSubscription(STANDARD, CORES_VCPU, ACTIVE));
    render(<EditSubscriptionSettingsDialog {...baseProps} subscription={subscription} />);

    expect(billingModelInfoAlert()).toBeInTheDocument();

    expect(supportPremiumRadio()).toBeDisabled();
    expect(supportStandardRadio()).toBeDisabled();
    expect(supportSelfSupport()).toBeDisabled();

    expect(usageDevelopmentRadio()).toBeDisabled();
    expect(usageDisasterRadio()).toBeDisabled();
    expect(usageProductionRadio()).toBeDisabled();

    expect(serviceLevelL1Radio()).toBeDisabled();
    expect(serviceLevelL3Radio()).toBeDisabled();

    expect(systemUnitsCoresRadio()).toBeDisabled();
    expect(systemUnitsSocketsRadio()).toBeDisabled();

    expect(cpuSocketNumberText()).toBeInTheDocument();

    expect(saveButton()).toBeEnabled();
    expect(cancelButton()).toBeInTheDocument();
  });

  it.only('renders correctly with billing_model: 1st time standard + marketplace', () => {
    const subscription = withMarketplaceSub(
      withStandardSub(newOCPSubscription(EVAL, CORES_VCPU, ACTIVE)),
    );

    render(<EditSubscriptionSettingsDialog {...baseProps} subscription={subscription} />);

    expect(billingModelInfoAlert()).toBeInTheDocument();

    expect(
      screen.getByRole('radio', { name: 'Annual: Fixed capacity subscription from Red Hat' }),
    ).toBeEnabled();
    expect(
      screen.getByRole('radio', {
        name: 'On-Demand (Hourly): Flexible usage billed through Red Hat Marketplace',
      }),
    ).toBeEnabled();

    expect(supportPremiumRadio()).toBeEnabled();
    expect(supportStandardRadio()).toBeEnabled();
    expect(supportSelfSupport()).toBeEnabled();
    expect(screen.getByRole('radio', { name: 'Self-Support 60-day evaluation' })).toBeEnabled();

    expect(usageProductionRadio()).toBeDisabled();
    expect(usageDevelopmentRadio()).toBeDisabled();
    expect(usageDisasterRadio()).toBeDisabled();

    expect(serviceLevelL1Radio()).toBeDisabled();
    expect(serviceLevelL3Radio()).toBeDisabled();

    expect(systemUnitsCoresRadio()).toBeDisabled();
    expect(systemUnitsSocketsRadio()).toBeDisabled();

    expect(cpuSocketNumberText()).toBeInTheDocument();

    expect(saveButton()).toBeDisabled();
    expect(cancelButton()).toBeEnabled();
  });

  it.only('when cancelled, calls closeModal but not onClose ', async () => {
    const subscription = withStandardSub(newOCPSubscription(STANDARD, CORES_VCPU, ACTIVE));
    const { user } = render(
      <EditSubscriptionSettingsDialog {...baseProps} subscription={subscription} />,
    );
    expect(closeModal).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(closeModal).toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it.only('submits correctly', async () => {
    const subscription = withStandardSub(newOCPSubscription(STANDARD, CORES_VCPU, ACTIVE));

    const { user, rerender } = render(
      <EditSubscriptionSettingsDialog {...baseProps} subscription={subscription} />,
    );
    expect(submit).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(submit).toHaveBeenCalled();

    const fulfilledProps = {
      ...baseProps,
      requestState: {
        fulfilled: true,
        error: false,
        pending: false,
      },
    };
    expect(closeModal).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();

    rerender(<EditSubscriptionSettingsDialog {...fulfilledProps} subscription={subscription} />);

    await waitFor(() => {
      expect(closeModal).toHaveBeenCalled();
    });
    expect(onClose).toHaveBeenCalled();
  });

  it.only('renders correctly when an erorr occurs', () => {
    const subscription = withStandardSub(newOCPSubscription(STANDARD, CORES_VCPU, ACTIVE));

    const errorProps = {
      ...baseProps,
      requestState: {
        fulfilled: true,
        error: true,
        errorMessage: 'this is an error',
        pending: false,
      },
    };

    render(<EditSubscriptionSettingsDialog {...errorProps} subscription={subscription} />);
    expect(within(screen.getByRole('alert')).getByText('this is an error')).toBeInTheDocument();
  });
});
