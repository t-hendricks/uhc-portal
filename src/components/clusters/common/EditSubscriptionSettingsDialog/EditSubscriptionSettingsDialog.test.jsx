import React from 'react';
import { mount } from 'enzyme';

import EditSubscriptionSettingsDialog from './EditSubscriptionSettingsDialog';
import { ReduxFormRadioGroup } from '../../../common/ReduxFormComponents';
import ErrorBox from '../../../common/ErrorBox';
import {
  subscriptionSettings,
  subscriptionSupportLevels,
  subscriptionServiceLevels,
  subscriptionUsages,
  subscriptionProductBundles,
  subscriptionSystemUnits,
  subscriptionStatuses,
} from '../../../../common/subscriptionTypes';
import { subscriptionCapabilities } from '../../../../common/subscriptionCapabilities';

// TODO: either add back or remove PRODUCT_BUNDLE
const {
  SUPPORT_LEVEL,
  USAGE,
  SERVICE_LEVEL,
  PRODUCT_BUNDLE,
  SYSTEM_UNITS,
  CLUSTER_BILLING_MODEL,
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
  const radioSelector = (name) => `ReduxFormRadioGroup[name="${name}"] Radio`;
  const disabledGroupSelector = (name) => `ReduxFormRadioGroup[name="${name}"][isDisabled=true]`;
  const numberInputSelector = (name) => `NumberInput[inputName="${name}"]`;
  const cpuSocketNumberText = 'span[id="cpu-socket-value"]';
  const buttonSelector = (variant) => `Button[variant="${variant}"]`;
  const disabledButtonSelector = (variant) => `Button[variant="${variant}"][isDisabled=true]`;
  const billingModelInfoSelector = 'Alert[id="subscription-settings-cluster-billing-model-alert"]';

  const newOCPSubscription = (supportLeve, systemUnits, status) => ({
    id: '0',
    [SUPPORT_LEVEL]: supportLeve,
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

  const getTestContext = (subscription) => {
    const closeModal = jest.fn();
    const onClose = jest.fn();
    const submit = jest.fn();
    const requestState = {
      fulfilled: false,
      error: false,
      pending: false,
    };
    const wrapper = mount(
      <EditSubscriptionSettingsDialog
        isOpen
        closeModal={closeModal}
        onClose={onClose}
        submit={submit}
        subscription={subscription}
        requestState={requestState}
      />,
    );
    return {
      wrapper,
      submit,
      closeModal,
      onClose,
    };
  };

  it('renders correctly', () => {
    const subscription = withStandardSub(newOCPSubscription(STANDARD, CORES_VCPU, ACTIVE));
    const { wrapper } = getTestContext(subscription);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(ReduxFormRadioGroup).length).toEqual(4);
    expect(wrapper.find(billingModelInfoSelector).length).toEqual(1);
    expect(wrapper.find(disabledGroupSelector(CLUSTER_BILLING_MODEL)).length).toEqual(0);
    expect(wrapper.find(radioSelector(CLUSTER_BILLING_MODEL)).length).toEqual(0);
    expect(wrapper.find(disabledGroupSelector(SUPPORT_LEVEL)).length).toEqual(0);
    expect(wrapper.find(radioSelector(SUPPORT_LEVEL)).length).toEqual(3);
    expect(wrapper.find(disabledGroupSelector(USAGE)).length).toEqual(0);
    expect(wrapper.find(radioSelector(USAGE)).length).toEqual(3);
    expect(wrapper.find(disabledGroupSelector(SERVICE_LEVEL)).length).toEqual(0);
    expect(wrapper.find(radioSelector(SERVICE_LEVEL)).length).toEqual(2);
    expect(wrapper.find(disabledGroupSelector(SYSTEM_UNITS)).length).toEqual(0);
    expect(wrapper.find(radioSelector(SYSTEM_UNITS)).length).toEqual(2);
    expect(wrapper.find(cpuSocketNumberText).length).toEqual(1);
    expect(wrapper.find(buttonSelector('primary')).length).toEqual(1);
    expect(wrapper.find(buttonSelector('secondary')).length).toEqual(1);
    expect(wrapper.find(disabledButtonSelector('primary')).length).toEqual(0);
  });

  it('renders eval support correctly', () => {
    const subscription = withStandardSub(newOCPSubscription(EVAL, SOCKETS, ACTIVE));
    const { wrapper } = getTestContext(subscription);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(ReduxFormRadioGroup).length).toEqual(4);
    expect(wrapper.find(billingModelInfoSelector).length).toEqual(1);
    expect(wrapper.find(disabledGroupSelector(CLUSTER_BILLING_MODEL)).length).toEqual(0);
    expect(wrapper.find(radioSelector(CLUSTER_BILLING_MODEL)).length).toEqual(0);
    expect(wrapper.find(disabledGroupSelector(SUPPORT_LEVEL)).length).toEqual(0);
    expect(wrapper.find(radioSelector(SUPPORT_LEVEL)).length).toEqual(4);
    expect(wrapper.find(disabledGroupSelector(USAGE)).length).toEqual(1);
    expect(wrapper.find(radioSelector(USAGE)).length).toEqual(3);
    expect(wrapper.find(disabledGroupSelector(SERVICE_LEVEL)).length).toEqual(1);
    expect(wrapper.find(radioSelector(SERVICE_LEVEL)).length).toEqual(2);
    expect(wrapper.find(disabledGroupSelector(SYSTEM_UNITS)).length).toEqual(1);
    expect(wrapper.find(radioSelector(SYSTEM_UNITS)).length).toEqual(2);
    expect(wrapper.find(cpuSocketNumberText).length).toEqual(1);
    expect(wrapper.find(buttonSelector('primary')).length).toEqual(1);
    expect(wrapper.find(buttonSelector('secondary')).length).toEqual(1);
    expect(wrapper.find(disabledButtonSelector('primary')).length).toEqual(1);
  });

  it('renders none support correctly', () => {
    const subscription = withStandardSub(newOCPSubscription(NONE, CPU_TOTAL, DISCONNECTED));
    const { wrapper } = getTestContext(subscription);
    expect(wrapper.find(ReduxFormRadioGroup).length).toEqual(4);
    expect(wrapper.find(billingModelInfoSelector).length).toEqual(1);
    expect(wrapper.find(disabledGroupSelector(CLUSTER_BILLING_MODEL)).length).toEqual(0);
    expect(wrapper.find(radioSelector(CLUSTER_BILLING_MODEL)).length).toEqual(0);
    expect(wrapper.find(disabledGroupSelector(SUPPORT_LEVEL)).length).toEqual(0);
    expect(wrapper.find(radioSelector(SUPPORT_LEVEL)).length).toEqual(4);
    expect(wrapper.find(disabledGroupSelector(USAGE)).length).toEqual(1);
    expect(wrapper.find(radioSelector(USAGE)).length).toEqual(3);
    expect(wrapper.find(disabledGroupSelector(SERVICE_LEVEL)).length).toEqual(1);
    expect(wrapper.find(radioSelector(SERVICE_LEVEL)).length).toEqual(2);
    expect(wrapper.find(disabledGroupSelector(SYSTEM_UNITS)).length).toEqual(1);
    expect(wrapper.find(radioSelector(SYSTEM_UNITS)).length).toEqual(2);
    expect(wrapper.find(numberInputSelector(CPU_TOTAL)).length).toEqual(1);
    expect(wrapper.find(buttonSelector('primary')).length).toEqual(1);
    expect(wrapper.find(buttonSelector('secondary')).length).toEqual(1);
    expect(wrapper.find(disabledButtonSelector('primary')).length).toEqual(1);
  });

  it('renders correctly with billing_model: marketplace', () => {
    const subscription = withMarketplaceSub(newOCPSubscription(STANDARD, CORES_VCPU, ACTIVE));
    const { wrapper } = getTestContext(subscription);
    expect(wrapper.find(ReduxFormRadioGroup).length).toEqual(4);
    expect(wrapper.find(billingModelInfoSelector).length).toEqual(1);
    expect(wrapper.find(disabledGroupSelector(CLUSTER_BILLING_MODEL)).length).toEqual(0);
    expect(wrapper.find(radioSelector(CLUSTER_BILLING_MODEL)).length).toEqual(0);
    expect(wrapper.find(disabledGroupSelector(SUPPORT_LEVEL)).length).toEqual(1);
    expect(wrapper.find(radioSelector(SUPPORT_LEVEL)).length).toEqual(3);
    expect(wrapper.find(disabledGroupSelector(USAGE)).length).toEqual(1);
    expect(wrapper.find(radioSelector(USAGE)).length).toEqual(3);
    expect(wrapper.find(disabledGroupSelector(SERVICE_LEVEL)).length).toEqual(1);
    expect(wrapper.find(radioSelector(SERVICE_LEVEL)).length).toEqual(2);
    expect(wrapper.find(disabledGroupSelector(SYSTEM_UNITS)).length).toEqual(1);
    expect(wrapper.find(radioSelector(SYSTEM_UNITS)).length).toEqual(2);
    expect(wrapper.find(cpuSocketNumberText).length).toEqual(1);
    // all are disabled due to pre-set, but the button should still be enabled.
    expect(wrapper.find(buttonSelector('primary')).length).toEqual(1);
    expect(wrapper.find(buttonSelector('secondary')).length).toEqual(1);
    expect(wrapper.find(disabledButtonSelector('primary')).length).toEqual(0);
  });

  it('renders correctly with billing_model: 1st time standard + marketplace', () => {
    const subscription = withMarketplaceSub(
      withStandardSub(newOCPSubscription(EVAL, CORES_VCPU, ACTIVE)),
    );
    const { wrapper } = getTestContext(subscription);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(ReduxFormRadioGroup).length).toEqual(5);
    expect(wrapper.find(billingModelInfoSelector).length).toEqual(1);
    expect(wrapper.find(disabledGroupSelector(CLUSTER_BILLING_MODEL)).length).toEqual(0);
    expect(wrapper.find(radioSelector(CLUSTER_BILLING_MODEL)).length).toEqual(2);
    expect(wrapper.find(disabledGroupSelector(SUPPORT_LEVEL)).length).toEqual(0);
    expect(wrapper.find(radioSelector(SUPPORT_LEVEL)).length).toEqual(4);
    expect(wrapper.find(disabledGroupSelector(USAGE)).length).toEqual(1);
    expect(wrapper.find(radioSelector(USAGE)).length).toEqual(3);
    expect(wrapper.find(disabledGroupSelector(SERVICE_LEVEL)).length).toEqual(1);
    expect(wrapper.find(radioSelector(SERVICE_LEVEL)).length).toEqual(2);
    expect(wrapper.find(disabledGroupSelector(SYSTEM_UNITS)).length).toEqual(1);
    expect(wrapper.find(radioSelector(SYSTEM_UNITS)).length).toEqual(2);
    expect(wrapper.find(cpuSocketNumberText).length).toEqual(1);
    expect(wrapper.find(buttonSelector('primary')).length).toEqual(1);
    expect(wrapper.find(buttonSelector('secondary')).length).toEqual(1);
    expect(wrapper.find(disabledButtonSelector('primary')).length).toEqual(1);
  });

  it('when cancelled, calls closeModal but not onClose ', () => {
    const subscription = withStandardSub(newOCPSubscription(STANDARD, CORES_VCPU, ACTIVE));
    const { wrapper, closeModal, onClose } = getTestContext(subscription);
    wrapper.find(buttonSelector('secondary')).at(0).simulate('click');
    expect(closeModal).toBeCalled();
    expect(onClose).not.toBeCalled();
  });

  it('submits correctly', () => {
    const subscription = withStandardSub(newOCPSubscription(STANDARD, CORES_VCPU, ACTIVE));
    const { wrapper, submit, closeModal, onClose } = getTestContext(subscription);
    wrapper.find(buttonSelector('primary')).at(0).simulate('click');
    expect(submit).toBeCalled();
    wrapper.setProps({ requestState: { fulfilled: true } });
    setTimeout(() => {
      expect(closeModal).toBeCalled();
      expect(onClose).toBeCalled();
    }, 0);
  });

  it('renders correctly when an erorr occurs', () => {
    const subscription = withStandardSub(newOCPSubscription(STANDARD, CORES_VCPU, ACTIVE));
    const { wrapper } = getTestContext(subscription);
    wrapper.setProps({ requestState: { error: true, errorMessage: 'this is an error' } });
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(ErrorBox).length).toEqual(1);
  });
});
