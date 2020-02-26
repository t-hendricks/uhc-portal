import React from 'react';
import PropTypes from 'prop-types';
import { noop } from '../../../../../../../common/helpers';
import { github, checkGithubTeams } from '../../../../../../../common/validators';

import IDPBasicFields from './IDPBasicFields';
import ReduxFieldArray from '../../../../../../common/ReduxFormComponents/ReduxFieldArray';

class GithubFormRequired extends React.Component {
    state = {
      teamsDisabled: false,
      orgsDisabled: false,
    };

    toggleDisable = (e, value, fieldToToggle) => {
    // equivalent to: const isDisabled = this.state[fieldToToggle]
      const { [fieldToToggle]: isDisabled } = this.state;

      if (value && !isDisabled) {
        this.setState({ [fieldToToggle]: true });
      } else if ((!value || value === '') && isDisabled) {
        this.setState({ [fieldToToggle]: false });
      }
    }

    render() {
      const { isPending } = this.props;
      const { teamsDisabled, orgsDisabled } = this.state;
      return (
        <>
          <IDPBasicFields />
          <ReduxFieldArray
            fieldName="organizations"
            label="Organizations"
            type="text"
            isRequired={!orgsDisabled}
            placeholderText="e.g. org"
            disabled={orgsDisabled || isPending}
            helpText={orgsDisabled ? 'Cannot be used in combination with the teams field' : ''}
            onFormChange={(e, value) => this.toggleDisable(e, value, 'teamsDisabled')}
            validateField={orgsDisabled ? noop : github}
          />
          <ReduxFieldArray
            fieldName="teams"
            label="Teams"
            type="text"
            isRequired={!teamsDisabled}
            placeholderText="e.g. org/team"
            disabled={teamsDisabled || isPending}
            helpText={teamsDisabled ? 'Cannot be used in combination with the organizations field' : ''}
            onFormChange={(e, value) => this.toggleDisable(e, value, 'orgsDisabled')}
            validateField={teamsDisabled ? noop : [github, checkGithubTeams]}
          />
        </>
      );
    }
}

GithubFormRequired.propTypes = {
  isPending: PropTypes.bool,
};

GithubFormRequired.defaultProps = {
  isPending: false,
};

export default GithubFormRequired;
