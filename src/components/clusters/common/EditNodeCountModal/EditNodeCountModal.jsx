import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import {
  Form, Alert, Grid, GridItem,
} from '@patternfly/react-core';

import NodeCountInput from '../NodeCountInput';
import { ReduxFormDropdown } from '../../../common/ReduxFormComponents';


import Modal from '../../../common/Modal/Modal';
import ErrorBox from '../../../common/ErrorBox';
import { shouldRefetchQuota } from '../../../../common/helpers';

class EditNodeCountModal extends Component {
  componentDidMount() {
    const {
      organization,
      getOrganizationAndQuota,
      machineTypes,
      getMachineTypes,
    } = this.props;

    if (!machineTypes.fulfilled && !machineTypes.pending) {
      getMachineTypes();
    }
    if (shouldRefetchQuota(organization)) {
      getOrganizationAndQuota();
    }
  }

  componentDidUpdate(prevProps) {
    const {
      getOrganizationAndQuota,
      onClose,
      machinePoolsList,
      getMachinePools,
      clusterID,
      organization,
      editNodeCountResponse,
      isOpen,
    } = this.props;

    if (!prevProps.isOpen && isOpen && clusterID && !machinePoolsList.pending) {
      getMachinePools(clusterID);
    }

    if (!prevProps.isOpen && isOpen && clusterID && !organization.pending) {
      getOrganizationAndQuota();
    }

    if (editNodeCountResponse.fulfilled
        && !editNodeCountResponse.pending
        && !editNodeCountResponse.error) {
      this.cancelEdit();
      getOrganizationAndQuota();
      onClose();
    }
  }

  getSelectedMachinePoolNodes(machinePoolId) {
    const { machinePoolsList } = this.props;
    return machinePoolsList.data.find(machinePool => machinePool.name === machinePoolId)?.nodes;
  }


  handleMachinePoolChange = (_, value) => {
    const { change } = this.props;

    change('nodes_compute', this.getSelectedMachinePoolNodes(value));
  };

  cancelEdit = () => {
    const { closeModal, change } = this.props;
    this.resetResponse();

    closeModal();
    change('machine_pool', '');
    change('nodes_compute', '');
  };

  resetResponse() {
    const {
      resetScaleDefaultMachinePoolResponse,
      resetScaleMachinePoolResponse,
      machinePoolId,
      resetGetMachinePoolsResponse,
    } = this.props;

    if (machinePoolId === 'Default') {
      resetScaleDefaultMachinePoolResponse();
    } else {
      resetScaleMachinePoolResponse();
    }
    resetGetMachinePoolsResponse();
  }

  render() {
    const {
      isOpen,
      machinePoolsList,
      handleSubmit,
      isMultiAz,
      masterResizeAlertThreshold,
      initialValues,
      organization,
      isByoc,
      cloudProviderID,
      product,
      editNodeCountResponse,
      machineType,
      machinePoolId,
      pristine,
    } = this.props;

    const error = editNodeCountResponse.error ? (
      <ErrorBox message="Error editing machine pool" response={editNodeCountResponse} />
    ) : null;

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

    const pending = editNodeCountResponse.pending
     || organization.pending
     || machinePoolsList.pending;

    return isOpen && (
      <Modal
        className="edit-cluster-modal edit-cluster-modal-rhinfra"
        title="Edit node count"
        onClose={this.cancelEdit}
        primaryText="Apply"
        onPrimaryClick={handleSubmit}
        onSecondaryClick={this.cancelEdit}
        isPrimaryDisabled={pending || pristine}
        isPending={pending}
        isSmall
      >
        <>
          {error}
          <Form onSubmit={handleSubmit}>
            <Grid hasGutter>
              <GridItem span={8}>
                <Field
                  component={ReduxFormDropdown}
                  name="machine_pool"
                  label="Machine pool"
                  options={machinePoolsList.data}
                  onChange={this.handleMachinePoolChange}
                />
              </GridItem>
              <GridItem span={4} />
              <GridItem span={8}>
                <Field
                  component={NodeCountInput}
                  name="nodes_compute"
                  label={isMultiAz ? 'Node count per zone' : 'Node count'}
                  isMultiAz={isMultiAz}
                  isByoc={isByoc}
                  machineType={machineType}
                  isDisabled={pending}
                  isEditingCluster
                  currentNodeCount={initialValues.nodes_compute || 0}
                  cloudProviderID={cloudProviderID}
                  product={product}
                  minNodes={machinePoolId !== 'Default' ? 0 : undefined}
                  isMachinePool
                />
              </GridItem>
              <GridItem span={4} />
              {!!masterResizeAlertThreshold && resizingAlert(masterResizeAlertThreshold)}
            </Grid>
          </Form>
        </>
      </Modal>
    );
  }
}

EditNodeCountModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  resetScaleDefaultMachinePoolResponse: PropTypes.func.isRequired,
  resetScaleMachinePoolResponse: PropTypes.func.isRequired,
  resetGetMachinePoolsResponse: PropTypes.func.isRequired,
  editNodeCountResponse: PropTypes.object,
  isMultiAz: PropTypes.bool,
  initialValues: PropTypes.shape({
    id: PropTypes.string,
    nodes_compute: PropTypes.number,
  }).isRequired,
  masterResizeAlertThreshold: PropTypes.number,
  organization: PropTypes.object.isRequired,
  getOrganizationAndQuota: PropTypes.func.isRequired,
  machineTypes: PropTypes.object.isRequired,
  getMachineTypes: PropTypes.func.isRequired,
  getMachinePools: PropTypes.func.isRequired,
  machinePoolsList: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
  isByoc: PropTypes.bool,
  machinePoolId: PropTypes.string,
  machineType: PropTypes.string,
  clusterID: PropTypes.string,
  cloudProviderID: PropTypes.string.isRequired,
  // For quota purposes, product is subscription.plan.id, not cluster.product.id.
  product: PropTypes.string,
  pristine: PropTypes.bool,
};

EditNodeCountModal.defaultProps = {
  editNodeCountResponse: {},
};

export default EditNodeCountModal;
