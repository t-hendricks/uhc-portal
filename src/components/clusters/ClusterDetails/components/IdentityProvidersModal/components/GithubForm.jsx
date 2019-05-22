import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import { noop } from '../../../../../../common/helpers';

import ReduxVerticalFormGroup from '../../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';

function GithubForm({
  createIDPResponse, teamsDisabled, orgsDisabled, toggleDisable,
}) {
  return (
    <React.Fragment>
      <Field
        component={ReduxVerticalFormGroup}
        name="hostname"
        label="Hostname"
        type="text"
        placeholder="hostname"
        disabled={createIDPResponse.pending}
      />
      <Field
        component={ReduxVerticalFormGroup}
        name="organizations"
        label="Organizations"
        type="text"
        placeholder="comma separated, example: 'org1,org2,org3"
        disabled={orgsDisabled || createIDPResponse.pending}
        onChange={(e, value) => toggleDisable(e, value, 'teamsDisabled')}
      />
      <Field
        component={ReduxVerticalFormGroup}
        name="teams"
        label="Teams"
        type="text"
        placeholder="comma separated, example: 'team1,team2"
        disabled={teamsDisabled || createIDPResponse.pending}
        onChange={(e, value) => toggleDisable(e, value, 'orgsDisabled')}
      />
    </React.Fragment>
  );
}

GithubForm.propTypes = {
  createIDPResponse: PropTypes.object,
  teamsDisabled: PropTypes.bool,
  orgsDisabled: PropTypes.bool,
  toggleDisable: PropTypes.func,
};

GithubForm.defaultProps = {
  createIDPResponse: {},
  teamsDisabled: false,
  orgsDisabled: false,
  toggleDisable: noop,
};

export default GithubForm;
