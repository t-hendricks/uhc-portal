import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { GridItem } from '@patternfly/react-core';

import { ReduxCheckbox } from '../../../../../../common/ReduxFormComponents';
import CAUpload from '../CAUpload';

class LDAPForm extends React.Component {
  state = {
    isInsecure: false,
    caDisabledHelpText: '',
  }

  componentDidMount() {
    const {
      isEditForm, idpEdited,
    } = this.props;
    this.setState({
      isInsecure: isEditForm ? idpEdited.ldap.insecure : false,
      caDisabledHelpText: '',
    });
  }

  toggleCADisabled = (e, value) => {
    if (value) {
      this.setState({ isInsecure: true, caDisabledHelpText: 'Cannot be used if insecure is set.' });
    } else {
      this.setState({ isInsecure: false, caDisabledHelpText: '' });
    }
  };

  render() {
    const { isPending, isEditForm, idpEdited } = this.props;
    const { isInsecure, caDisabledHelpText } = this.state;

    return (
      <>
        <GridItem span={8}>
          <Field
            component={CAUpload}
            name="ldap_ca"
            label="CA file"
            helpText={`PEM encoded certificate bundle to use to validate server certificates for the configured URL. ${caDisabledHelpText}`}
            isDisabled={isInsecure || isPending}
            certValue={isEditForm && !isInsecure ? idpEdited.ldap.ca : ''}

          />
        </GridItem>
        <GridItem span={8}>
          <Field
            component={ReduxCheckbox}
            name="ldap_insecure"
            label="Insecure"
            isDisabled={isPending}
            onChange={this.toggleCADisabled}
          />
        </GridItem>
      </>
    );
  }
}

LDAPForm.propTypes = {
  isPending: PropTypes.bool,
  isEditForm: PropTypes.bool,
  idpEdited: PropTypes.object,
};

LDAPForm.defaultProps = {
  isPending: false,
};

export default LDAPForm;
