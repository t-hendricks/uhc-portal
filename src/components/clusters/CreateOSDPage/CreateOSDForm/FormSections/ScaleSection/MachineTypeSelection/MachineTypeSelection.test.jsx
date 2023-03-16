import React from 'react';
import { shallow } from 'enzyme';
import { render, screen, waitFor, userEvent } from '@testUtils';
import MachineTypeSelection from './MachineTypeSelection';

import {
  rhQuotaList,
  CCSQuotaList,
  CCSOneNodeRemainingQuotaList,
} from '../../../../../common/__test__/quota.fixtures';
import { mapMachineTypesById } from '../../../../../../../redux/reducers/machineTypesReducer';

const baseFlavoursState = {
  error: false,
  errorMessage: '',
  pending: false,
  fulfilled: false,
  byID: {
    // actually contains 'osd-4' key, but not supposed to peek at it until fulfilled
  },
};

const fulfilledFlavoursState = {
  ...baseFlavoursState,
  fulfilled: true,
  byID: {
    'osd-4': {
      aws: {
        compute_instance_type: 'm5.xlarge',
      },
      gcp: {
        compute_instance_type: 'custom-4-16384', // TODO not listed in machineTypes
      },
    },
  },
};

const baseState = {
  error: false,
  errorMessage: '',
  pending: false,
  fulfilled: false,
  types: {},
  typesByID: {},
};

const organizationState = {
  fulfilled: true,
  pending: false,
};

const machineTypes = {
  aws: [
    {
      kind: 'MachineType',
      name: 'm5.xlarge - General Purpose',
      category: 'general_purpose',
      size: 'small',
      id: 'm5.xlarge',
      href: '/api/clusters_mgmt/v1/machine_types/m5.xlarge',
      memory: {
        value: 17179869184,
        unit: 'B',
      },
      cpu: {
        value: 4,
        unit: 'vCPU',
      },
      cloud_provider: {
        kind: 'CloudProviderLink',
        id: 'aws',
        href: '/api/clusters_mgmt/v1/cloud_providers/aws',
      },
      ccs_only: false,
      generic_name: 'standard-4',
    },
    {
      kind: 'MachineType',
      name: 'm5.4xlarge - General Purpose',
      category: 'general_purpose',
      size: 'large',
      id: 'm5.4xlarge',
      href: '/api/clusters_mgmt/v1/machine_types/m5.4xlarge',
      memory: {
        value: 68719476736,
        unit: 'B',
      },
      cpu: {
        value: 16,
        unit: 'vCPU',
      },
      cloud_provider: {
        kind: 'CloudProviderLink',
        id: 'aws',
        href: '/api/clusters_mgmt/v1/cloud_providers/aws',
      },
      ccs_only: false,
      generic_name: 'standard-16',
    },
    {
      kind: 'MachineType',
      name: 'm5.12xlarge - General purpose',
      category: 'general_purpose',
      size: 'xxlarge',
      id: 'm5.12xlarge',
      href: '/api/clusters_mgmt/v1/machine_types/m5.12xlarge',
      memory: {
        value: 206158430208,
        unit: 'B',
      },
      cpu: {
        value: 48,
        unit: 'vCPU',
      },
      cloud_provider: {
        kind: 'CloudProviderLink',
        id: 'aws',
        href: '/api/clusters_mgmt/v1/cloud_providers/aws',
      },
      ccs_only: true,
      generic_name: 'standard-48',
    },
    {
      kind: 'MachineType',
      name: 'g4dn.2xlarge - Accelerated Computing (1 GPU)',
      category: 'accelerated_computing',
      size: 'medium',
      id: 'g4dn.2xlarge',
      href: '/api/clusters_mgmt/v1/machine_types/g4dn.2xlarge',
      memory: {
        value: 34359738368,
        unit: 'B',
      },
      cpu: {
        value: 8,
        unit: 'vCPU',
      },
      cloud_provider: {
        kind: 'CloudProviderLink',
        id: 'aws',
        href: '/api/clusters_mgmt/v1/cloud_providers/aws',
      },
      ccs_only: true,
      generic_name: 't4-gpu-8',
    },
  ],
};

const fulfilledMachineState = {
  ...baseState,
  fulfilled: true,
  types: machineTypes,
  typesByID: mapMachineTypesById(machineTypes),
};

const unknownCategoryMachineTypes = [
  {
    kind: 'MachineType',
    name: 'foo.2xbar - Quantum Computing (1 QPU)',
    category: 'foobar_computing',
    size: 'medium',
    id: 'foo.2xbar',
    href: '/api/clusters_mgmt/v1/machine_types/foo.2xbar',
    memory: {
      value: 34359738368,
      unit: 'B',
    },
    cpu: {
      value: 8,
      unit: 'vCPU',
    },
    cloud_provider: {
      kind: 'CloudProviderLink',
      id: 'aws',
      href: '/api/clusters_mgmt/v1/cloud_providers/aws',
    },
    ccs_only: false,
    generic_name: 'standard-4', // reusing existing one for simplicity, need to have quota for it.
  },
  {
    kind: 'MachineType',
    name: 'foo.4xbar - Quantum Computing (2 QPU)',
    category: 'foobar_computing',
    size: 'medium',
    id: 'foo.4xbar',
    href: '/api/clusters_mgmt/v1/machine_types/foo.4xbar',
    memory: {
      value: 34359738368,
      unit: 'B',
    },
    cpu: {
      value: 16,
      unit: 'vCPU',
    },
    cloud_provider: {
      kind: 'CloudProviderLink',
      id: 'aws',
      href: '/api/clusters_mgmt/v1/cloud_providers/aws',
    },
    ccs_only: false,
    generic_name: 'standard-4', // reusing existing one for simplicity, need to have quota for it.
  },
];

// A stateful redux-form field.
const fieldProps = (initialValue) => {
  const input = {
    value: initialValue,
    onChange: jest.fn((newValue) => {
      // Hack: this mutates the already passed prop.
      // Ideally to simulate redux/react, we should instead call wrapper.setProps(), afterwards?
      input.value = newValue;
    }),
  };
  return {
    input,
    meta: {
      error: false,
      touched: false,
    },
  };
};

describe('MachineTypeSelection', () => {
  it('flavours are fetched on render', () => {
    const field = fieldProps(undefined);
    const forceChoiceField = fieldProps(false);
    const getDefaultFlavour = jest.fn();
    const getMachineTypes = jest.fn();

    render(
      <MachineTypeSelection
        flavours={baseFlavoursState}
        machineTypes={baseState}
        machine_type={field}
        machine_type_force_choice={forceChoiceField}
        isMultiAz={false}
        quota={{}}
        organization={organizationState}
        getDefaultFlavour={getDefaultFlavour}
        getMachineTypes={getMachineTypes}
        isBYOC={false}
        cloudProviderID="aws"
        isMachinePool={false}
        product="OSD"
        billingModel="standard"
      />,
    );

    expect(getDefaultFlavour).toBeCalled();
  });

  describe('with an error loading machineTypes', () => {
    let field;
    let forceChoiceField;
    let getDefaultFlavour;
    let getMachineTypes;
    let wrapper;
    beforeEach(() => {
      const state = {
        ...baseState,
        error: true,
        errorMessage: 'This is an error message',
      };

      field = fieldProps(undefined);
      forceChoiceField = fieldProps(false);
      getDefaultFlavour = jest.fn();
      getMachineTypes = jest.fn();
      wrapper = shallow(
        <MachineTypeSelection
          flavours={fulfilledFlavoursState}
          machineTypes={state}
          machine_type={field}
          machine_type_force_choice={forceChoiceField}
          isMultiAz={false}
          quota={{}}
          organization={organizationState}
          getDefaultFlavour={getDefaultFlavour}
          getMachineTypes={getMachineTypes}
          isBYOC={false}
          cloudProviderID="aws"
          isMachinePool={false}
          product="OSD"
          billingModel="standard"
        />,
      );
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('when the request is pending', () => {
    let field;
    let forceChoiceField;
    let getDefaultFlavour;
    let getMachineTypes;
    let wrapper;
    const flavoursState = {
      ...baseFlavoursState,
      pending: true,
    };
    const state = {
      ...baseState,
      pending: true,
      fulfilled: false,
    };
    beforeEach(() => {
      field = fieldProps(undefined);
      forceChoiceField = fieldProps(false);
      getDefaultFlavour = jest.fn();
      getMachineTypes = jest.fn();
      wrapper = shallow(
        <MachineTypeSelection
          flavours={flavoursState}
          machineTypes={state}
          machine_type={field}
          machine_type_force_choice={forceChoiceField}
          isMultiAz={false}
          quota={{}}
          organization={organizationState}
          getDefaultFlavour={getDefaultFlavour}
          getMachineTypes={getMachineTypes}
          isBYOC={false}
          cloudProviderID="aws"
          isMachinePool={false}
          product="OSD"
          billingModel="standard"
        />,
      );
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('when the machine types list is available', () => {
    let field;
    let forceChoiceField;
    let getDefaultFlavour;
    let getMachineTypes;
    let wrapper;

    describe('with an error loading flavours', () => {
      beforeEach(() => {
        const flavoursState = {
          ...baseFlavoursState,
          error: true,
          errorMessage: 'Out of vanilla ice cream',
        };

        field = fieldProps(undefined);
        forceChoiceField = fieldProps(false);
        getDefaultFlavour = jest.fn();
        getMachineTypes = jest.fn();
        wrapper = shallow(
          <MachineTypeSelection
            flavours={flavoursState}
            machineTypes={fulfilledMachineState}
            machine_type={field}
            machine_type_force_choice={forceChoiceField}
            isMultiAz={false}
            quota={rhQuotaList}
            organization={organizationState}
            getDefaultFlavour={getDefaultFlavour}
            getMachineTypes={getMachineTypes}
            isBYOC={false}
            cloudProviderID="aws"
            isMachinePool={false}
            product="OSD"
            billingModel="standard"
          />,
        );
      });

      it('renders correctly', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('does not select default', () => {
        expect(field.input.onChange).not.toHaveBeenCalled();
      });
    });

    describe('with rhinfra quota available', () => {
      const quota = rhQuotaList;
      const field = fieldProps(undefined);
      const forceChoiceField = fieldProps(false);
      const getDefaultFlavour = jest.fn();
      const getMachineTypes = jest.fn();

      it('selects default according to flavours API', async () => {
        render(
          <MachineTypeSelection
            flavours={fulfilledFlavoursState}
            machineTypes={fulfilledMachineState}
            machine_type={field}
            machine_type_force_choice={forceChoiceField}
            quota={quota}
            organization={organizationState}
            getDefaultFlavour={getDefaultFlavour}
            getMachineTypes={getMachineTypes}
            isMultiAz
            isBYOC={false}
            isMachinePool={false}
            cloudProviderID="aws"
            product="OSD"
            billingModel="standard"
          />,
        );

        await waitFor(() => expect(field.input.onChange).toBeCalledWith('m5.xlarge'));
      });

      it('does not display ccs_only machine types, only machines with quota', async () => {
        render(
          <MachineTypeSelection
            flavours={fulfilledFlavoursState}
            machineTypes={fulfilledMachineState}
            machine_type={field}
            machine_type_force_choice={forceChoiceField}
            quota={quota}
            organization={organizationState}
            getDefaultFlavour={getDefaultFlavour}
            getMachineTypes={getMachineTypes}
            isMultiAz
            isBYOC={false}
            isMachinePool={false}
            cloudProviderID="aws"
            product="OSD"
            billingModel="standard"
          />,
        );

        const optionsMenu = screen.getByLabelText('Options menu');
        await userEvent.click(optionsMenu);

        const options = screen
          .getAllByRole('option')
          .map((option) => option.querySelector('.pf-c-select__menu-item-description').textContent);

        expect(options).not.toContain('m5.12xlarge');
        expect(options).not.toContain('g4dn.2xlarge');
      });
    });

    describe('with rhinfra quota covering previous selection', () => {
      beforeEach(() => {
        const quota = rhQuotaList;
        field = fieldProps('m5.4xlarge');
        forceChoiceField = fieldProps(false);
        getDefaultFlavour = jest.fn();
        getMachineTypes = jest.fn();
        wrapper = shallow(
          <MachineTypeSelection
            flavours={fulfilledFlavoursState}
            machineTypes={fulfilledMachineState}
            machine_type={field}
            machine_type_force_choice={forceChoiceField}
            quota={quota}
            organization={organizationState}
            getDefaultFlavour={getDefaultFlavour}
            getMachineTypes={getMachineTypes}
            isMultiAz
            isBYOC={false}
            isMachinePool={false}
            cloudProviderID="aws"
            product="OSD"
            billingModel="standard"
          />,
        );
      });

      it('renders correctly', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('keeps selection', () => {
        expect(field.input.onChange).not.toHaveBeenCalled();
      });

      it('does not display ccs_only machine types, only machines with quota', () => {
        const types = wrapper
          .find('SelectOption')
          .getElements()
          .map((e) => e.key);
        expect(types).toContain('m5.xlarge');
        expect(types).toContain('m5.4xlarge');
        expect(types).not.toContain('m5.12xlarge');
      });
    });

    describe('with rhinfra quota not covering previous selection', () => {
      const quota = rhQuotaList;
      const field = fieldProps('m5.12xlarge');
      const forceChoiceField = fieldProps(false);
      const getDefaultFlavour = jest.fn();
      const getMachineTypes = jest.fn();

      it('clears selection to force manual choice', async () => {
        render(
          <MachineTypeSelection
            flavours={fulfilledFlavoursState}
            machineTypes={fulfilledMachineState}
            machine_type={field}
            machine_type_force_choice={forceChoiceField}
            quota={quota}
            organization={organizationState}
            getDefaultFlavour={getDefaultFlavour}
            getMachineTypes={getMachineTypes}
            isMultiAz
            isBYOC={false}
            isMachinePool={false}
            cloudProviderID="aws"
            product="OSD"
            billingModel="standard"
          />,
        );

        await waitFor(() => {
          expect(field.input.onChange).toHaveBeenCalledWith('');
          expect(forceChoiceField.input.onChange).toHaveBeenCalledWith(true);
        });
      });

      it('does not display ccs_only machine types, only machines with quota', async () => {
        render(
          <MachineTypeSelection
            flavours={fulfilledFlavoursState}
            machineTypes={fulfilledMachineState}
            machine_type={field}
            machine_type_force_choice={forceChoiceField}
            quota={quota}
            organization={organizationState}
            getDefaultFlavour={getDefaultFlavour}
            getMachineTypes={getMachineTypes}
            isMultiAz
            isBYOC={false}
            isMachinePool={false}
            cloudProviderID="aws"
            product="OSD"
            billingModel="standard"
          />,
        );

        const optionsMenu = screen.getByLabelText('Options menu');
        await userEvent.click(optionsMenu);

        const options = screen
          .getAllByRole('option')
          .map((option) => option.querySelector('.pf-c-select__menu-item-description').textContent);

        expect(options).not.toContain('m5.12xlarge');
        expect(options).not.toContain('g4dn.2xlarge');
      });
    });

    describe('byoc with sufficient byoc quota available', () => {
      const quota = CCSQuotaList;
      const field = fieldProps(undefined);
      const forceChoiceField = fieldProps(false);
      const getDefaultFlavour = jest.fn();
      const getMachineTypes = jest.fn();

      it('selects default according to flavours API', async () => {
        render(
          <MachineTypeSelection
            flavours={fulfilledFlavoursState}
            machineTypes={fulfilledMachineState}
            machine_type={field}
            machine_type_force_choice={forceChoiceField}
            quota={quota}
            organization={organizationState}
            getDefaultFlavour={getDefaultFlavour}
            getMachineTypes={getMachineTypes}
            isMultiAz
            isBYOC
            isMachinePool={false}
            cloudProviderID="aws"
            product="OSD"
            billingModel="standard"
          />,
        );

        await waitFor(() => expect(field.input.onChange).toBeCalledWith('m5.xlarge'));
      });

      it('displays only machine types with quota', async () => {
        render(
          <MachineTypeSelection
            flavours={fulfilledFlavoursState}
            machineTypes={fulfilledMachineState}
            machine_type={field}
            machine_type_force_choice={forceChoiceField}
            quota={quota}
            organization={organizationState}
            getDefaultFlavour={getDefaultFlavour}
            getMachineTypes={getMachineTypes}
            isMultiAz
            isBYOC
            isMachinePool={false}
            cloudProviderID="aws"
            product="OSD"
            billingModel="standard"
          />,
        );

        const optionsMenu = screen.getByLabelText('Options menu');
        userEvent.click(optionsMenu);

        await waitFor(() =>
          expect(screen.getByText('m5.xlarge', { exact: false })).toBeInTheDocument(),
        );
      });
    });

    describe('byoc lacking enough byoc node quota', () => {
      beforeEach(() => {
        const quota = CCSOneNodeRemainingQuotaList;
        field = fieldProps(undefined);
        forceChoiceField = fieldProps(false);
        getDefaultFlavour = jest.fn();
        getMachineTypes = jest.fn();
        wrapper = shallow(
          <MachineTypeSelection
            flavours={fulfilledFlavoursState}
            machineTypes={fulfilledMachineState}
            machine_type={field}
            machine_type_force_choice={forceChoiceField}
            quota={quota}
            organization={organizationState}
            getDefaultFlavour={getDefaultFlavour}
            getMachineTypes={getMachineTypes}
            isMachinePool={false}
            isMultiAz
            isBYOC
            cloudProviderID="aws"
            product="OSD"
            billingModel="standard"
          />,
        );
      });

      it('renders correctly', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('does not select default', () => {
        expect(field.input.onChange).not.toHaveBeenCalled();
      });
    });
  });

  describe('when the machine types list contains unknown categories', () => {
    const moreTypes = {
      aws: [...machineTypes.aws, ...unknownCategoryMachineTypes],
    };
    const state = {
      ...baseState,
      fulfilled: true,
      types: moreTypes,
      typesByID: mapMachineTypesById(moreTypes),
    };
    const quota = CCSQuotaList;
    const field = fieldProps(undefined);
    const forceChoiceField = fieldProps(false);
    const getDefaultFlavour = jest.fn();
    const getMachineTypes = jest.fn();

    describe('byoc with sufficient byoc quota available', () => {
      it('selects default according to flavours API', async () => {
        render(
          <MachineTypeSelection
            flavours={fulfilledFlavoursState}
            machineTypes={state}
            machine_type={field}
            machine_type_force_choice={forceChoiceField}
            quota={quota}
            organization={organizationState}
            getDefaultFlavour={getDefaultFlavour}
            getMachineTypes={getMachineTypes}
            isMultiAz
            isBYOC
            isMachinePool={false}
            cloudProviderID="aws"
            product="OSD"
            billingModel="standard"
          />,
        );

        await waitFor(() => expect(field.input.onChange).toBeCalledWith('m5.xlarge'));
      });

      it('displays only machine types with quota from known categories', async () => {
        render(
          <MachineTypeSelection
            flavours={fulfilledFlavoursState}
            machineTypes={state}
            machine_type={field}
            machine_type_force_choice={forceChoiceField}
            quota={quota}
            organization={organizationState}
            getDefaultFlavour={getDefaultFlavour}
            getMachineTypes={getMachineTypes}
            isMultiAz
            isBYOC
            isMachinePool={false}
            cloudProviderID="aws"
            product="OSD"
            billingModel="standard"
          />,
        );

        const optionsMenu = screen.getByLabelText('Options menu');
        await userEvent.click(optionsMenu);

        const options = screen
          .getAllByRole('option')
          .map((option) => option.querySelector('.pf-c-select__menu-item-description').textContent);

        expect(options).toContain('m5.xlarge');
        expect(options).not.toContain('foo.2xbar');
      });
    });
  });
});
