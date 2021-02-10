import React from 'react';
import { shallow } from 'enzyme';
import { Button } from '@patternfly/react-core';
import { Field } from 'redux-form';

import AddOnsParametersModal from '../AddOnsParametersModal';

const dummyValue = 'dummy value';

describe('<AddOnsParametersModal />', () => {
  let wrapper;
  let closeModal;
  let clearClusterAddOnsResponses;
  let resetForm;
  let change;
  let handleSubmit;
  beforeAll(() => {
    closeModal = jest.fn();
    clearClusterAddOnsResponses = jest.fn();
    resetForm = jest.fn();
    change = jest.fn();
    handleSubmit = jest.fn();
    wrapper = shallow(
      <AddOnsParametersModal
        isOpen
        closeModal={closeModal}
        resetForm={resetForm}
        addOn={{
          description: 'Dummy Desc',
          enabled: true,
          editable: true,
          id: 'Dummy ID',
          name: 'Dummy Name',
          parameters: {
            items: [{
              id: 'dummy item',
              enabled: true,
              editable: true,
              default_value: dummyValue,
            }],
          },
        }}
        addOnInstallation={{
          id: 'Dummy ID',
          parameters: {
            items: [{
              id: 'dummy item',
            }],
          },
        }}
        isUpdateForm={false}
        submitClusterAddOnResponse={{ fulfilled: false, pending: false, error: false }}
        clearClusterAddOnsResponses={clearClusterAddOnsResponses}
        pristine
        change={change}
        handleSubmit={handleSubmit}
      />,
    );
  });
  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('expect set default option button is be present if default_value present', () => {
    expect(wrapper.find(Button).props().children[2]).toEqual(dummyValue);
  });

  it('expect addon field to be enabled on create form', () => {
    expect(wrapper.find(Field).props().isDisabled).toBeFalsy();
  });

  it('expect addon field placeholder to equal default value', () => {
    expect(wrapper.find(Field).props().placeholder).toEqual(dummyValue);
  });

  it('expect set default option to be absent if no default_value is present', () => {
    const addOn = {
      description: 'Dummy Desc',
      enabled: true,
      editable: true,
      id: 'Dummy ID',
      name: 'Dummy Name',
      parameters: {
        items: [{
          id: 'dummy item',
          enabled: true,
          editable: true,
        }],
      },
    };
    wrapper.setProps({ addOn }, () => {
      expect(wrapper.find(Button).exists()).toBeFalsy();
    });
  });

  it('expect addon field to be disabled on update form, if param is not editable', () => {
    const addOn = {
      description: 'Dummy Desc',
      enabled: true,
      editable: true,
      id: 'Dummy ID',
      name: 'Dummy Name',
      parameters: {
        items: [{
          id: 'dummy item',
          enabled: true,
          editable: false,
        }],
      },
    };
    const isUpdateForm = true;
    wrapper.setProps({ addOn, isUpdateForm }, () => {
      expect(wrapper.find(Field).props().isDisabled).toBeTruthy();
    });
  });
});
