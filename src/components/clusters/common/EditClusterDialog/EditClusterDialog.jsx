import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, FormSection } from 'redux-form';
import {
  Button, Form, Modal, Alert, Grid, Col, Row, FormGroup, ControlLabel, Spinner,
} from 'patternfly-react';

import ReduxVerticalFormGroup from '../../../common/ReduxVerticalFormGroup';
import validators from '../../../../common/validators';
import ModalHeader from '../../../common/Modal/components/ModalHeader';

class EditClusterDialog extends Component {
  componentDidUpdate(prevProps) {
    const {
      editClusterResponse,
      editRouterShardResponse,
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

    // Only finalize when all responses are out of their pending state
    if ((editClusterResponse.fulfilled || editRouterShardResponse.fulfilled)
        && !editClusterResponse.pending && !editRouterShardResponse.pending
        && !editRouterShardResponse.error && !editClusterResponse.error) {
      resetResponse();
      onClose();
      closeModal();
    }
  }

  render() {
    const {
      isOpen,
      closeModal,
      handleSubmit,
      editClusterResponse,
      editRouterShardResponse,
      resetResponse,
      hasRouterShards,
    } = this.props;

    const cancelEdit = () => {
      resetResponse();
      closeModal();
    };

    const hasError = (editClusterResponse.error || editRouterShardResponse.error) ? (
      <Alert>
        <span>{`Error editing cluster: ${editClusterResponse.errorMessage || editRouterShardResponse.errorMessage}`}</span>
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
              <Row>
                <Col sm={5}>
                  <FormGroup>
                    <FormSection name="network_router_shards">
                      <ControlLabel>Router Shards</ControlLabel>
                      <Spinner loading={!hasRouterShards} inline size="xs" />
                      <Col sm={12}>
                        <Field
                          component={ReduxVerticalFormGroup}
                          name="0.label"
                          label=""
                          placeholder="Label"
                          type="text"
                          normalize={val => val.toLowerCase()}
                        />
                        <Field
                          component={ReduxVerticalFormGroup}
                          name="1.label"
                          label=""
                          placeholder="Label"
                          type="text"
                          normalize={val => val.toLowerCase()}
                        />
                      </Col>
                    </FormSection>
                  </FormGroup>
                </Col>
              </Row>
            </Grid>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button bsStyle="default" onClick={cancelEdit}>
            Cancel
          </Button>
          <Button bsStyle="primary" disabled={!hasRouterShards} onClick={handleSubmit}>
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
  editRouterShardResponse: PropTypes.object,
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
  editRouterShardResponse: {},
};

export default EditClusterDialog;
