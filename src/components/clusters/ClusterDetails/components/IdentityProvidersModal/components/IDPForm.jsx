import React from 'react';
import PropTypes from 'prop-types';

import { Field } from 'redux-form';
import {
  Form, Grid, GridItem, ExpandableSection, Title, ClipboardCopy,
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
  HTPasswdForm,
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
  HTPasswdDocLink,
  getOauthCallbackURL,
  IDPNeedsOAuthURL,
  generateIDPName,
} from '../IdentityProvidersHelper';

class IDPForm extends React.Component {
  state = {
    IDPName: '',
    isExpanded: false,
  };

  componentDidMount() {
    const {
      selectedIDP, isEditForm, idpEdited, idpName,
    } = this.props;
    this.setState({ IDPName: idpName });
    if (isEditForm) {
      this.setState({ isExpanded: this.checkIfExpandable(selectedIDP, idpEdited) });
    }
  }

  componentDidUpdate(prevProps) {
    const {
      selectedIDP, change, IDPList, isEditForm,
    } = this.props;
    const { IDPName } = this.state;
    if (!isEditForm) {
      if (selectedIDP !== prevProps.selectedIDP) {
        const generatedName = generateIDPName(selectedIDP, IDPList);
        if (generatedName !== IDPName) {
          change('name', generatedName);
          // eslint-disable-next-line react/no-did-update-set-state
          this.setState({ IDPName: generatedName });
        }
      }
    }
  }

  checkDuplicateName = (IDPName) => {
    const { IDPList, isEditForm } = this.props;
    const idpNameList = IDPList.map(idp => idp.name);
    if (idpNameList.includes(IDPName) && !isEditForm) {
      return `The name "${IDPName}" is already taken. Identity provider names must not be duplicate.`;
    }
    return undefined;
  }

  checkIfExpandable = (selectedIDP, idpEdited) => {
    if (selectedIDP === IDPformValues.OPENID) {
      if (idpEdited.open_id.openid_extra_scopes !== '' || idpEdited.open_id.openid_ca !== '') {
        return true;
      }
    } else if (selectedIDP === IDPformValues.LDAP) {
      if (idpEdited.ldap.ldap_ca !== '' || idpEdited.ldap.ldap_insecure !== '') {
        return true;
      }
    }
    return false;
  };

  updateIsExpanded = () => {
    const { isExpanded } = this.state;
    this.setState({ isExpanded: !isExpanded });
  }

  render() {
    const {
      submitIDPResponse, selectedMappingMethod, clusterConsoleURL, isEditForm,
      idpEdited, change, selectedIDP,
    } = this.props;
    const { IDPName, isExpanded } = this.state;

    const isPending = submitIDPResponse.pending;
    let submissionError;
    if (submitIDPResponse.error) {
      if (!isEditForm) {
        submissionError = <ErrorBox title="Error creating Identity Provider" response={submitIDPResponse} />;
      } else {
        submissionError = <ErrorBox title="Error updating Identity Provider" response={submitIDPResponse} />;
      }
    }

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
      HTPasswdIdentityProvider: HTPasswdForm,
    };

    const providerDocumentationLink = {
      LDAPIdentityProvider: LDAPDocLink,
      OpenIDIdentityProvider: OpenIDDocLink,
      GithubIdentityProvider: GithubDocLink,
      GoogleIdentityProvider: GoogleDocLink,
      GitlabIdentityProvider: GitlabDocLink,
      HTPasswdIdentityProvider: HTPasswdDocLink,
    };

    const SelectedProivderRequiredFields = providersRequiredFields[selectedIDP];
    const SelectedProviderAdvancedOptions = providersAdvancedOptions[selectedIDP];

    return (
      <Form>
        <Grid hasGutter>
          <GridItem span={8}>
            {submissionError}
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
              disabled={isPending || isEditForm}
            />
          </GridItem>
          <GridItem span={8}>
            <Title headingLevel="h3" size="xl">Step 2: Enter provider type information</Title>
          </GridItem>
          {
            selectedIDP === IDPformValues.HTPASSWD && (
              <GridItem span={8}>
                Define an HTPasswd identity provider for your managed cluster
                to create a single, static user that can log in to your cluster
                and troubleshoot it. If this user needs elevated permissions,
                add it to an administrative group within your organization.
              </GridItem>
            )
          }
          <GridItem span={8}>
            <Field
              component={ReduxVerticalFormGroup}
              name="name"
              label="Name"
              type="text"
              validate={[checkIdentityProviderName, this.checkDuplicateName]}
              isRequired
              disabled={isPending || isEditForm}
              onChange={(_, value) => this.setState({ IDPName: value })}
              helpText="Unique name for the identity provider. This cannot be changed later."
            />
          </GridItem>
          { IDPNeedsOAuthURL(selectedIDP) && (
          <GridItem span={8}>
            <div>
              <span className="pf-c-form__label pf-c-form__label-text pf-u-mb-sm">OAuth callback URL</span>
              <ClipboardCopy isReadOnly>
                {getOauthCallbackURL(clusterConsoleURL, IDPName)}
              </ClipboardCopy>
            </div>
          </GridItem>

          )}
          {selectedIDP !== IDPformValues.HTPASSWD && (
          <GridItem span={8}>
            <Field
              component={ReduxFormDropdown}
              options={mappingMethods}
              name="mappingMethod"
              label="Mapping method"
              helpText="Specifies how new identities are mapped to users when they log in. Claim is recommended in most cases."
              value={idpEdited.mapping_method}
            />
          </GridItem>
          )}
          {SelectedProivderRequiredFields
        && (
          <SelectedProivderRequiredFields
            isPending={isPending}
            // make google required form optional when mapping method is lookup
            isRequired={selectedIDP === IDPformValues.GOOGLE
            && !(selectedMappingMethod === mappingMethodsformValues.LOOKUP)}
            isEditForm={isEditForm}
            idpEdited={idpEdited}
            change={change}
          />
        )}
          {SelectedProviderAdvancedOptions
          && (
            <GridItem span={8}>
              <ExpandableSection
                toggleTextCollapsed="Show advanced options"
                toggleTextExpanded="Hide advanced options"
                isExpanded={isExpanded}
                onToggle={() => this.updateIsExpanded()}
              >
                <SelectedProviderAdvancedOptions
                  isPending={isPending}
                  isEditForm={isEditForm}
                  idpEdited={idpEdited}
                />
              </ExpandableSection>
            </GridItem>
          )}
        </Grid>
      </Form>
    );
  }
}

IDPForm.propTypes = {
  clusterConsoleURL: PropTypes.string,
  submitIDPResponse: PropTypes.object,
  selectedIDP: PropTypes.string,
  selectedMappingMethod: PropTypes.string,
  change: PropTypes.func.isRequired,
  IDPList: PropTypes.array.isRequired,
  isEditForm: PropTypes.bool,
  idpEdited: PropTypes.object,
  idpName: PropTypes.string,
};

IDPForm.defaultProps = {
  selectedIDP: 'GithubIdentityProvider',
  clusterConsoleURL: '',
};

export default IDPForm;
