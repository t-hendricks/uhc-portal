import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import { noop } from '../../../../../../../common/helpers';
import { github } from '../../../../../../../common/validators';

import BasicFields from './BasicFields';
import ReduxVerticalFormGroup from '../../../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';

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
        <React.Fragment>
          <BasicFields />
          <Field
            component={ReduxVerticalFormGroup}
            name="organizations"
            label="Organizations"
            type="text"
            placeholder="comma separated, example: org1,org2,org3"
            disabled={orgsDisabled || isPending}
            helpText={orgsDisabled ? 'Cannot be used in combination with the teams field' : ''}
            onChange={(e, value) => this.toggleDisable(e, value, 'teamsDisabled')}
            validate={orgsDisabled ? noop : github}
          />
          <Field
            component={ReduxVerticalFormGroup}
            name="teams"
            label="Teams"
            type="text"
            placeholder="comma separated, example: org1/team1,org2/team2"
            disabled={teamsDisabled || isPending}
            helpText={teamsDisabled ? 'Cannot be used in combination with the organizations field' : ''}
            onChange={(e, value) => this.toggleDisable(e, value, 'orgsDisabled')}
            validate={teamsDisabled ? noop : github}
          />
        </React.Fragment>
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
