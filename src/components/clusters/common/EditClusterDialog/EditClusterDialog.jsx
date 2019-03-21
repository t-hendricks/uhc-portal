import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import {
  Button, Form, Modal, Alert, Grid, Col, Row, FormGroup, ControlLabel,
} from 'patternfly-react';

import ReduxVerticalFormGroup from '../../../common/ReduxVerticalFormGroup';
import RouterShardInputForm from '../RouterShardInputForm/RouterShardInputForm';
import validators from '../../../../common/validators';
import ModalHeader from '../../../common/Modal/components/ModalHeader';

class EditClusterDialog extends Component {
  componentDidUpdate(prevProps) {
    const {
      editClusterResponse,
      resetResponse,
      closeModal,
      onClose,
      initialFormValues,
      change,
      hasRouterShards,
      fetchRouterShards,
    } = this.props;

    if (initialFormValues.id) {
      // update initial values when a cluster is attached to the form
      if (prevProps.initialFormValues.id !== initialFormValues.id) {
        change('id', initialFormValues.id);
        change('nodes_compute', initialFormValues.nodesCompute);

        // fetch router shards
        if (!hasRouterShards) {
          fetchRouterShards(initialFormValues.id);
        }
      }

      // update initial router shards values once they are available
      if (!prevProps.hasRouterShards
          && hasRouterShards
          && initialFormValues.routerShards) {
        change('network_router_shards', initialFormValues.routerShards);
      }
    }

    if (editClusterResponse.fulfilled) {
      resetResponse();
      onClose();
      closeModal();
    }
  }

  render() {
    const {
      isOpen, closeModal, handleSubmit, editClusterResponse, resetResponse, hasRouterShards,
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
              { hasRouterShards
              && (
                <Row>
                  <Col sm={5}>
                    <FormGroup>
                      <ControlLabel>Router Shards</ControlLabel>
                      <Field
                        component={RouterShardInputForm}
                        name="network_router_shards.0"
                        validate={validators.routerShard}
                      />
                      <Field
                        component={RouterShardInputForm}
                        name="network_router_shards.1"
                        validate={validators.routerShard}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              )
              }
            </Grid>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button bsStyle="default" onClick={cancelEdit}>
            Cancel
          </Button>
          <Button bsStyle="primary" onClick={handleSubmit}>
            Edit
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
  fetchRouterShards: PropTypes.func.isRequired,
  editClusterResponse: PropTypes.object,
  hasRouterShards: PropTypes.bool.isRequired,
  initialFormValues: PropTypes.shape({
    id: PropTypes.string,
    nodesCompute: PropTypes.number,
    routerShards: PropTypes.array,
  }).isRequired,
};

EditClusterDialog.defaultProps = {
  isOpen: false,
  editClusterResponse: {},
};

export default EditClusterDialog;
