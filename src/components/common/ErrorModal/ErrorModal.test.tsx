import React from 'react';
import { shallow } from 'enzyme';

import ErrorModal from './ErrorModal';

describe('<ErrorModal />', () => {
  const title = 'Error Modal';
  const errorResponse = { errorMessage: 'Error Message', operationID: '1337' };
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
