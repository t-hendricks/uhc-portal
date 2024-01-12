import React from 'react';
import { render, screen, userEvent, waitFor } from '~/testUtils';
import apiRequest from '~/services/apiRequest';
import UpgradeAcknowledgeModal from '../UpgradeAcknowledgeModal/UpgradeAcknowledgeModal';

const ackWord = 'Acknowledge';
const approvalButton = 'Approve and continue';
const errMsg = 'Failed to save administrator acknowledgement.';

const clickSubmitButton = async (user) => {
  const inputBox = await screen.findByRole('textbox', { id: 'upgradeAcknowledgementModalText' });
  await user.clear(inputBox);
  await user.type(inputBox, ackWord);
  await waitFor(() => {
    expect(screen.getByRole('button', { name: approvalButton })).toBeEnabled();
  });
  await user.click(screen.getByRole('button', { name: approvalButton }));
};

describe('<UpgradeAcknowledgeModal> ', () => {
  const mockSetUpgradePolicy = jest.fn();
  const mockSetGate = jest.fn();
  const mockCloseModal = jest.fn();
  const modalData = {
    fromVersion: '1.2.3',
    toVersion: '1.3.4',
    unmetAcknowledgements: [{ id: 'unMetAck1' }, { id: 'unMetAck2' }],
  };
  const defaultProps = {
    closeModal: mockCloseModal,
    clusterId: 'myClusterId',
    automaticUpgradePolicyId: 'myUpgradePolicyId',
    isOpen: true,
    isHypershift: false,
    setGate: mockSetGate,
    setUpgradePolicy: mockSetUpgradePolicy,
    modalData,
  };
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('API call for each gates calls action and y-stream approval', async () => {
    const apiReturnValue = { data: { enable_minor_version_upgrades: true } };
    apiRequest.patch.mockResolvedValue(apiReturnValue);
    apiRequest.post.mockResolvedValue(apiReturnValue);

    render(<UpgradeAcknowledgeModal {...defaultProps} />);

    const user = await userEvent.setup({
      delay: null,
    });

    await clickSubmitButton(user);

    expect(apiRequest.patch).toHaveBeenCalledWith(
      '/api/clusters_mgmt/v1/clusters/myClusterId/upgrade_policies/myUpgradePolicyId',
      { enable_minor_version_upgrades: true },
    );
    expect(apiRequest.post).toHaveBeenNthCalledWith(
      1,
      '/api/clusters_mgmt/v1/clusters/myClusterId/gate_agreements',
      { version_gate: { id: 'unMetAck1' } },
    );
    expect(apiRequest.post).toHaveBeenNthCalledWith(
      2,
      '/api/clusters_mgmt/v1/clusters/myClusterId/gate_agreements',
      { version_gate: { id: 'unMetAck2' } },
    );
    // Call updatePolicy (y-stream) action
    expect(mockSetUpgradePolicy.mock.calls).toHaveLength(1);
    expect(mockSetUpgradePolicy.mock.calls[0][0]).toEqual({ enable_minor_version_upgrades: true });

    // Call updateGate action
    expect(mockSetGate.mock.calls).toHaveLength(2);
    expect(mockSetGate.mock.calls[0][0]).toEqual('unMetAck1');
    expect(mockSetGate.mock.calls[1][0]).toEqual('unMetAck2');

    // Since success, close modal
    expect(mockCloseModal.mock.calls).toHaveLength(1);
    expect(screen.queryByRole('alert', { name: 'Danger Alert' })).not.toBeInTheDocument();
  });

  it('Error is shown for failed y-stream approval action', async () => {
    const apiError = {
      response: {
        data: { reason: 'an error happened' },
      },
    };
    apiRequest.patch.mockRejectedValueOnce(apiError).mockResolvedValue();

    render(<UpgradeAcknowledgeModal {...defaultProps} />);
    const user = await userEvent.setup({
      delay: null,
    });

    await clickSubmitButton(user);

    expect(apiRequest.patch).toBeCalledTimes(1);
    expect(apiRequest.patch).toHaveBeenNthCalledWith(
      1,
      '/api/clusters_mgmt/v1/clusters/myClusterId/upgrade_policies/myUpgradePolicyId',
      { enable_minor_version_upgrades: true },
    );

    // Call updatePolicy (y-stream) action
    expect(mockSetUpgradePolicy).not.toHaveBeenCalled();

    // Call updateGate action
    expect(mockSetGate).not.toHaveBeenCalled();

    // Since failure, don't close modal
    expect(mockCloseModal).not.toHaveBeenCalled();

    expect(screen.getByText(errMsg)).toBeInTheDocument();
  });

  it('Errors are shown for failed gates action', async () => {
    const apiReturnValue = { data: { enable_minor_version_upgrades: true } };
    const apiError = {
      response: {
        data: { reason: 'an error happened' },
      },
    };
    apiRequest.post.mockRejectedValue(apiError);
    apiRequest.patch.mockResolvedValueOnce(apiReturnValue);

    render(<UpgradeAcknowledgeModal {...defaultProps} />);
    const user = await userEvent.setup({
      delay: null,
    });

    await clickSubmitButton(user);

    // API calls made
    expect(apiRequest.patch).toBeCalledTimes(1);
    expect(apiRequest.post).toBeCalledTimes(2);
    expect(apiRequest.patch).toHaveBeenNthCalledWith(
      1,
      '/api/clusters_mgmt/v1/clusters/myClusterId/upgrade_policies/myUpgradePolicyId',
      { enable_minor_version_upgrades: true },
    );
    expect(apiRequest.post).toHaveBeenNthCalledWith(
      1,
      '/api/clusters_mgmt/v1/clusters/myClusterId/gate_agreements',
      { version_gate: { id: 'unMetAck1' } },
    );
    expect(apiRequest.post).toHaveBeenNthCalledWith(
      2,
      '/api/clusters_mgmt/v1/clusters/myClusterId/gate_agreements',
      { version_gate: { id: 'unMetAck2' } },
    );

    // Call updatePolicy (y-stream) action
    expect(mockSetUpgradePolicy.mock.calls).toHaveLength(1);
    expect(mockSetUpgradePolicy.mock.calls[0][0]).toEqual({ enable_minor_version_upgrades: true });

    // Call updateGate action
    expect(mockSetGate).not.toHaveBeenCalled();

    // Since failure, don't close modal
    expect(mockCloseModal).not.toHaveBeenCalled();

    expect(screen.queryAllByText(errMsg)).toHaveLength(2);
  });
});

describe('<UpgradeAcknowledgeModal>  with hosted control plane(hypershift)', () => {
  const mockSetUpgradePolicy = jest.fn();
  const mockSetGate = jest.fn();
  const mockCloseModal = jest.fn();
  const modalData = {
    fromVersion: '1.2.3',
    toVersion: '1.3.4',
    unmetAcknowledgements: [{ id: 'unMetAck1' }, { id: 'unMetAck2' }],
  };
  const defaultProps = {
    closeModal: mockCloseModal,
    clusterId: 'myClusterId',
    automaticUpgradePolicyId: 'myUpgradePolicyId',
    isOpen: true,
    isHypershift: true,
    setGate: mockSetGate,
    setUpgradePolicy: mockSetUpgradePolicy,
    modalData,
  };
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('(HCP) API call for each gates calls action and y-stream approval', async () => {
    const apiReturnValue = { data: { enable_minor_version_upgrades: true } };
    apiRequest.patch.mockResolvedValue(apiReturnValue);
    apiRequest.post.mockResolvedValue(apiReturnValue);

    render(<UpgradeAcknowledgeModal {...defaultProps} />);

    const user = await userEvent.setup({
      delay: null,
    });

    await clickSubmitButton(user);

    expect(apiRequest.patch).toHaveBeenCalledWith(
      '/api/clusters_mgmt/v1/clusters/myClusterId/control_plane/upgrade_policies/myUpgradePolicyId',
      { enable_minor_version_upgrades: true },
    );
    expect(apiRequest.post).toHaveBeenNthCalledWith(
      1,
      '/api/clusters_mgmt/v1/clusters/myClusterId/gate_agreements',
      { version_gate: { id: 'unMetAck1' } },
    );
    expect(apiRequest.post).toHaveBeenNthCalledWith(
      2,
      '/api/clusters_mgmt/v1/clusters/myClusterId/gate_agreements',
      { version_gate: { id: 'unMetAck2' } },
    );
    // Call updatePolicy (y-stream) action
    expect(mockSetUpgradePolicy.mock.calls).toHaveLength(1);
    expect(mockSetUpgradePolicy.mock.calls[0][0]).toEqual({ enable_minor_version_upgrades: true });

    // Call updateGate action
    expect(mockSetGate.mock.calls).toHaveLength(2);
    expect(mockSetGate.mock.calls[0][0]).toEqual('unMetAck1');
    expect(mockSetGate.mock.calls[1][0]).toEqual('unMetAck2');

    // Since success, close modal
    expect(mockCloseModal.mock.calls).toHaveLength(1);
    expect(screen.queryByRole('alert', { name: 'Danger Alert' })).not.toBeInTheDocument();
  });

  it('(HCP) Error is shown for failed y-stream approval action', async () => {
    const apiError = {
      response: {
        data: { reason: 'an error happened' },
      },
    };
    apiRequest.patch.mockRejectedValueOnce(apiError).mockResolvedValue();

    render(<UpgradeAcknowledgeModal {...defaultProps} />);
    const user = await userEvent.setup({
      delay: null,
    });

    await clickSubmitButton(user);

    expect(apiRequest.patch).toBeCalledTimes(1);
    expect(apiRequest.patch).toHaveBeenNthCalledWith(
      1,
      '/api/clusters_mgmt/v1/clusters/myClusterId/control_plane/upgrade_policies/myUpgradePolicyId',
      { enable_minor_version_upgrades: true },
    );

    // Call updatePolicy (y-stream) action
    expect(mockSetUpgradePolicy).not.toHaveBeenCalled();

    // Call updateGate action
    expect(mockSetGate).not.toHaveBeenCalled();

    // Since failure, don't close modal
    expect(mockCloseModal).not.toHaveBeenCalled();

    expect(screen.getByText(errMsg)).toBeInTheDocument();
  });

  it('(HCP) Errors are shown for failed gates action', async () => {
    const apiReturnValue = { data: { enable_minor_version_upgrades: true } };
    const apiError = {
      response: {
        data: { reason: 'an error happened' },
      },
    };
    apiRequest.post.mockRejectedValue(apiError);
    apiRequest.patch.mockResolvedValueOnce(apiReturnValue);

    render(<UpgradeAcknowledgeModal {...defaultProps} />);
    const user = await userEvent.setup({
      delay: null,
    });

    await clickSubmitButton(user);

    // API calls made
    expect(apiRequest.patch).toBeCalledTimes(1);
    expect(apiRequest.post).toBeCalledTimes(2);
    expect(apiRequest.patch).toHaveBeenNthCalledWith(
      1,
      '/api/clusters_mgmt/v1/clusters/myClusterId/control_plane/upgrade_policies/myUpgradePolicyId',
      { enable_minor_version_upgrades: true },
    );
    expect(apiRequest.post).toHaveBeenNthCalledWith(
      1,
      '/api/clusters_mgmt/v1/clusters/myClusterId/gate_agreements',
      { version_gate: { id: 'unMetAck1' } },
    );
    expect(apiRequest.post).toHaveBeenNthCalledWith(
      2,
      '/api/clusters_mgmt/v1/clusters/myClusterId/gate_agreements',
      { version_gate: { id: 'unMetAck2' } },
    );

    // Call updatePolicy (y-stream) action
    expect(mockSetUpgradePolicy.mock.calls).toHaveLength(1);
    expect(mockSetUpgradePolicy.mock.calls[0][0]).toEqual({ enable_minor_version_upgrades: true });

    // Call updateGate action
    expect(mockSetGate).not.toHaveBeenCalled();

    // Since failure, don't close modal
    expect(mockCloseModal).not.toHaveBeenCalled();

    expect(screen.queryAllByText(errMsg)).toHaveLength(2);
  });
});
