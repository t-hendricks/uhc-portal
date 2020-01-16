import React from 'react';
import { shallow } from 'enzyme';

import EditDisconnectedClusterDialog from './EditDisconnectedCluster';
import ErrorBox from '../../../common/ErrorBox';

describe('<EditDisconnectedClusterDialog />', () => {
  let closeModal;
  let onClose;
  let resetResponse;
  let submit;
  let wrapper;

  beforeEach(() => {
    closeModal = jest.fn();
    onClose = jest.fn();
    resetResponse = jest.fn();
    submit = jest.fn();
    wrapper = shallow(<EditDisconnectedClusterDialog
      isOpen
      closeModal={closeModal}
      onClose={onClose}
      resetResponse={resetResponse}
      submit={submit}
      editClusterResponse={{ errorMessage: '', error: false }}
      initialFormValues={{ id: 'test-id' }}
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

  it('renders correctly when an error occurs', () => {
    wrapper.setProps({ editClusterResponse: { error: true, erorMessage: 'this is an error' } });
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(ErrorBox).length).toEqual(1);
  });
});
