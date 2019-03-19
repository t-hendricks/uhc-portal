import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import {
  Button, Form, Modal, Alert, Grid, Col, Row,
} from 'patternfly-react';

import ReduxVerticalFormGroup from '../../../common/ReduxVerticalFormGroup';
import ModalHeader from '../../../common/Modal/components/ModalHeader';

class EditDisplayNameDialog extends Component {
  componentWillReceiveProps(nextProps) {
    const { change } = this.props;
    const { id, displayName } = nextProps.initialFormValues;
    change('display_name', displayName);
    change('id', id);
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

  render() {
    const {
      isOpen, closeModal, handleSubmit, editClusterResponse, resetResponse,
    } = this.props;

    const cancelEdit = () => {
      resetResponse();
      closeModal();
    };

    const hasError = editClusterResponse.error && (
    <Alert>
      <span>{`Error changing display name: ${editClusterResponse.errorMessage}`}</span>
    </Alert>);

    return isOpen && (
    <Modal show>
      <Modal.Header>
        <ModalHeader title="Edit Display Name" onClose={cancelEdit} />
      </Modal.Header>
      <Modal.Body>
        <Form horizontal onSubmit={() => handleSubmit()}>
          <Grid>
            <Row>
              <Col sm={5}>
                {hasError}
                <Field
                  component={ReduxVerticalFormGroup}
                  name="display_name"
                  label="Display Name"
                  type="text"
                />
              </Col>
            </Row>
          </Grid>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button bsStyle="default" onClick={cancelEdit}>
            Cancel
        </Button>
        <Button bsStyle="primary" onClick={() => handleSubmit()}>
            Edit
        </Button>
      </Modal.Footer>
    </Modal>
    );
  }
}

EditDisplayNameDialog.propTypes = {
  isOpen: PropTypes.bool,
  closeModal: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  resetResponse: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
  editClusterResponse: PropTypes.object,
  initialFormValues: PropTypes.shape(
    { id: PropTypes.string, displayName: PropTypes.string },
  ).isRequired,
};

EditDisplayNameDialog.defaultProps = {
  isOpen: false,
  editClusterResponse: {},
};

export default EditDisplayNameDialog;
