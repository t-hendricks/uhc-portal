import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { GridItem } from '@patternfly/react-core';

import ReduxVerticalFormGroup from '../../../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import { required } from '../../../../../../../common/validators';
import { noop } from '../../../../../../../common/helpers';
import CAUpload from '../CAUpload';

class GithubForm extends React.Component {
  state = {
    hostnameRequired: false,
  };

  toggleHostnameRequired = (e, value) => {
    if (value) {
      this.setState({ hostnameRequired: true });
    } else {
      this.setState({ hostnameRequired: false });
    }
  }

  render() {
    const { isPending } = this.props;
    const { hostnameRequired } = this.state;

    return (
      <>
        <GridItem span={8}>
          <Field
            component={ReduxVerticalFormGroup}
            name="hostname"
            label="Hostname"
            type="text"
            disabled={isPending}
            validate={hostnameRequired ? required : noop}
            isRequired={hostnameRequired}
            helpText="Optional domain to use with a hosted instance of GitHub Enterprise."
          />
        </GridItem>
        <GridItem span={8}>
          <Field
            component={CAUpload}
            name="github_ca"
            label="CA File"
            type="text"
            helpText="PEM encoded certificate bundle to use to validate server certificates for the configured GitHub Enterprise URL."
            isDisabled={isPending}
            onChange={(e, value) => this.toggleHostnameRequired(e, value)}
          />
        </GridItem>

      </>
    );
  }
}

GithubForm.propTypes = {
  isPending: PropTypes.bool,
};

GithubForm.defaultProps = {
  isPending: false,
};

export default GithubForm;
