import React from 'react';
import { shallow } from 'enzyme';

import { ErrorState } from '~/types/types';
import ErrorModal from './ErrorModal';

describe('<ErrorModal />', () => {
  const title = 'Error Modal';
  const errorResponse: ErrorState = {
    pending: false,
    error: true,
    fulfilled: false,
    errorMessage: 'Error Message',
    operationID: '1337',
  };
  const resetResponse = () => {};
  const closeModal = () => {};
  const wrapper = shallow(
    <ErrorModal
      title={title}
      errorResponse={errorResponse}
      resetResponse={resetResponse}
      closeModal={closeModal}
    />,
  );
  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
