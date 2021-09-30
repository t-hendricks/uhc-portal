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
import ExternalLink from '../../../../../common/ExternalLink';

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
      idpEdited, change, selectedIDP, idpTypeName, formTitle, HTPasswdPasswordErrors,
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

    const SelectedProviderRequiredFields = providersRequiredFields[selectedIDP];
    const SelectedProviderAdvancedOptions = providersAdvancedOptions[selectedIDP];

    const topText = (idp) => {
      let text = null;
      switch (idp) {
        case IDPformValues.HTPASSWD:
          text = (
            <>
              Define an
              {' '}
              <code>htpasswd</code>
              {' '}
              identity provider for your managed cluster
              to create a single, static user that can log in to your cluster
              and troubleshoot it. If this user needs elevated permissions,
              add it to an
              {' '}
              <ExternalLink href="https://access.redhat.com/documentation/en-us/openshift_dedicated/4/html/administering_a_cluster/dedicated-administrator-role#dedicated-admin-granting-permissions_dedicated-administrator">
                administrative group
              </ExternalLink>
              {' '}
              within your organization.
            </>
          );
          break;
        case IDPformValues.OPENID:
          text = (
            <>
              Configure an
              {' '}
              <code>oidc</code>
              {' '}
              identity provider to integrate with an OpenID Connect identity provider using an
              {' '}
              <ExternalLink href="http://openid.net/specs/openid-connect-core-1_0.html#CodeFlowAuth">
                Authorization Code Flow
              </ExternalLink>
              .
            </>
          );
          break;
        case IDPformValues.LDAP:
          text = (
            <>
              Configure the
              {' '}
              <code>ldap</code>
              {' '}
              identity provider to validate user names and passwords against an LDAPv3 server,
              using simple bind authentication.
            </>
          );
          break;
        case IDPformValues.GITHUB:
          text = (
            <>
              Configure a
              {' '}
              <code>github</code>
              {' '}
              identity provider to validate user names and passwords against GitHub or
              GitHub Enterprise’s OAuth authentication server.
            </>
          );
          break;
        case IDPformValues.GITLAB:
          text = (
            <>
              Configure a
              {' '}
              <code>gitlab</code>
              {' '}
              identity provider to use
              {' '}
              <ExternalLink href="https://gitlab.com/">
                GitLab.com
              </ExternalLink>
              {' '}
              or any other GitLab instance as an identity provider.
            </>
          );
          break;
        case IDPformValues.GOOGLE:
          text = (
            <>
              Configure a
              {' '}
              <code>google</code>
              {' '}
              identity provider using
              {' '}
              <ExternalLink href="https://developers.google.com/identity/protocols/OpenIDConnect">
                Google’s OpenID Connect integration
              </ExternalLink>
              .
            </>
          );
          break;
        default:
          return null;
      }
      return (
        <GridItem span={9}>
          {text}
        </GridItem>
      );
    };

    return (
      <Form>
        <Grid id="identity-provider-form" hasGutter>
          <GridItem span={8}>
            <Title headingLevel="h3" size="xl">{formTitle}</Title>
          </GridItem>
          { submissionError && (
            <GridItem span={8}>
              {submissionError}
            </GridItem>
          )}
          {topText(selectedIDP)}
          {
            !isEditForm && (
              <GridItem span={8}>
                <ExternalLink href={providerDocumentationLink[selectedIDP]}>
                  Learn more about
                  {' '}
                  {idpTypeName}
                  {' '}
                  identity providers
                </ExternalLink>
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
          {SelectedProviderRequiredFields
        && (
          <SelectedProviderRequiredFields
            isPending={isPending}
            // make google required form optional when mapping method is lookup
            isRequired={selectedIDP === IDPformValues.GOOGLE
            && !(selectedMappingMethod === mappingMethodsformValues.LOOKUP)}
            isEditForm={isEditForm}
            idpEdited={idpEdited}
            change={change}
            HTPasswdPasswordErrors={HTPasswdPasswordErrors}
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
  HTPasswdPasswordErrors: PropTypes.object,
  idpTypeName: PropTypes.string,
  formTitle: PropTypes.string,
};

IDPForm.defaultProps = {
  selectedIDP: 'GithubIdentityProvider',
  clusterConsoleURL: '',
};

export default IDPForm;
