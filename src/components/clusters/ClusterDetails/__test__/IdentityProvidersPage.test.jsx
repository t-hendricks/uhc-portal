import React from 'react';
import { shallow } from 'enzyme';

import IdentityProvidersPage from '../components/IdentityProvidersPage/IdentityProvidersPage';
import { IDPformValues } from '../components/IdentityProvidersPage/IdentityProvidersHelper';
import {
  clusterDetails,
  clusterIDPs,
  match,
  funcs,
  submitIDPResponse,
} from './IdentityProvidersPage.fixtures';

describe('<IdentityProvidersPage />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <IdentityProvidersPage
        match={match}
        clusterDetails={clusterDetails}
        submitIDPResponse={submitIDPResponse}
        {...funcs}
        clusterIDPs={clusterIDPs}
        IDPList={clusterIDPs.clusterIDPList}
        selectedIDP={IDPformValues.GOOGLE}
        initialValues={{
          isEditForm: false,
        }}
        pristine={false}
        invalid={false}
      />,
    );
  });

  it('renders correctly (Google IDP)', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
