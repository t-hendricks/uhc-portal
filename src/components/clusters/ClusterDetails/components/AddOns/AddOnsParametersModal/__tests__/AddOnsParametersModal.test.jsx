import React from 'react';

import { render, checkAccessibility, screen, within } from '~/testUtils';

import { reduxForm } from 'redux-form';
import { reduxFormConfig } from '../index';

import AddOnsParametersModal from '../AddOnsParametersModal';
import fixtures from '../../../../__tests__/ClusterDetails.fixtures';

const dummyValue = 'dummy value';

describe('<AddOnsParametersModal />', () => {
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
    render(<ReduxFormAddOnParametersModal {...props} />);

    expect(screen.getByRole('button', { name: `Use default: ${dummyValue}` })).toBeInTheDocument();
  });

  it('expect addon field to be enabled on create form', () => {
    render(<ReduxFormAddOnParametersModal {...props} />);

    expect(screen.getByRole('textbox')).not.toBeDisabled();
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-disabled');
  });

  it('expect addon field placeholder to equal default value', () => {
    render(<ReduxFormAddOnParametersModal {...props} />);
    expect(screen.getByPlaceholderText(dummyValue)).toBeInTheDocument();
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

    const newProps = { ...props, addOn };
    render(<ReduxFormAddOnParametersModal {...newProps} />);

    expect(screen.queryByRole('button', { name: /Use default/ })).not.toBeInTheDocument();
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

    const newProps = {
      ...props,
      addOn,
      isUpdateForm: true,
    };
    render(<ReduxFormAddOnParametersModal {...newProps} />);

    expect(screen.getByRole('textbox')).toBeDisabled();
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

    const newProps = { ...props, addOn };
    render(<ReduxFormAddOnParametersModal {...newProps} />);

    const options = within(screen.getByRole('combobox')).getAllByRole('option');
    expect(options).toHaveLength(2);

    ['-- Please Select --', 'Option 1'].forEach((optionText, index) => {
      expect(options[index]).toHaveTextContent(optionText);
    });
  });
});
