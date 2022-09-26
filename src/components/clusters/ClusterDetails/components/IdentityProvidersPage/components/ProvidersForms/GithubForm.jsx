import React from 'react';
import PropTypes from 'prop-types';
import { Divider, Title, GridItem } from '@patternfly/react-core';
import { Field } from 'redux-form';
import { noop } from '../../../../../../../common/helpers';
import {
  atLeastOneRequired,
  checkGithubTeams,
  required,
} from '../../../../../../../common/validators';

import IDPBasicFields from './IDPBasicFields';
import ReduxVerticalFormGroup from '../../../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import ReduxFieldArray from '../../../../../../common/ReduxFormComponents/ReduxFieldArray';
import RadioButtons from '../../../../../../common/ReduxFormComponents/RadioButtons';
import CAUpload from '../CAUpload';
import './GithubForm.scss';

class GithubFormRequired extends React.Component {
  state = {
    authMode: '',
    hostnameRequired: false,
  };

  componentDidMount() {
    const { isEditForm, idpEdited } = this.props;
    if (isEditForm) {
      if (idpEdited.github.ca) {
        this.setState({ hostnameRequired: true });
      }
      this.setState({ authMode: idpEdited.github.organizations ? 'organizations' : 'teams' });
    } else {
      this.setState({ authMode: 'organizations' });
    }
  }

  toggleHostnameRequired = (e, value) => {
    if (value && value.trim() !== '') {
      this.setState({ hostnameRequired: true });
    } else {
      this.setState({ hostnameRequired: false });
    }
  };

  onAuthModeChange = (_, mode) => {
    this.setState({ authMode: mode });
  };

  render() {
    const { isPending, idpEdited, isEditForm } = this.props;
    const { authMode, hostnameRequired } = this.state;

    return (
      <>
        <IDPBasicFields />
        <GridItem span={8}>
          <Field
            component={ReduxVerticalFormGroup}
            name="hostname"
            label="Hostname"
            type="text"
            disabled={isPending}
            validate={hostnameRequired ? required : noop}
            isRequired={hostnameRequired}
            extendedHelpText="You can use the GitHub integration to connect to either GitHub or GitHub Enterprise. For
              GitHub Enterprise, you must provide the hostname of your instance and, optionally,
              provide a CA certificate bundle to use in requests to the server."
            helpText="Optional domain to use with a hosted instance of GitHub Enterprise."
          />
        </GridItem>
        <GridItem span={8}>
          <Field
            component={CAUpload}
            name="github_ca"
            label="CA file"
            type="text"
            helpText="PEM encoded certificate bundle to use to validate server certificates for the configured GitHub Enterprise URL."
            isDisabled={isPending}
            onChange={(e, value) => this.toggleHostnameRequired(e, value)}
            certValue={isEditForm ? idpEdited.github.ca : ''}
          />
        </GridItem>

        <GridItem span={8}>
          <Divider />
          <Title headingLevel="h3" size="xl" className="pf-u-mt-lg">
            Organizations or teams
          </Title>
          <p>
            Github authentication lets you use either GitHub organizations or GitHub teams to
            restrict access.
          </p>
          <p className="idp-github-auth-mode-selection-question">
            Do you want to use GitHub organizations, or GitHub teams?
          </p>
          <Field
            component={RadioButtons}
            name="github_auth_mode"
            defaultValue={authMode}
            options={[
              { value: 'organizations', label: 'Use organizations' },
              { value: 'teams', label: 'Use teams' },
            ]}
            onChange={this.onAuthModeChange}
          />
        </GridItem>
        {authMode === 'organizations' ? (
          <ReduxFieldArray
            fieldName="organizations"
            label="Organizations"
            type="text"
            isRequired
            placeholderText="e.g. org"
            disabled={isPending}
            helpText="Only users that are members of at least one of the listed organizations will be allowed to log in."
            validate={atLeastOneRequired('organizations')}
          />
        ) : (
          <ReduxFieldArray
            fieldName="teams"
            label="Teams"
            type="text"
            isRequired
            placeholderText="e.g. org/team"
            disabled={isPending}
            helpText="Only users that are members of at least one of the listed teams will be allowed to log in. The format is <org>/<team>."
            validateField={checkGithubTeams}
            key="teams"
            validate={atLeastOneRequired('teams')}
          />
        )}
      </>
    );
  }
}

GithubFormRequired.propTypes = {
  isPending: PropTypes.bool,
  isEditForm: PropTypes.bool,
  idpEdited: PropTypes.object,
};

GithubFormRequired.defaultProps = {
  isPending: false,
};

export default GithubFormRequired;
