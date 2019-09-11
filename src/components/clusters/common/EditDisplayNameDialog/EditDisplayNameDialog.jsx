import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Form, TextInput, FormGroup } from '@patternfly/react-core';

import Modal from '../../../common/Modal/Modal';
import ErrorBox from '../../../common/ErrorBox';
import { checkClusterDisplayName } from '../../../../common/validators';


class EditDisplayNameDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validFor: null,
      currentValue: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    const { validFor } = this.state;
    if (nextProps.clusterID !== validFor) {
      this.setState((state, props) => ({
        validFor: nextProps.clusterID,
        currentValue: props.displayName,
      }));
    }
  }


  componentDidUpdate() {
    const {
      editClusterResponse, resetResponse, closeModal, onClose,
    } = this.props;
    if (editClusterResponse.fulfilled) {
      resetResponse();
      closeModal();
      onClose();
    }
  }

  setValue(newValue) {
    this.setState({
      currentValue: newValue,
    });
  }

  render() {
    const {
      isOpen, closeModal, submit, editClusterResponse, resetResponse, clusterID, subscriptionID,
    } = this.props;
    const { currentValue } = this.state;

    const cancelEdit = () => {
      resetResponse();
      closeModal();
    };

    const hasError = editClusterResponse.error && (
      <ErrorBox message="Error changing display name" response={editClusterResponse} />
    );

    const validationMessage = checkClusterDisplayName(currentValue);
    const handleSubmit = () => {
      if (!validationMessage) {
        submit(clusterID, subscriptionID, currentValue);
      }
    };

    return isOpen && (

      <Modal
        title="Edit Display Name"
        onClose={cancelEdit}
        primaryText="Edit"
        secondaryText="Cancel"
        onPrimaryClick={handleSubmit}
        onSecondaryClick={cancelEdit}
        isPrimaryDisabled={!!validationMessage}
      >
        <React.Fragment>
          {hasError}
          <Form onSubmit={(e) => { handleSubmit(); e.preventDefault(); }}>
            <FormGroup
              helperTextInvalid={validationMessage}
              isValid={!validationMessage}
              fieldId="edit-display-name-input"
            >
              <TextInput
                type="text"
                isValid={!validationMessage}
                value={currentValue}
                placeholder="Enter display name"
                onChange={newValue => this.setValue(newValue)}
                aria-label="Edit display name"
                id="edit-display-name-input"
              />
            </FormGroup>
          </Form>
        </React.Fragment>
      </Modal>
    );
  }
}

EditDisplayNameDialog.propTypes = {
  isOpen: PropTypes.bool,
  closeModal: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  resetResponse: PropTypes.func.isRequired,
  editClusterResponse: PropTypes.object,
  displayName: PropTypes.string,
  clusterID: PropTypes.string,
  subscriptionID: PropTypes.string,
};

EditDisplayNameDialog.defaultProps = {
  isOpen: false,
  editClusterResponse: {},
};

export default EditDisplayNameDialog;
