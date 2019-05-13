import React from 'react';
import { shallow } from 'enzyme';

import IdentityProvidersModal from '../components/IdentityProvidersModal/IdentityProvidersModal';

describe('<ClusterCredentialsModal />', () => {
  let closeModal;
  let resetResponse;
  let resetForm;
  let handleSubmit;
  let wrapper;
  let createIDPResponse;

  beforeEach(() => {
    closeModal = jest.fn();
    resetResponse = jest.fn();
    resetForm = jest.fn();
    handleSubmit = jest.fn();
    createIDPResponse = {};

    wrapper = shallow(<IdentityProvidersModal
      closeModal={closeModal}
      resetResponse={resetResponse}
      resetForm={resetForm}
      handleSubmit={handleSubmit}
      createIDPResponse={createIDPResponse}
      isOpen
    />);
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('doesn\'t render when closed', () => {
    wrapper = shallow(<IdentityProvidersModal
      closeModal={closeModal}
      resetResponse={resetResponse}
      resetForm={resetForm}
      handleSubmit={handleSubmit}
      createIDPResponse={createIDPResponse}
      isOpen={false}
    />);
    expect(wrapper).toMatchSnapshot();
  });
});
