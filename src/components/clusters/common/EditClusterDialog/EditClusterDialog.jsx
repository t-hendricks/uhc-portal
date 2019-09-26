import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Form } from '@patternfly/react-core';

import Modal from '../../../common/Modal/Modal';

import ReduxVerticalFormGroup from '../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import validators from '../../../../common/validators';
import ErrorBox from '../../../common/ErrorBox';


class EditClusterDialog extends Component {
  componentDidUpdate(prevProps) {
    const {
      editClusterResponse,
      resetResponse,
      closeModal,
      onClose,
      initialFormValues,
      change,
    } = this.props;

    if (initialFormValues.id) {
      // update initial values when a cluster is attached to the form
      if (prevProps.initialFormValues.id !== initialFormValues.id) {
        change('id', initialFormValues.id);
        change('nodes_compute', initialFormValues.nodesCompute);
      }
    }

    // Only finalize when all responses are out of their pending state
    if (editClusterResponse.fulfilled
        && !editClusterResponse.pending
        && !editClusterResponse.error) {
      resetResponse();
      onClose();
      closeModal();
    }
  }

  validateNodes = (nodes) => {
    const { min } = this.props;
    return validators.nodes(nodes, min);
  }

  render() {
    const {
      isOpen,
      closeModal,
      handleSubmit,
      editClusterResponse,
      resetResponse,
      min,
      isMultiAz,
    } = this.props;

    const { pending } = editClusterResponse;

    const cancelEdit = () => {
      resetResponse();
      closeModal();
    };

    const error = editClusterResponse.error ? (
      <ErrorBox message="Error editing cluster" response={editClusterResponse} />
    ) : null;

    return isOpen && (
      <Modal
        title="Scale Cluster"
        onClose={cancelEdit}
        primaryText="Apply"
        onPrimaryClick={handleSubmit}
        onSecondaryClick={cancelEdit}
        isPrimaryDisabled={pending}
        isPending={pending}
      >
        <React.Fragment>
          {error}
          <Form onSubmit={handleSubmit}>
            <Field
              component={ReduxVerticalFormGroup}
              name="nodes_compute"
              label="Compute nodes"
              inputMode="numeric"
              validate={isMultiAz ? [this.validateNodes, validators.nodesMultiAz]
                : this.validateNodes}
              min={min.value}
            />
          </Form>
        </React.Fragment>
      </Modal>
    );
  }
}

EditClusterDialog.propTypes = {
  change: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
  closeModal: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  resetResponse: PropTypes.func.isRequired,
  editClusterResponse: PropTypes.object,
  min: PropTypes.shape({
    value: PropTypes.number,
    validationMsg: PropTypes.string,
  }).isRequired,
  isMultiAz: PropTypes.bool,
  initialFormValues: PropTypes.shape({
    id: PropTypes.string,
    nodesCompute: PropTypes.number,
  }).isRequired,
};

EditClusterDialog.defaultProps = {
  isOpen: false,
  editClusterResponse: {},
};

export default EditClusterDialog;
