import React from 'react';
import { shallow } from 'enzyme';

import EditConsoleURLDialog from './EditConsoleURLDialog';
import ErrorBox from '../../../common/ErrorBox';

describe('<EditConsoleURLDialog />', () => {
  let wrapper;
  let closeModal;
  let onClose;
  let submit;
  let resetResponse;

  beforeEach(() => {
    closeModal = jest.fn();
    onClose = jest.fn();
    submit = jest.fn();
    resetResponse = jest.fn();
    wrapper = shallow(
      <EditConsoleURLDialog
        isOpen
        closeModal={closeModal}
        onClose={onClose}
        submit={submit}
        resetResponse={resetResponse}
        clusterID="some-id"
        subscriptionID="some-sub-id"
        consoleURL="http://www.example.com"
        editClusterResponse={{ errorMessage: '', error: false, fulfilled: false }}
      />,
    );
  });
  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('when cancelled, calls closeModal but not onClose ', () => {
    wrapper.find('Modal').at(0).prop('onSecondaryClick')();
    expect(closeModal).toBeCalled();
    expect(resetResponse).toBeCalled();
    expect(onClose).not.toBeCalled();
  });

  it('submits correctly', () => {
    const input = wrapper.find('TextInput');
    input.prop('onChange')('http://www.example.com');
    wrapper.find('Modal').at(0).prop('onPrimaryClick')();
    expect(submit).toBeCalledWith('some-id', 'some-sub-id', 'http://www.example.com');
  });

  it('renders correctly when an erorr occurs', () => {
    wrapper.setProps({ editClusterResponse: { error: true, errorMessage: 'this is an error' } });
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(ErrorBox).length).toEqual(1);
  });
});
