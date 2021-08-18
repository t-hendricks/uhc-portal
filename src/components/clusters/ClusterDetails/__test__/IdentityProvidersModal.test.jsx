import React from 'react';
import { shallow } from 'enzyme';

import IdentityProvidersModal from '../components/IdentityProvidersModal/IdentityProvidersModal';

describe('<IdentityProvidersModal />', () => {
  let closeModal;
  let resetResponse;
  let resetForm;
  let handleSubmit;
  let wrapper;
  let submitIDPResponse;
  let change;

  beforeEach(() => {
    closeModal = jest.fn();
    resetResponse = jest.fn();
    resetForm = jest.fn();
    handleSubmit = jest.fn();
    change = jest.fn();
    submitIDPResponse = {};

    wrapper = shallow(<IdentityProvidersModal
      closeModal={closeModal}
      resetResponse={resetResponse}
      resetForm={resetForm}
      handleSubmit={handleSubmit}
      submitIDPResponse={submitIDPResponse}
      IDPList={[]}
      change={change}
      isOpen
      initialValues={{
        isEditForm: false,
      }}
      anyTouched
      invalid={false}
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
      submitIDPResponse={submitIDPResponse}
      IDPList={[]}
      change={change}
      isOpen={false}
      initialValues={{
        isEditForm: false,
      }}
      anyTouched
      invalid={false}
    />);
    expect(wrapper).toMatchSnapshot();
  });
});
