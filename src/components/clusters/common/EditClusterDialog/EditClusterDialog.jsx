import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import {
  Form, FormGroup, Alert,
} from '@patternfly/react-core';

import Modal from '../../../common/Modal/Modal';

import ReduxVerticalFormGroup from '../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import validators from '../../../../common/validators';
import ErrorBox from '../../../common/ErrorBox';
import PersistentStorageComboBox from '../../CreateOSDCluster/components/PersistentStorageComboBox';
import LoadBalancersComboBox from '../../CreateOSDCluster/components/LoadBalancersComboBox';


class EditClusterDialog extends Component {
  componentDidMount() {
    const {
      persistentStorageValues,
      loadBalancerValues,
      getLoadBalancers,
      getPersistentStorage,
      organization,
      getOrganizationAndQuota,
    } = this.props;
    if (!persistentStorageValues.fulfilled && !persistentStorageValues.pending) {
      getPersistentStorage();
    }
    if (!loadBalancerValues.fulfilled && !loadBalancerValues.pending) {
      getLoadBalancers();
    }
    if (!organization.fulfilled && !organization.pending) {
      getOrganizationAndQuota();
    }
  }

  componentDidUpdate(prevProps) {
    const {
      editClusterResponse,
      resetResponse,
      closeModal,
      onClose,
      initialFormValues,
      getOrganizationAndQuota,
      change,
    } = this.props;

    if (initialFormValues.id) {
      // update initial values when a cluster is attached to the form
      if (prevProps.initialFormValues.id !== initialFormValues.id) {
        change('id', initialFormValues.id);
        change('nodes_compute', initialFormValues.nodesCompute);
        change('persistent_storage', initialFormValues.persistent_storage.toString());
        change('load_balancers', initialFormValues.load_balancers.toString());
      }
    }

    // Only finalize when all responses are out of their pending state
    if (editClusterResponse.fulfilled
        && !editClusterResponse.pending
        && !editClusterResponse.error) {
      resetResponse();
      onClose();
      closeModal();
      getOrganizationAndQuota();
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
      consoleURL,
      showLoadBalancerAlert,
      showPersistentStorageAlert,
      persistentStorageValues,
      loadBalancerValues,
      initialFormValues,
      organization,
      isByoc,
    } = this.props;

    const cancelEdit = () => {
      resetResponse();
      closeModal();
    };

    const error = editClusterResponse.error ? (
      <ErrorBox message="Error editing cluster" response={editClusterResponse} />
    ) : null;

    const usageLink = consoleURL
      ? <a href={`${consoleURL}/k8s/ns/default/resourcequotas`} target="_blank" rel="noopener noreferrer">Check your usage</a> : 'Check your usage';

    const scalingAlert = (
      <Alert
        variant="warning"
        isInline
        title="Scaling below the current limit can cause problems in your environment"
      >
        <div>
          <p>
            {usageLink}
            {' '}
before proceeding to be sure you are not
            scaling below what is currently being used.
          </p>
        </div>
      </Alert>
    );

    const pending = loadBalancerValues.pending || persistentStorageValues.pending
     || editClusterResponse.pending || organization.pending;

    return isOpen && (
      <Modal
        className="edit-cluster-modal"
        title="Scale Cluster"
        onClose={cancelEdit}
        primaryText="Apply"
        onPrimaryClick={handleSubmit}
        onSecondaryClick={cancelEdit}
        isPrimaryDisabled={pending}
        isPending={pending}
      >
        <>
          {error}
          <Form onSubmit={handleSubmit}>
            <Field
              component={ReduxVerticalFormGroup}
              label="Compute nodes"
              name="nodes_compute"
              inputMode="numeric"
              validate={isMultiAz ? [this.validateNodes, validators.nodesMultiAz]
                : this.validateNodes}
              min={min.value}
            />
            { !isByoc && (
              <>
                <FormGroup
                  fieldId="load_balancers"
                  label="Load balancers"
                >
                  <Field
                    label="Load Balancers"
                    name="load_balancers"
                    component={LoadBalancersComboBox}
                    disabled={pending}
                    currentValue={initialFormValues.load_balancers}
                  />
                </FormGroup>
                {showLoadBalancerAlert && scalingAlert}
                <FormGroup
                  fieldId="persistent_storage"
                  label="Persistent storage"
                >
                  <Field
                    label="Persistent Storage"
                    name="persistent_storage"
                    component={PersistentStorageComboBox}
                    disabled={pending}
                    currentValue={initialFormValues.persistent_storage}
                  />
                </FormGroup>
                {showPersistentStorageAlert && scalingAlert}
              </>
            )}
          </Form>
        </>
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
  consoleURL: PropTypes.string,
  initialFormValues: PropTypes.shape({
    id: PropTypes.string,
    nodesCompute: PropTypes.number,
    persistent_storage: PropTypes.number,
    load_balancers: PropTypes.number,
  }).isRequired,
  showLoadBalancerAlert: PropTypes.bool,
  showPersistentStorageAlert: PropTypes.bool,
  getLoadBalancers: PropTypes.func.isRequired,
  getPersistentStorage: PropTypes.func.isRequired,
  persistentStorageValues: PropTypes.object.isRequired,
  loadBalancerValues: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
  getOrganizationAndQuota: PropTypes.func.isRequired,
  isByoc: PropTypes.bool,
};

EditClusterDialog.defaultProps = {
  isOpen: false,
  editClusterResponse: {},
};

export default EditClusterDialog;
