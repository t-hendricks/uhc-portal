import React from 'react';
import {
  MachineConfiguration,
  MachineConfigurationProps,
} from '~/components/clusters/common/MachineConfiguration/MachineConfiguration';
import { checkAccessibility, waitFor, render, screen, fireEvent } from '~/testUtils';
import { KubeletConfig } from '~/types/clusters_mgmt.v1';
import { AxiosResponse } from 'axios';

describe('<MachineConfiguration />', () => {
  const errorMessage = 'Please enter a value between 4,096 - 16,384';
  const errorMessageOverride = 'Please enter a value between 4,096 - 3,694,303';
  const helperText = 'The safe PIDs limit range is 4,096 - 16,384';
  const unsafeMessage =
    /Setting a PIDs limit higher than 16,384 on your cluster could potentially cause your workloads to fail unexpectedly/i;
  const pidsInputLabel = 'PIDs limit';

  it('is accessible', async () => {
    const { container } = render(<MachineConfiguration {...defaultProps} />);

    expect(await screen.findByLabelText(pidsInputLabel)).toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('shows a loading animation while fetching the existing configuration', async () => {
    const props: MachineConfigurationProps = {
      ...defaultProps,
      getMachineConfiguration: () => new Promise<AxiosResponse<KubeletConfig>>((_resolve) => {}),
    };
    render(<MachineConfiguration {...props} />);

    expect(await screen.findByText('Save changes')).toBeDisabled();
    expect(screen.queryByLabelText(pidsInputLabel)).not.toBeInTheDocument();
    expect(screen.getByText('Loading PIDs limit')).toBeInTheDocument();
  });

  it('shows the default PIDs limit value when a configuration does not exists', async () => {
    const props: MachineConfigurationProps = {
      ...defaultProps,
      getMachineConfiguration: () =>
        new Promise<AxiosResponse<KubeletConfig>>((_resolve, reject) => {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject({ response: { ...ResponseError404 } });
        }),
    };
    render(<MachineConfiguration {...props} />);

    expect(await screen.findByLabelText(pidsInputLabel)).toBeInTheDocument();
    expect(await screen.findByLabelText(pidsInputLabel)).toHaveValue(4096);
  });

  it('shows existing configuration value in the PIDs limit input', async () => {
    render(<MachineConfiguration {...defaultProps} />);

    expect(await screen.findByLabelText(pidsInputLabel)).toBeInTheDocument();
    expect(await screen.findByLabelText(pidsInputLabel)).toHaveValue(
      existingConfigResponse.data.pod_pids_limit,
    );
  });

  it('shows an error message when the user enters an invalid value', async () => {
    render(<MachineConfiguration {...defaultProps} />);

    expect(await screen.findByLabelText(pidsInputLabel)).toBeInTheDocument();
    expect(screen.getByText(helperText)).toBeInTheDocument();
    expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();

    // invalid value below range
    fireEvent.change(screen.getByLabelText(pidsInputLabel), {
      target: { value: 15 },
    });

    expect(screen.queryByText(helperText)).not.toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();

    // valid value
    fireEvent.change(screen.getByLabelText(pidsInputLabel), {
      target: { value: 5_000 },
    });

    expect(screen.getByText(helperText)).toBeInTheDocument();
    expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();

    // invalid value above range
    fireEvent.change(screen.getByLabelText(pidsInputLabel), {
      target: { value: 100_000 },
    });

    expect(screen.queryByText(helperText)).not.toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('lets the user enter a value above the safe limit, if they have the capability', async () => {
    const props: MachineConfigurationProps = { ...defaultProps, canBypassPIDsLimit: true };
    render(<MachineConfiguration {...props} />);

    expect(await screen.findByLabelText(pidsInputLabel)).toBeInTheDocument();
    expect(screen.getByText(helperText)).toBeInTheDocument();
    expect(screen.queryByText(unsafeMessage)).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(pidsInputLabel), {
      target: { value: 100_000 },
    });

    expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
    expect(screen.getByText(unsafeMessage)).toBeInTheDocument();
  });

  it('shows the override max limit error only when the provided value is higher', async () => {
    const props: MachineConfigurationProps = { ...defaultProps, canBypassPIDsLimit: true };
    render(<MachineConfiguration {...props} />);

    expect(await screen.findByLabelText(pidsInputLabel)).toBeInTheDocument();
    expect(screen.getByText(helperText)).toBeInTheDocument();
    expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
    expect(screen.queryByText(errorMessageOverride)).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(pidsInputLabel), {
      target: { value: 100_000_000 },
    });

    expect(screen.queryByText(helperText)).not.toBeInTheDocument();
    expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
    expect(screen.getByText(errorMessageOverride)).toBeInTheDocument();
  });

  it('allows the user to change the PIDs limit value using increment buttons', async () => {
    const initialLimitValue = existingConfigResponse.data.pod_pids_limit;
    const props: MachineConfigurationProps = {
      ...defaultProps,
    };
    render(<MachineConfiguration {...props} />);

    expect(await screen.findByLabelText(pidsInputLabel)).toBeInTheDocument();
    expect(screen.getByLabelText(pidsInputLabel)).toHaveValue(initialLimitValue);

    fireEvent.click(screen.getByLabelText('plus'));

    expect(screen.getByLabelText(pidsInputLabel)).toHaveValue(initialLimitValue + 1);

    fireEvent.click(screen.getByLabelText('minus'));

    expect(screen.getByLabelText(pidsInputLabel)).toHaveValue(initialLimitValue);
  });

  it('autocorrect values out of range when PIDs limit input loses focus', async () => {
    const props: MachineConfigurationProps = {
      ...defaultProps,
    };
    render(<MachineConfiguration {...props} />);

    expect(await screen.findByLabelText(pidsInputLabel)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(pidsInputLabel), {
      target: { value: 100_000 },
    });

    await waitFor(() => {
      screen.getByLabelText(pidsInputLabel).focus();
    });
    expect(screen.getByLabelText(pidsInputLabel)).toHaveValue(100_000);
    await waitFor(() => {
      screen.getByLabelText(pidsInputLabel).blur();
    });

    expect(screen.getByLabelText(pidsInputLabel)).toHaveValue(16_384);
  });

  it('enables the save button only when the PIDs limit value was changed', async () => {
    const props: MachineConfigurationProps = {
      ...defaultProps,
    };
    render(<MachineConfiguration {...props} />);

    expect(await screen.findByLabelText(pidsInputLabel)).toBeInTheDocument();
    expect(screen.getByText('Save changes')).toBeDisabled();

    fireEvent.change(screen.getByLabelText(pidsInputLabel), {
      target: { value: 10_000 },
    });

    expect(await screen.findByText('Save changes')).toBeEnabled();

    fireEvent.change(screen.getByLabelText(pidsInputLabel), {
      target: { value: existingConfigResponse.data.pod_pids_limit },
    });

    expect(screen.getByText('Save changes')).toBeDisabled();
  });

  it('save changes by creating a new configuration if one does not exist yet', async () => {
    const props: MachineConfigurationProps = {
      ...defaultProps,
      getMachineConfiguration: () =>
        new Promise<AxiosResponse<KubeletConfig>>((_resolve, reject) => {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject({ response: { ...ResponseError404 } });
        }),
      createMachineConfiguration: jest.fn(() =>
        Promise.resolve({ data: {} } as AxiosResponse<KubeletConfig>),
      ),
    };
    render(<MachineConfiguration {...props} />);

    expect(await screen.findByLabelText(pidsInputLabel)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(pidsInputLabel), {
      target: { value: 5000 },
    });

    expect(props.updateMachineConfiguration).toHaveBeenCalledTimes(0);
    expect(props.createMachineConfiguration).toHaveBeenCalledTimes(0);

    fireEvent.click(screen.getByText('Save changes'));

    await waitFor(() => {
      expect(props.createMachineConfiguration).toHaveBeenCalledTimes(1);
    });

    expect(props.createMachineConfiguration).toHaveBeenCalledWith(props.clusterID, {
      pod_pids_limit: 5000,
    });
    expect(props.updateMachineConfiguration).toHaveBeenCalledTimes(0);
  });

  it('save changes by updating the existing kubelet configuration', async () => {
    const props = {
      ...defaultProps,
      updateMachineConfiguration: jest.fn(() =>
        Promise.resolve({ data: {} } as AxiosResponse<KubeletConfig>),
      ),
      onClose: jest.fn(),
    };
    render(<MachineConfiguration {...props} />);

    expect(await screen.findByLabelText(pidsInputLabel)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(pidsInputLabel), {
      target: { value: 5000 },
    });

    expect(props.createMachineConfiguration).toHaveBeenCalledTimes(0);
    expect(props.updateMachineConfiguration).toHaveBeenCalledTimes(0);

    fireEvent.click(screen.getByText('Save changes'));

    await waitFor(() => {
      expect(props.updateMachineConfiguration).toHaveBeenCalledTimes(1);
    });

    expect(props.updateMachineConfiguration).toHaveBeenCalledWith(props.clusterID, {
      pod_pids_limit: 5000,
    });
    expect(props.createMachineConfiguration).toHaveBeenCalledTimes(0);
  });

  it('disables the action buttons while saving changes', async () => {
    const props = {
      ...defaultProps,
      updateMachineConfiguration: jest.fn(
        () => new Promise<AxiosResponse<KubeletConfig>>((_resolve) => {}),
      ),
      onClose: jest.fn(),
    };
    render(<MachineConfiguration {...props} />);

    expect(await screen.findByLabelText(pidsInputLabel)).toBeInTheDocument();
    expect(screen.getByText('Save changes')).toBeDisabled();
    expect(screen.getByText('Cancel')).toBeEnabled();

    fireEvent.change(screen.getByLabelText(pidsInputLabel), {
      target: { value: 5000 },
    });

    expect(screen.getByText('Save changes')).toBeEnabled();

    fireEvent.click(screen.getByText('Save changes'));

    expect(await screen.findByText('Save changes')).toBeDisabled();
    expect(await screen.findByText('Cancel')).toBeDisabled();
  });

  it('calls the onClose callback when clicking the "Cancel" button', async () => {
    const props = { ...defaultProps, onClose: jest.fn() };
    render(<MachineConfiguration {...props} />);

    expect(await screen.findByLabelText(pidsInputLabel)).toBeInTheDocument();
    expect(props.onClose).toHaveBeenCalledTimes(0);

    fireEvent.click(screen.getByText('Cancel'));

    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it('shows an error message when an error occurs while fetching existing configuration', async () => {
    const props: MachineConfigurationProps = {
      ...defaultProps,
      getMachineConfiguration: () =>
        new Promise<AxiosResponse<KubeletConfig>>((_resolve, reject) => {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject({ response: { status: 500, statusText: '', config: {}, headers: {} } });
        }),
      onClose: jest.fn(),
    };
    render(<MachineConfiguration {...props} />);

    expect(await screen.findByText('Unable to retrieve configuration')).toBeInTheDocument();
    expect(screen.queryByLabelText(pidsInputLabel)).not.toBeInTheDocument();
    expect(screen.queryByText('Loading PIDs limit')).not.toBeInTheDocument();
    expect(props.onClose).toHaveBeenCalledTimes(0);

    fireEvent.click(screen.getByText('Close'));

    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it('shows an error message when an error occurs while saving the machine configuration', async () => {
    const savingErrorMessage = 'There was an error saving the machine configuration';
    const errorData = {
      kind: 'Error',
      id: '500',
      href: '/api/clusters_mgmt/v1/errors/500',
      code: 'CLUSTERS-MGMT-500',
      reason: savingErrorMessage,
      operation_id: '1fca1997-d505-48d8-bc7a-a179ea28c6d3',
    };
    const props: MachineConfigurationProps = {
      ...defaultProps,
      updateMachineConfiguration: () =>
        new Promise<AxiosResponse<KubeletConfig>>((_resolve, reject) => {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject({
            response: {
              status: 500,
              statusText: '',
              config: {},
              headers: {},
              data: errorData,
            },
          });
        }),
      onClose: jest.fn(),
    };
    render(<MachineConfiguration {...props} />);

    expect(await screen.findByLabelText(pidsInputLabel)).toBeInTheDocument();
    expect(screen.queryByText(savingErrorMessage)).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(pidsInputLabel), {
      target: { value: 8000 },
    });

    fireEvent.click(screen.getByText('Save changes'));

    expect(await screen.findByText(savingErrorMessage)).toBeInTheDocument();
  });
});

const defaultProps: MachineConfigurationProps = {
  clusterID: '12345',
  onClose: jest.fn(),
  getMachineConfiguration: () =>
    new Promise<AxiosResponse<KubeletConfig>>((resolve) => {
      resolve(existingConfigResponse);
    }),
  createMachineConfiguration: jest.fn(),
  updateMachineConfiguration: jest.fn(),
  canBypassPIDsLimit: false,
};

const ResponseError404 = {
  status: 404,
  statusText: '',
  config: {},
  headers: {},
  data: {
    kind: 'Error',
    id: '404',
    href: '/api/clusters_mgmt/v1/errors/404',
    code: 'CLUSTERS-MGMT-404',
    reason: "KubeletConfig for cluster with ID '12345' is not found",
    operation_id: '1fca1997-d505-48d8-bc7a-a179ea28c6d3',
  },
};

const existingConfigResponse = {
  status: 200,
  statusText: '',
  headers: {},
  config: {},
  data: {
    href: '/api/clusters_mgmt/v1/clusters/12345/kubelet_config',
    kind: 'KubeletConfig',
    pod_pids_limit: 6000,
  },
};
