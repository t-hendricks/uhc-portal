import React from 'react';
import { shallow } from 'enzyme';
import ErrorBox from '../../../common/ErrorBox';

import ScaleClusterDialog from './ScaleClusterDialog';

describe('<ScaleClusterDialog />', () => {
  let wrapper;
  let closeModal;
  let onClose;
  let handleSubmit;
  let change;
  let resetResponse;
  beforeEach(() => {
    closeModal = jest.fn();
    onClose = jest.fn();
    handleSubmit = jest.fn();
    change = jest.fn();
    resetResponse = jest.fn();
    const fulfilledRequest = {
      pending: false,
      error: false,
      fulfilled: true,
    };

    wrapper = shallow(<ScaleClusterDialog
      isOpen
      closeModal={closeModal}
      onClose={onClose}
      handleSubmit={handleSubmit}
      change={change}
      resetResponse={resetResponse}
      getPersistentStorage={jest.fn()}
      getCloudProviders={jest.fn()}
      getOrganizationAndQuota={jest.fn()}
      loadBalancerValues={fulfilledRequest}
      persistentStorageValues={fulfilledRequest}
      organization={fulfilledRequest}
      initialValues={{
        id: 'test-id', nodes_compute: 4, load_balancers: '4', persistent_storage: '107374182400',
      }}
      min={{ value: 4, validationMsg: 'error' }}
      prestine={false}
    />);
  });
  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('when fulfilled, closes dialog', () => {
    wrapper.setProps({ editClusterResponse: { fulfilled: true } });
    expect(closeModal).toBeCalled();
    expect(resetResponse).toBeCalled();
    expect(onClose).toBeCalled();
  });

  it('renders correctly when an erorr occurs', () => {
    wrapper.setProps({ editClusterResponse: { error: true, erorMessage: 'this is an error' } });
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(ErrorBox).length).toEqual(1);
  });
});
