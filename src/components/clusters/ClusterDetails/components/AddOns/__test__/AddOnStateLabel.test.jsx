import React from 'react';
import { shallow } from 'enzyme';

import AddOnStateLabel from '../AddOnStateLabel';
import AddOnsConstants from '../AddOnsConstants';

describe('<AddOnsStateLabel />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <AddOnStateLabel
        addOn={{}}
        installedAddOn={{
          state: AddOnsConstants.INSTALLATION_STATE.READY,
        }}
        requirements={{ fulfilled: true, errorMsgs: [] }}
      />,
    );
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render installed label if state is ready', () => {
    const label = wrapper.find('Label').props();
    expect(label.children).toEqual('Installed');
    expect(label.icon.type.displayName).toEqual('CheckCircleIcon');
  });

  it('should render prerequisits not met if addon has requirements', () => {
    wrapper.setProps({
      addOn: {
        requirements: [
          {
            id: 'my-cluster-req',
            resource: 'cluster',
            data: {
              cloud_providerd: 'gcp',
            },
            enabled: true,
          },
        ],
      },
      requirements: { fulfilled: false, errorMsgs: [] },
    });
    const label = wrapper.find('Label').props();
    expect(label.children).toEqual('Prerequisites not met');
    expect(label.icon.type.displayName).toEqual('CubesIcon');
  });

  it('should render installing if addon is pending or installing', () => {
    wrapper.setProps({
      addOn: {},
      requirements: { fulfilled: true, errorMsgs: [] },
      installedAddOn: {
        state: AddOnsConstants.INSTALLATION_STATE.PENDING,
      },
    });
    const Label = wrapper.find('Label').props();
    expect(Label.children).toEqual('Installing');
    expect(Label.icon.type.displayName).toEqual('InProgressIcon');

    wrapper.setProps({
      addOn: {},
      requirements: { fulfilled: true, errorMsgs: [] },
      installedAddOn: {
        state: AddOnsConstants.INSTALLATION_STATE.INSTALLING,
      },
    });
    const newLabel = wrapper.find('Label').props();
    expect(newLabel.children).toEqual('Installing');
    expect(newLabel.icon.type.displayName).toEqual('InProgressIcon');
  });

  it('should render uninstalling if addon is deleted or deleting', () => {
    wrapper.setProps({
      addOn: {},
      requirements: { fulfilled: true, errorMsgs: [] },
      installedAddOn: {
        state: AddOnsConstants.INSTALLATION_STATE.DELETED,
      },
    });
    const label = wrapper.find('Label').props();
    expect(label.children).toEqual('Uninstalling');
    expect(label.icon.type.displayName).toEqual('InProgressIcon');

    wrapper.setProps({
      addOn: {},
      requirements: { fulfilled: true, errorMsgs: [] },
      installedAddOn: {
        state: AddOnsConstants.INSTALLATION_STATE.DELETING,
      },
    });
    const updatedLabel = wrapper.find('Label').props();
    expect(updatedLabel.children).toEqual('Uninstalling');
    expect(updatedLabel.icon.type.displayName).toEqual('InProgressIcon');
  });

  it('should render add-on failed if addon state is failed', () => {
    wrapper.setProps({
      addOn: {},
      requirements: { fulfilled: true, errorMsgs: [] },
      installedAddOn: {
        state: AddOnsConstants.INSTALLATION_STATE.FAILED,
      },
    });
    const label = wrapper.find('Label').props();
    expect(label.children).toEqual('Add-on failed');
    expect(label.icon.type.displayName).toEqual('ExclamationCircleIcon');
  });

  it('should render unknown if addon state is unknown', () => {
    wrapper.setProps({
      addOn: {},
      requirements: { fulfilled: true, errorMsgs: [] },
      installedAddOn: {
        state: 'something wrong',
      },
    });
    const label = wrapper.find('Label').props();
    expect(label.children).toEqual('Unknown');
    expect(label.icon.type.displayName).toEqual('UnknownIcon');
  });
});
