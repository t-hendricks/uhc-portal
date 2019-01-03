import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import {
  Button, Icon, Form, Modal, Alert, Grid, Col, Row,
} from 'patternfly-react';

import ReduxVerticalFormGroup from '../../clusters/ReduxVerticalFormGroup';
import { editCluster, clearClusterResponse } from '../../../redux/actions/clustersActions';

function EditClusterDialog(props) {
  // handleSubmit comes from reduxForm()
  const {
    closeFunc, handleSubmit, editClusterResponse, resetResponse,
  } = props;

  const cancelEdit = () => {
    resetResponse();
    closeFunc(false);
  };

  if (editClusterResponse.fulfilled) {
    resetResponse();
    closeFunc(true);
  }

  const errorContainer = (
    <Alert>
      <span>{`Error changing display name: ${editClusterResponse.errorMessage}`}</span>
    </Alert>
  && editClusterResponse.error);

  return (
    <React.Fragment>
      <Modal.Header>
        <button type="button" className="close" aria-hidden="true" aria-label="Close" onClick={cancelEdit}>
          <Icon type="pf" name="close" />
        </button>
        <Modal.Title>
          Edit Cluster
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
                  name="nodes_master"
                  label="Master nodes"
                  type="number"
                  min="1"
                />

                <Field
                  component={ReduxVerticalFormGroup}
                  name="nodes_infra"
                  label="Infra nodes"
                  type="number"
                  min="2"
                />

                <Field
                  component={ReduxVerticalFormGroup}
                  name="nodes_compute"
                  label="Compute nodes"
                  type="number"
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
    </React.Fragment>
  );
}

EditClusterDialog.propTypes = {
  closeFunc: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  resetResponse: PropTypes.func.isRequired,
  editClusterResponse: PropTypes.object,
};
const reduxFormConfig = {
  form: 'EditCluster',
};
const reduxFormEditCluster = reduxForm(reduxFormConfig)(EditClusterDialog);

const mapStateToProps = (state, props) => ({
  editClusterResponse: state.clusters.editedCluster,
  initialValues: {
    id: props.cluster.id,
    nodes_master: props.cluster.nodes.master,
    nodes_infra: props.cluster.nodes.infra,
    nodes_compute: props.cluster.nodes.compute,
  },
});

const mapDispatchToProps = dispatch => ({
  onSubmit: (formData) => {
    const clusterRequest = {
      nodes: {
        master: parseInt(formData.nodes_master, 10),
        infra: parseInt(formData.nodes_infra, 10),
        compute: parseInt(formData.nodes_compute, 10),
      },
    };
    dispatch(editCluster(formData.id, clusterRequest));
  },
  resetResponse: () => dispatch(clearClusterResponse()),
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxFormEditCluster);
