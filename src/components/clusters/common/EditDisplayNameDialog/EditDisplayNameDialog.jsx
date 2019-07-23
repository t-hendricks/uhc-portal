import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Form, TextInput } from '@patternfly/react-core';

import Modal from '../../../common/Modal/Modal';
import ErrorBox from '../../../common/ErrorBox';


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
      isOpen, closeModal, submit, editClusterResponse, resetResponse, clusterID,
    } = this.props;
    const { currentValue } = this.state;

    const cancelEdit = () => {
      resetResponse();
      closeModal();
    };

    const hasError = editClusterResponse.error && (
      <ErrorBox id="edit-cl-name-error" message="Error changing display name" response={editClusterResponse} />
    );

    const handleSubmit = () => { submit(clusterID, currentValue); };

    return isOpen && (

      <Modal
        title="Edit Display Name"
        onClose={cancelEdit}
        primaryText="Edit"
        secondaryText="Cancel"
        onPrimaryClick={handleSubmit}
        onSecondaryClick={cancelEdit}
      >
        <React.Fragment>
          {hasError}
          <Form onSubmit={(e) => { handleSubmit(); e.preventDefault(); }}>
            <TextInput
              type="text"
              value={currentValue}
              placeholder="Enter display name"
              onChange={newValue => this.setValue(newValue)}
              aria-label="Edit display name"
            />
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
};

EditDisplayNameDialog.defaultProps = {
  isOpen: false,
  editClusterResponse: {},
};

export default EditDisplayNameDialog;
