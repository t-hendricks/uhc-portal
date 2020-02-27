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
} from '../../../../common/subscriptionTypes';


// TODO: either add back or remove PRODUCT_BUNDLE
const {
  SUPPORT_LEVEL,
  USAGE,
  SERVICE_LEVEL,
  PRODUCT_BUNDLE,
  SYSTEM_UNITS,
} = subscriptionSettings;

const {
  EVAL,
  STANDARD,
  NONE,
} = subscriptionSupportLevels;

const {
  L1_L3,
} = subscriptionServiceLevels;

const {
  PRODUCTION,
} = subscriptionUsages;

const {
  OPENSHIFT,
} = subscriptionProductBundles;

const {
  CORES_VCPU,
} = subscriptionSystemUnits;


describe('<EditSubscriptionSettingsDialog />', () => {
  let wrapper;
  let closeModal;
  let onClose;
  let submit;
  let subscription;
  let requestState;
  const radioSelector = name => (`ReduxFormRadioGroup[name="${name}"] Radio`);
  const disabledGroupSelector = name => (`ReduxFormRadioGroup[name="${name}"][isDisabled=true]`);
  const buttonSelector = variant => (`Button[variant="${variant}"]`);
  const disabledButtonSelector = variant => (`Button[variant="${variant}"][isDisabled=true]`);

  beforeEach(() => {
    closeModal = jest.fn();
    onClose = jest.fn();
    submit = jest.fn();
    subscription = {
      id: '0',
      [SUPPORT_LEVEL]: STANDARD,
      [USAGE]: PRODUCTION,
      [SERVICE_LEVEL]: L1_L3,
      [PRODUCT_BUNDLE]: OPENSHIFT,
      [SYSTEM_UNITS]: CORES_VCPU,
    };
    requestState = {
      fulfilled: false,
      error: false,
      pending: false,
    };
    wrapper = mount(<EditSubscriptionSettingsDialog
      isOpen
      closeModal={closeModal}
      onClose={onClose}
      submit={submit}
      subscription={subscription}
      requestState={requestState}
    />);
  });

  it('renders correctly', () => {
    wrapper.setProps({ subscription });
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(ReduxFormRadioGroup).length).toEqual(4);
    expect(wrapper.find(disabledGroupSelector(SUPPORT_LEVEL)).length).toEqual(0);
    expect(wrapper.find(radioSelector(SUPPORT_LEVEL)).length).toEqual(3);
    expect(wrapper.find(disabledGroupSelector(USAGE)).length).toEqual(0);
    expect(wrapper.find(radioSelector(USAGE)).length).toEqual(3);
    expect(wrapper.find(disabledGroupSelector(SERVICE_LEVEL)).length).toEqual(0);
    expect(wrapper.find(radioSelector(SERVICE_LEVEL)).length).toEqual(2);
    // expect(wrapper.find(disabledGroupSelector(PRODUCT_BUNDLE)).length).toEqual(0);
    // expect(wrapper.find(radioSelector(PRODUCT_BUNDLE)).length).toEqual(3);
    expect(wrapper.find(disabledGroupSelector(SYSTEM_UNITS)).length).toEqual(0);
    expect(wrapper.find(radioSelector(SYSTEM_UNITS)).length).toEqual(2);
    expect(wrapper.find(buttonSelector('primary')).length).toEqual(1);
    expect(wrapper.find(buttonSelector('secondary')).length).toEqual(1);
    expect(wrapper.find(disabledButtonSelector('primary')).length).toEqual(0);
  });

  it('renders eval support correctly', () => {
    wrapper.setProps({ subscription: { ...subscription, [SUPPORT_LEVEL]: EVAL } });
    expect(wrapper.find(ReduxFormRadioGroup).length).toEqual(4);
    expect(wrapper.find(disabledGroupSelector(SUPPORT_LEVEL)).length).toEqual(0);
    expect(wrapper.find(radioSelector(SUPPORT_LEVEL)).length).toEqual(4);
    expect(wrapper.find(disabledGroupSelector(USAGE)).length).toEqual(1);
    expect(wrapper.find(radioSelector(USAGE)).length).toEqual(3);
    expect(wrapper.find(disabledGroupSelector(SERVICE_LEVEL)).length).toEqual(1);
    expect(wrapper.find(radioSelector(SERVICE_LEVEL)).length).toEqual(2);
    // expect(wrapper.find(disabledGroupSelector(PRODUCT_BUNDLE)).length).toEqual(1);
    // expect(wrapper.find(radioSelector(PRODUCT_BUNDLE)).length).toEqual(3);
    expect(wrapper.find(disabledGroupSelector(SYSTEM_UNITS)).length).toEqual(1);
    expect(wrapper.find(radioSelector(SYSTEM_UNITS)).length).toEqual(2);
    expect(wrapper.find(buttonSelector('primary')).length).toEqual(1);
    expect(wrapper.find(buttonSelector('secondary')).length).toEqual(1);
    expect(wrapper.find(disabledButtonSelector('primary')).length).toEqual(1);
  });

  it('renders none support correctly', () => {
    wrapper.setProps({ subscription: { ...subscription, [SUPPORT_LEVEL]: NONE } });
    expect(wrapper.find(ReduxFormRadioGroup).length).toEqual(4);
    expect(wrapper.find(disabledGroupSelector(SUPPORT_LEVEL)).length).toEqual(0);
    expect(wrapper.find(radioSelector(SUPPORT_LEVEL)).length).toEqual(4);
    expect(wrapper.find(disabledGroupSelector(USAGE)).length).toEqual(1);
    expect(wrapper.find(radioSelector(USAGE)).length).toEqual(3);
    expect(wrapper.find(disabledGroupSelector(SERVICE_LEVEL)).length).toEqual(1);
    expect(wrapper.find(radioSelector(SERVICE_LEVEL)).length).toEqual(2);
    // expect(wrapper.find(disabledGroupSelector(PRODUCT_BUNDLE)).length).toEqual(1);
    // expect(wrapper.find(radioSelector(PRODUCT_BUNDLE)).length).toEqual(3);
    expect(wrapper.find(disabledGroupSelector(SYSTEM_UNITS)).length).toEqual(1);
    expect(wrapper.find(radioSelector(SYSTEM_UNITS)).length).toEqual(2);
    expect(wrapper.find(buttonSelector('primary')).length).toEqual(1);
    expect(wrapper.find(buttonSelector('secondary')).length).toEqual(1);
    expect(wrapper.find(disabledButtonSelector('primary')).length).toEqual(1);
  });

  it('when cancelled, calls closeModal but not onClose ', () => {
    wrapper.find(buttonSelector('secondary')).at(0).simulate('click');
    expect(closeModal).toBeCalled();
    expect(onClose).not.toBeCalled();
  });

  it('submits correctly', () => {
    wrapper.setProps({ subscription });
    wrapper.find(buttonSelector('primary')).at(0).simulate('click');
    expect(submit).toBeCalled();
    wrapper.setProps({ requestState: { fulfilled: true } });
    setTimeout(() => {
      expect(closeModal).toBeCalled();
      expect(onClose).toBeCalled();
    }, 0);
  });

  it('renders correctly when an erorr occurs', () => {
    wrapper.setProps({ requestState: { error: true, errorMessage: 'this is an error' } });
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(ErrorBox).length).toEqual(1);
  });
});
