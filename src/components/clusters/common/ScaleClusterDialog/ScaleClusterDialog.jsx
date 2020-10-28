import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import {
  Form, FormGroup, Alert, Grid, GridItem,
} from '@patternfly/react-core';

import Modal from '../../../common/Modal/Modal';

import ErrorBox from '../../../common/ErrorBox';
import PersistentStorageDropdown from '../PersistentStorageDropdown';
import LoadBalancersDropdown from '../LoadBalancersDropdown';
import { shouldRefetchQuota } from '../../../../common/helpers';


class ScaleClusterDialog extends Component {
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
    if (shouldRefetchQuota(organization)) {
      getOrganizationAndQuota();
    }
  }

  componentDidUpdate(prevProps) {
    const {
      editClusterResponse,
      resetResponse,
      closeModal,
      onClose,
      organization,
      getOrganizationAndQuota,
      isOpen,
    } = this.props;

    // Fetch quota on opening the scale modal.
    if (!prevProps.isOpen && isOpen && shouldRefetchQuota(organization)) {
      getOrganizationAndQuota();
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

  render() {
    const {
      isOpen,
      closeModal,
      handleSubmit,
      editClusterResponse,
      resetResponse,
      consoleURL,
      showLoadBalancerAlert,
      showPersistentStorageAlert,
      masterResizeAlertThreshold,
      persistentStorageValues,
      loadBalancerValues,
      initialValues,
      organization,
      isByoc,
      pristine,
      cloudProviderID,
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

    const resizingAlert = nodes => (
      <Alert
        variant="warning"
        isInline
        title={`Scaling to more than ${nodes} nodes may take 24 hours`}
      >
        <div>
          <p>
            In order to scale to more than
            {' '}
            {nodes}
            {' '}
            nodes, the cluster&apos;s master nodes have
            to be manually resized by a Red Hat SRE.
            This process will take about 24 hours.
          </p>
        </div>
      </Alert>
    );

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

    const className = isByoc ? 'edit-cluster-modal' : 'edit-cluster-modal edit-cluster-modal-rhinfra';

    return isOpen && (
      <Modal
        className={className}
        title="Edit load balancers and persistent storage"
        onClose={cancelEdit}
        primaryText="Apply"
        onPrimaryClick={handleSubmit}
        onSecondaryClick={cancelEdit}
        isPrimaryDisabled={pending || pristine}
        isPending={pending}
        isSmall
      >
        <>
          {error}
          <Form onSubmit={handleSubmit}>
            <Grid hasGutter>
              {!!masterResizeAlertThreshold && resizingAlert(masterResizeAlertThreshold)}
              { !isByoc && (
                <>
                  <GridItem span={8}>
                    <FormGroup
                      fieldId="load_balancers"
                      label="Load balancers"
                    >
                      <Field
                        label="Load balancers"
                        name="load_balancers"
                        component={LoadBalancersDropdown}
                        disabled={pending}
                        currentValue={initialValues.load_balancers}
                        cloudProviderID={cloudProviderID}
                      />
                    </FormGroup>
                  </GridItem>
                  <GridItem span={4} />
                  {showLoadBalancerAlert && scalingAlert}
                  <GridItem span={8}>
                    <FormGroup
                      fieldId="persistent_storage"
                      label="Persistent storage"
                    >
                      <Field
                        label="Persistent storage"
                        name="persistent_storage"
                        component={PersistentStorageDropdown}
                        disabled={pending}
                        currentValue={initialValues.persistent_storage}
                        cloudProviderID={cloudProviderID}
                      />
                    </FormGroup>
                  </GridItem>
                  <GridItem span={4} />
                  {showPersistentStorageAlert && scalingAlert}
                </>
              )}
            </Grid>
          </Form>
        </>
      </Modal>
    );
  }
}

ScaleClusterDialog.propTypes = {
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
  consoleURL: PropTypes.string,
  initialValues: PropTypes.shape({
    id: PropTypes.string,
    nodes_compute: PropTypes.number,
    persistent_storage: PropTypes.number,
    load_balancers: PropTypes.number,
  }).isRequired,
  showLoadBalancerAlert: PropTypes.bool,
  showPersistentStorageAlert: PropTypes.bool,
  masterResizeAlertThreshold: PropTypes.number,
  getLoadBalancers: PropTypes.func.isRequired,
  getPersistentStorage: PropTypes.func.isRequired,
  persistentStorageValues: PropTypes.object.isRequired,
  loadBalancerValues: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
  getOrganizationAndQuota: PropTypes.func.isRequired,
  isByoc: PropTypes.bool,
  cloudProviderID: PropTypes.string.isRequired,
  pristine: PropTypes.bool, // from redux-form
};

ScaleClusterDialog.defaultProps = {
  isOpen: false,
  editClusterResponse: {},
};

export default ScaleClusterDialog;
