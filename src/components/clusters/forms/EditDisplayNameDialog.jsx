import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import {
  Button, Icon, Form, Modal, Alert, Grid, Col, Row,
} from 'patternfly-react';

import ReduxVerticalFormGroup from '../ReduxVerticalFormGroup';
import { editCluster, clearClusterResponse } from '../../../redux/actions/clusterActions';

function EditDisplayNameDialog(props) {
  // handleSubmit comes from reduxForm()
  const {
    closeFunc, handleSubmit, editClusterResponse, resetResponse,
  } = props;

  const cancelEdit = () => {
    resetResponse();
    closeFunc(true);
  };

  if (editClusterResponse.fulfilled) {
    resetResponse();
    closeFunc(true);
  }

  let errorContainer = <div />;
  if (editClusterResponse.error) {
    errorContainer = (
      <Alert>
        <span>
            Error changing display name:
        </span>
        <span>
          {editClusterResponse.error}
        </span>
        <span>
          {editClusterResponse.errorMessage}
        </span>
      </Alert>
    );
  }

  return (
    <React.Fragment>
      <Modal.Header>
        <button type="button" className="close" aria-hidden="true" aria-label="Close" onClick={closeFunc}>
          <Icon type="pf" name="close" />
        </button>
        <Modal.Title>
          Edit Display Name
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form horizontal onSubmit={handleSubmit}>
          <Grid>
            <Row>
              <Col sm={5}>
                {errorContainer}
                <Field
                  component={ReduxVerticalFormGroup}
                  name="display_name"
                  label="Cluster name"
                  type="text"
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
    </React.Fragment>
  );
}

EditDisplayNameDialog.propTypes = {
  closeFunc: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  resetResponse: PropTypes.func.isRequired,
  editClusterResponse: PropTypes.object,
};
const reduxFormConfig = {
  form: 'EditDisplayName',
};
const reduxFormEditDisplayName = reduxForm(reduxFormConfig)(EditDisplayNameDialog);

const mapStateToProps = (state, props) => ({
  editClusterResponse: state.cluster.editedCluster,
  initialValues: {
    id: props.cluster.id,
    display_name: props.cluster.display_name,
  },
});

const mapDispatchToProps = dispatch => ({
  onSubmit: (formData) => {
    const clusterRequest = {
      display_name: formData.display_name,
    };
    dispatch(editCluster(formData.id, clusterRequest));
  },
  resetResponse: () => dispatch(clearClusterResponse()),
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxFormEditDisplayName);
