import React from 'react';
import { mount } from 'enzyme';

import UpgradeAcknowledgeModal from '../UpgradeAcknowledgeModal/UpgradeAcknowledgeModal';
import apiRequest from '../../../../../../services/apiRequest';

jest.mock('../../../../../../services/apiRequest');

const ackWord = 'Acknowledge';

const clickSubmitButton = (wrapper) => {
  expect(wrapper.find('TextInput[data-testid="acknowledgeTextInput"]')).toHaveLength(1);
  wrapper.find('TextInput[data-testid="acknowledgeTextInput"]').invoke('onChange')(ackWord);
  wrapper.find('ModalBoxFooter button').find({ type: 'submit' }).simulate('click');
  wrapper.update();
  return wrapper;
};

describe('<UpgradeAcknowledgeModal >', () => {
  let wrapper;
  const mockCloseModal = jest.fn();
  const mockSetGate = jest.fn();
  const mockSetUpgradePolicy = jest.fn();
  beforeEach(() => {
    wrapper = mount(
      <UpgradeAcknowledgeModal
        closeModal={mockCloseModal}
        clusterId="myClusterId"
        automaticUpgradePolicyId="myUpgradePolicyId"
        isOpen
        setGate={mockSetGate}
        setUpgradePolicy={mockSetUpgradePolicy}
        modalData={{
          fromVersion: '1.2.3',
          toVersion: '1.3.4',
          unmetAcknowledgements: [{ id: 'unMetAck1' }, { id: 'unMetAck2' }],
        }}
      />,
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Returns empty if is not open', () => {
    wrapper.setProps({
      isOpen: false,
    });
    expect(wrapper.isEmptyRender()).toBe(true);
  });

  test('API call for each gates calls action and y-stream approval', async () => {
    const apiReturnValue = { data: { enable_minor_version_upgrades: true } };
    apiRequest.patch.mockResolvedValue(apiReturnValue);
    apiRequest.post.mockResolvedValue(apiReturnValue);

    wrapper = clickSubmitButton(wrapper);
    await new Promise(process.nextTick); // wait for all promises to finish
    wrapper.update();

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
    expect(mockSetGate.mock.calls).toHaveLength(2);
    expect(mockSetGate.mock.calls[0][0]).toEqual('unMetAck1');
    expect(mockSetGate.mock.calls[1][0]).toEqual('unMetAck2');

    // Since success, close modal
    expect(mockCloseModal.mock.calls).toHaveLength(1);
    expect(wrapper.find('.pf-m-danger')).toHaveLength(0);
  });

  test('Error is shown for failed y-stream approval action', async () => {
    const apiError = {
      response: {
        data: { reason: 'an error happened' },
      },
    };
    apiRequest.patch.mockRejectedValueOnce(apiError).mockResolvedValue();

    wrapper = clickSubmitButton(wrapper);
    await new Promise(process.nextTick); // wait for all promises to finish

    wrapper.update();

    // API calls made
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

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('.pf-m-danger')).toHaveLength(1);
  });

  test('Errors are shown for failed gates action', async () => {
    const apiReturnValue = { data: { enable_minor_version_upgrades: true } };
    const apiError = {
      response: {
        data: { reason: 'an error happened' },
      },
    };
    apiRequest.post.mockRejectedValue(apiError);
    apiRequest.patch.mockResolvedValueOnce(apiReturnValue);

    wrapper = clickSubmitButton(wrapper);
    await new Promise(process.nextTick); // wait for all promises to finish

    wrapper.update();

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

    expect(wrapper).toMatchSnapshot();

    // Show two alerts due to two different errors
    expect(wrapper.find('.pf-m-danger')).toHaveLength(2);
  });
});
