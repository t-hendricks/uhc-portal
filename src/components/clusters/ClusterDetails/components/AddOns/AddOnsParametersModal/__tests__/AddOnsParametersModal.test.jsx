import React from 'react';
import { shallow } from 'enzyme';

import { render, checkAccessibility } from '~/testUtils';
import { Button } from '@patternfly/react-core';
import { Field, reduxForm } from 'redux-form';
import { reduxFormConfig } from '../index';

import AddOnsParametersModal from '../AddOnsParametersModal';
import fixtures from '../../../../__tests__/ClusterDetails.fixtures';

const dummyValue = 'dummy value';

describe('<AddOnsParametersModal />', () => {
  let wrapper;
  const closeModal = jest.fn();
  const clearClusterAddOnsResponses = jest.fn();
  const quota = {};
  const resetForm = jest.fn();
  const change = jest.fn();
  const handleSubmit = jest.fn();

  const { clusterDetails } = fixtures;

  const ReduxFormAddOnParametersModal = reduxForm(reduxFormConfig)(AddOnsParametersModal);

  const props = {
    isOpen: true,
    closeModal,
    resetForm,
    addOn: {
      description: 'Dummy Desc',
      enabled: true,
      editable: true,
      id: 'Dummy ID',
      name: 'Dummy Name',
      parameters: {
        items: [
          {
            id: 'dummy item',
            enabled: true,
            editable: true,
            default_value: dummyValue,
          },
        ],
      },
    },
    addOnInstallation: {
      id: 'Dummy ID',
      parameters: {
        items: [
          {
            id: 'dummy item',
          },
        ],
      },
    },
    isUpdateForm: false,
    submitClusterAddOnResponse: { fulfilled: false, pending: false, error: false },
    clearClusterAddOnsResponses,
    pristine: true,
    change,
    handleSubmit,
    quota,
    cluster: clusterDetails.cluster,
  };

  beforeEach(() => {
    wrapper = shallow(<AddOnsParametersModal {...props} />);
  });

  afterEach(() => {
    closeModal.mockClear();
    clearClusterAddOnsResponses.mockClear();
    resetForm.mockClear();
    change.mockClear();
    handleSubmit.mockClear();
  });

  it('is accessible', async () => {
    const { container } = render(<ReduxFormAddOnParametersModal {...props} />);
    await checkAccessibility(container);
  });

  it('expect set default option button is be present if default_value present', () => {
    expect(wrapper.find(Button).props().children.includes(dummyValue)).toBeTruthy();
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
        items: [
          {
            id: 'dummy item',
            enabled: true,
            editable: true,
          },
        ],
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
        items: [
          {
            id: 'dummy item',
            enabled: true,
            editable: false,
          },
        ],
      },
    };
    const isUpdateForm = true;
    wrapper.setProps({ addOn, isUpdateForm }, () => {
      expect(wrapper.find(Field).props().isDisabled).toBeTruthy();
    });
  });

  it('expect addon field to populate options', () => {
    const addOn = {
      description: 'Dummy Desc',
      enabled: true,
      editable: true,
      id: 'Dummy ID',
      name: 'Dummy Name',
      parameters: {
        items: [
          {
            id: 'dummy item',
            options: [
              {
                name: 'Option 1',
                value: 'option1',
              },
            ],
            enabled: true,
            editable: false,
          },
        ],
      },
    };
    wrapper.setProps({ addOn }, () => {
      expect(wrapper.find(Field).props().options).toEqual([
        { name: '-- Please Select --', value: undefined },
        { name: 'Option 1', value: 'option1' },
      ]);
    });
  });

  it('expect default value text to be populated by option name', () => {
    const addOn = {
      description: 'Dummy Desc',
      enabled: true,
      editable: true,
      id: 'Dummy ID',
      name: 'Dummy Name',
      parameters: {
        items: [
          {
            id: 'dummy item',
            options: [
              {
                name: 'Option 1',
                value: 'option1',
              },
            ],
            default_value: 'option1',
            enabled: true,
            editable: true,
          },
        ],
      },
    };
    wrapper.setProps({ addOn }, () => {
      expect(wrapper.find(Field).props().options).toEqual([
        { name: '-- Please Select --', value: undefined },
        { name: 'Option 1', value: 'option1' },
      ]);
      expect(wrapper.find(Button).exists()).toBeTruthy();
      expect(wrapper.find(Button).props().children.includes('Option 1')).toBeTruthy();
    });
  });
});
