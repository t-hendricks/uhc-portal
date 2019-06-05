import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import BasicFields from './BasicFields';
import { noop } from '../../../../../../common/helpers';
import ReduxVerticalFormGroup from '../../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';

function GithubFormRequired({
  createIDPResponse, teamsDisabled, orgsDisabled, toggleDisable,
}) {
  return (
    <React.Fragment>
      <BasicFields />
      <Field
        component={ReduxVerticalFormGroup}
        name="organizations"
        label="Organizations"
        type="text"
        placeholder="comma separated, example: org1,org2,org3"
        disabled={orgsDisabled || createIDPResponse.pending}
        helpText={orgsDisabled ? 'Cannot be used in combination with the teams field' : ''}
        onChange={(e, value) => toggleDisable(e, value, 'teamsDisabled')}
      />
      <Field
        component={ReduxVerticalFormGroup}
        name="teams"
        label="Teams"
        type="text"
        placeholder="comma separated, example: team1,team2"
        disabled={teamsDisabled || createIDPResponse.pending}
        helpText={teamsDisabled ? 'Cannot be used in combination with the organizations field' : ''}
        onChange={(e, value) => toggleDisable(e, value, 'orgsDisabled')}
      />
    </React.Fragment>
  );
}

GithubFormRequired.propTypes = {
  createIDPResponse: PropTypes.object,
  teamsDisabled: PropTypes.bool,
  orgsDisabled: PropTypes.bool,
  toggleDisable: PropTypes.func,
};

GithubFormRequired.defaultProps = {
  createIDPResponse: {},
  teamsDisabled: false,
  orgsDisabled: false,
  toggleDisable: noop,
};

export default GithubFormRequired;
