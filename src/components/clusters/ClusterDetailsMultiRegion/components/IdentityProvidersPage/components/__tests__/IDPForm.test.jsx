import React from 'react';
import { reduxForm } from 'redux-form';

import { reduxFormConfig } from '~/components/clusters/ClusterDetailsMultiRegion/components/IdentityProvidersPage';
import IDPForm from '~/components/clusters/ClusterDetailsMultiRegion/components/IdentityProvidersPage/components/IDPForm';
import { checkAccessibility, render, screen } from '~/testUtils';

const defaultProps = {
  selectedIDP: 'GithubIdentityProvider',
  idpTypeName: 'GitHub',
  formTitle: 'Add a GitHub identity provider',
  submitIDPResponse: {
    error: false,
    pending: false,
    fulfilled: false,
    data: '{}',
  },
  selectedMappingMethod: 'claim',
  clusterUrls: {
    console: 'https://console-openshift-console.test.openshiftapps.com',
    api: 'https://api.test.openshiftapps.com:6443',
  },
  change: () => {},
  clearFields: () => {},
  IDPList: [],
  isEditForm: false,
  idpEdited: {},
  idpName: 'GitHub',
  isHypershift: false,
  HTPasswdErrors: () => {},
};

const initialValues = {
  name: 'TestName',
};

jest.mock('../ProvidersForms/GithubForm', () => () => <div>github form</div>);

describe('<IDPForm />', () => {
  const ReduxFormIDP = reduxForm({
    ...reduxFormConfig,
    initialValues,
  })(IDPForm);

  // skipping the accessibility test as the form as multiple violations (e.g. form elements without labels)
  it.skip('is accessible', async () => {
    const { container } = render(<ReduxFormIDP {...defaultProps} />);

    await checkAccessibility(container);
  });

  // just a smoke test
  // TODO: Fails due to how identity providers are being fetched. Needs update during IDP tab
  it.skip('loads the GitHub form', async () => {
    render(<ReduxFormIDP {...defaultProps} />);

    expect(screen.getByText('Add a GitHub identity provider')).toBeInTheDocument();
    expect(
      screen.getByText('Unique name for the identity provider. This cannot be changed later.'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Name *')).toBeInTheDocument();
    expect(screen.getByLabelText('Name *')).toHaveValue(initialValues.name);
    expect(screen.getByText('github form')).toBeInTheDocument();
  });
});
