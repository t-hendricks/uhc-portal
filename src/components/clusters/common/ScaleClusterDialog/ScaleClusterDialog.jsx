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
import modals from '../../../common/Modal/modals';

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
    if (!organization.pending) {
      getOrganizationAndQuota();
    }
  }

  componentDidUpdate() {
    const {
      editClusterResponse,
      resetResponse,
      closeModal,
      onClose,
      getOrganizationAndQuota,
    } = this.props;

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
      closeModal,
      handleSubmit,
      editClusterResponse,
      resetResponse,
      consoleURL,
      showLoadBalancerAlert,
      showPersistentStorageAlert,
      persistentStorageValues,
      loadBalancerValues,
      initialValues,
      organization,
      isByoc,
      pristine,
      cloudProviderID,
      billingModel,
      product,
      isMultiAZ,
      shouldDisplayClusterName,
      clusterDisplayName,
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

    const className = isByoc ? 'edit-cluster-modal' : 'edit-cluster-modal edit-cluster-modal-rhinfra';
    const title = 'Edit load balancers and persistent storage';
    return (
      <Modal
        className={className}
        title={title}
        secondaryTitle={shouldDisplayClusterName ? clusterDisplayName : undefined}
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
                        billingModel={billingModel}
                        product={product}
                        isBYOC={isByoc}
                        isMultiAZ={isMultiAZ}
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
                        billingModel={billingModel}
                        product={product}
                        isBYOC={isByoc}
                        isMultiAZ={isMultiAZ}
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
  getLoadBalancers: PropTypes.func.isRequired,
  getPersistentStorage: PropTypes.func.isRequired,
  persistentStorageValues: PropTypes.object.isRequired,
  loadBalancerValues: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
  getOrganizationAndQuota: PropTypes.func.isRequired,
  isByoc: PropTypes.bool,
  cloudProviderID: PropTypes.string.isRequired,
  pristine: PropTypes.bool, // from redux-form
  billingModel: PropTypes.string.isRequired,
  product: PropTypes.string.isRequired,
  isMultiAZ: PropTypes.bool.isRequired,
  shouldDisplayClusterName: PropTypes.bool,
  clusterDisplayName: PropTypes.string,
};

ScaleClusterDialog.defaultProps = {
  editClusterResponse: {},
};

ScaleClusterDialog.modalName = modals.SCALE_CLUSTER;

export default ScaleClusterDialog;
