import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, FormSection } from 'redux-form';
import { Form } from '@patternfly/react-core';
import { ControlLabel, Spinner } from 'patternfly-react';

import Modal from '../../../common/Modal/Modal';

import ReduxVerticalFormGroup from '../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import validators from '../../../../common/validators';
import ErrorBox from '../../../common/ErrorBox';

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
      if (!prevProps.hasRouterShards && hasRouterShards) {
        change('network_router_shards', initialFormValues.routerShards || []);
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
      editRouterShardResponse,
      resetResponse,
      hasRouterShards,
      min,
      isMultiAz,
    } = this.props;

    const pending = editClusterResponse.pending || editRouterShardResponse.pending;

    const cancelEdit = () => {
      resetResponse();
      closeModal();
    };

    const error = (editClusterResponse.error || editRouterShardResponse.error) ? (
      <ErrorBox message="Error editing cluster" response={editClusterResponse.error ? editClusterResponse : editRouterShardResponse} />
    ) : null;

    return isOpen && (
      <Modal
        title="Edit Cluster"
        onClose={cancelEdit}
        primaryText="Apply"
        onPrimaryClick={handleSubmit}
        onSecondaryClick={cancelEdit}
        isPrimaryDisabled={!hasRouterShards || pending}
        isPending={pending}
      >
        <React.Fragment>
          {error}
          <Form onSubmit={handleSubmit}>
            <Field
              component={ReduxVerticalFormGroup}
              name="nodes_compute"
              label="Compute nodes"
              type="number"
              validate={isMultiAz ? [this.validateNodes, validators.nodesMultiAz]
                : this.validateNodes}
              min={min.value}
            />
            <FormSection name="network_router_shards">
              <ControlLabel>Router Shards</ControlLabel>
              {' '}
              <Spinner loading={!hasRouterShards} inline size="xs" />
              <Field
                component={ReduxVerticalFormGroup}
                name="0.label"
                label=""
                placeholder="Label"
                type="text"
                normalize={val => val.toLowerCase()}
                validate={validators.routerShard}
              />
              <Field
                component={ReduxVerticalFormGroup}
                name="1.label"
                label=""
                placeholder="Label"
                type="text"
                normalize={val => val.toLowerCase()}
                validate={validators.routerShard}
              />
            </FormSection>
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
  fetchRouterShards: PropTypes.func.isRequired,
  editClusterResponse: PropTypes.object,
  editRouterShardResponse: PropTypes.object,
  hasRouterShards: PropTypes.bool.isRequired,
  min: PropTypes.shape({
    value: PropTypes.number,
    validationMsg: PropTypes.string,
  }).isRequired,
  isMultiAz: PropTypes.bool,
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
