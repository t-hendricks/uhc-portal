import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import {
  Button, Form, Modal, Alert, Grid, Col, Row,
} from 'patternfly-react';

import ReduxVerticalFormGroup from '../../../common/ReduxVerticalFormGroup';
import validators from '../../../../common/validators';
import ModalHeader from '../../../common/Modal/components/ModalHeader';

class EditClusterDialog extends Component {
  componentWillReceiveProps(nextProps) {
    const { change } = this.props;
    if (nextProps.initialFormValues.nodesCompute) {
      change('nodes_compute', nextProps.initialFormValues.nodesCompute);
    }
  }

  componentDidUpdate() {
    const {
      editClusterResponse, resetResponse, closeModal, onClose,
    } = this.props;
    if (editClusterResponse.fulfilled) {
      resetResponse();
      onClose();
      closeModal();
    }
  }

  render() {
    const {
      isOpen, closeModal, handleSubmit, editClusterResponse, resetResponse,
    } = this.props;

    const cancelEdit = () => {
      resetResponse();
      closeModal();
    };

    const hasError = editClusterResponse.error ? (
      <Alert>
        <span>{`Error editing cluster: ${editClusterResponse.errorMessage}`}</span>
      </Alert>) : null;

    return isOpen && (
      <Modal show>
        <Modal.Header>
          <ModalHeader title="Edit Cluster" onClose={cancelEdit} />
        </Modal.Header>
        <Modal.Body>
          <Form horizontal onSubmit={handleSubmit}>
            <Grid>
              <Row>
                <Col sm={5}>
                  {hasError}
                  <Field
                    component={ReduxVerticalFormGroup}
                    name="nodes_compute"
                    label="Compute nodes"
                    type="number"
                    validate={validators.nodes}
                    min="1"
                  />
                </Col>
              </Row>
            </Grid>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button bsStyle="primary" onClick={handleSubmit}>
            Edit
          </Button>
          <Button bsStyle="default" onClick={cancelEdit}>
            Cancel
          </Button>
        </Modal.Footer>
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
  initialFormValues: PropTypes.shape(
    { id: PropTypes.string, nodesCompute: PropTypes.number },
  ).isRequired,
};

EditClusterDialog.defaultProps = {
  isOpen: false,
  editClusterResponse: {},
};

export default EditClusterDialog;
