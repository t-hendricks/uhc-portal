import React from 'react';
import PropTypes from 'prop-types';

import { Field } from 'redux-form';
import {
  Form, Grid, GridItem, Expandable, Title, ClipboardCopy,
} from '@patternfly/react-core';
import ErrorBox from '../../../../../common/ErrorBox';

import { ReduxVerticalFormGroup, ReduxFormDropdown } from '../../../../../common/ReduxFormComponents';
import { checkIdentityProviderName } from '../../../../../../common/validators';

import {
  GithubForm,
  LDAPForm,
  OpenIDForm,
  GoogleFormRequired,
  LDAPFormRequired,
  OpenIDFormRequired,
  GitlabForm,
} from './ProvidersForms';

import {
  IDPtypes,
  mappingMethods,
  IDPformValues,
  mappingMethodsformValues,
  LDAPDocLink,
  GithubDocLink,
  OpenIDDocLink,
  GoogleDocLink,
  GitlabDocLink,
  getOauthCallbackURL,
  IDPNeedsOAuthURL,
  generateIDPName,
} from '../IdentityProvidersHelper';

class IDPForm extends React.Component {
  state = {
    IDPName: '',
  };

  componentDidMount() {
    const { selectedIDP, change, IDPList } = this.props;
    const generatedName = generateIDPName(selectedIDP, IDPList);
    change('name', generatedName);
    this.setState({ IDPName: generatedName });
  }

  componentDidUpdate(prevProps) {
    const { selectedIDP, change, IDPList } = this.props;
    const { IDPName } = this.state;
    if (selectedIDP !== prevProps.selectedIDP) {
      const generatedName = generateIDPName(selectedIDP, IDPList);
      if (generatedName !== IDPName) {
        change('name', generatedName);
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({ IDPName: generatedName });
      }
    }
  }

  checkDuplicateName = (IDPName) => {
    const { IDPList } = this.props;
    const idpNameList = IDPList.map(idp => idp.name);
    if (idpNameList.includes(IDPName)) {
      return `The name "${IDPName}" is already taken. Identity provider names must not be duplicate.`;
    }
    return undefined;
  }

  render() {
    const {
      createIDPResponse, selectedIDP, selectedMappingMethod, clusterConsoleURL,
    } = this.props;
    const { IDPName } = this.state;

    const isPending = createIDPResponse.pending;

    const createIDPError = createIDPResponse.error && (
    <ErrorBox title="Error creating Identity Provider" response={createIDPResponse} />
    );

    const providersAdvancedOptions = {
      OpenIDIdentityProvider: OpenIDForm,
      LDAPIdentityProvider: LDAPForm,
    };

    const providersRequiredFields = {
      LDAPIdentityProvider: LDAPFormRequired,
      OpenIDIdentityProvider: OpenIDFormRequired,
      GithubIdentityProvider: GithubForm,
      GoogleIdentityProvider: GoogleFormRequired,
      GitlabIdentityProvider: GitlabForm,
    };

    const providerDocumentationLink = {
      LDAPIdentityProvider: LDAPDocLink,
      OpenIDIdentityProvider: OpenIDDocLink,
      GithubIdentityProvider: GithubDocLink,
      GoogleIdentityProvider: GoogleDocLink,
      GitlabIdentityProvider: GitlabDocLink,
    };

    const SelectedProivderRequiredFields = providersRequiredFields[selectedIDP];
    const SelectedProviderAdvancedOptions = providersAdvancedOptions[selectedIDP];

    return (
      <Form>
        <Grid gutter="sm">
          <GridItem span={8}>
            {createIDPError}
            <p>
        Identity providers determine how users log into the cluster.
        Add an identity provider by selecting a type from the dropdown below.
            </p>
            <p>
              <a target="_blank" rel="noreferrer noopener" href={providerDocumentationLink[selectedIDP]}>Learn more about identity providers in the OpenShift documentation.</a>
            </p>
          </GridItem>
          <GridItem span={8}>
            <Title headingLevel="h3" size="xl">Step 1: Select identity providers type</Title>
          </GridItem>
          <GridItem span={8}>
            <Field
              component={ReduxFormDropdown}
              options={IDPtypes}
              name="type"
              label="Identity Provider"
              disabled={isPending}
            />
          </GridItem>
          <GridItem span={8}>
            <Title headingLevel="h3" size="xl">Step 2: Enter Provider type information</Title>
          </GridItem>
          <GridItem span={8}>
            <Field
              component={ReduxVerticalFormGroup}
              name="name"
              label="Name"
              type="text"
              validate={[checkIdentityProviderName, this.checkDuplicateName]}
              isRequired
              disabled={isPending}
              onChange={(_, value) => this.setState({ IDPName: value })}
              helpText="Unique name for the identity provider. This cannot be changed later."
            />
          </GridItem>
          { IDPNeedsOAuthURL(selectedIDP) && (
          <GridItem span={8}>
            <div>
              <span className="pf-c-form__label pf-c-form__label-text idp-oauth-url-label">OAuth callback URL</span>
              <ClipboardCopy isReadOnly>
                {getOauthCallbackURL(clusterConsoleURL, IDPName)}
              </ClipboardCopy>
            </div>
          </GridItem>

          )}
          <GridItem span={8}>
            <Field
              component={ReduxFormDropdown}
              options={mappingMethods}
              name="mappingMethod"
              label="Mapping Method"
              helpText="Specifies how new identities are mapped to users when they log in. Claim is recommended in most cases."
            />
          </GridItem>
          {SelectedProivderRequiredFields
        && (
          <SelectedProivderRequiredFields
            isPending={isPending}
            // make google required form optional when mapping method is lookup
            isRequired={selectedIDP === IDPformValues.GOOGLE
            && !(selectedMappingMethod === mappingMethodsformValues.LOOKUP)}
          />
        )}
          {SelectedProviderAdvancedOptions
          && (
            <GridItem span={8}>
              <Expandable toggleTextCollapsed="Show Advanced Options" toggleTextExpanded="Hide Advanced Options">
                <SelectedProviderAdvancedOptions isPending={isPending} />
              </Expandable>
            </GridItem>
          )}
        </Grid>
      </Form>
    );
  }
}

IDPForm.propTypes = {
  clusterConsoleURL: PropTypes.string,
  createIDPResponse: PropTypes.object,
  selectedIDP: PropTypes.string,
  selectedMappingMethod: PropTypes.string,
  change: PropTypes.func.isRequired,
  IDPList: PropTypes.array.isRequired,
};

IDPForm.defaultProps = {
  selectedIDP: 'GithubIdentityProvider',
  clusterConsoleURL: '',
};

export default IDPForm;
