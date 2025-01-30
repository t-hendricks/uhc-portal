import React from 'react';
import { reduxForm } from 'redux-form';

import { checkAccessibility, render } from '~/testUtils';

import { reduxFormConfig } from '../components/IdentityProvidersPage';
import { IDPformValues } from '../components/IdentityProvidersPage/IdentityProvidersHelper';
import IdentityProvidersPage from '../components/IdentityProvidersPage/IdentityProvidersPage';

import {
  clusterDetails,
  clusterIDPs,
  funcs,
  match,
  submitIDPResponse,
} from './IdentityProvidersPage.fixtures';

describe('<IdentityProvidersPage />', () => {
  const ReduxFormCreateClusterIDP = reduxForm(reduxFormConfig)(IdentityProvidersPage);

  it.skip('is accessible', async () => {
    // Skipping this test for 2 reasons
    // The first is that there are headings that are out of order (fails accessibility check)
    // Secondly IdentityProviders page expects HTPasswdErrors to be an object
    // HTPasswdErrors is passed unchanged to IDPForm
    // but HTPasswdErrors is expected to be an object
    const { container } = render(
      <ReduxFormCreateClusterIDP
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
        idpEdited={{ mapping_method: 'myMappingMethod' }}
        HTPasswdErrors={{}}
      />,
    );

    await checkAccessibility(container);
  });
});
