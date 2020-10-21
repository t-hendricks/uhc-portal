import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import {
  Form, Alert, Grid, GridItem,
} from '@patternfly/react-core';

import Modal from '../../../../../../common/Modal/Modal';

import NodeCountInput from '../../../../../common/NodeCountInput';
import ErrorBox from '../../../../../../common/ErrorBox';

import { shouldRefetchQuota } from '../../../../../../../common/helpers';


class ScaleMachinePoolModal extends Component {
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

  componentDidUpdate() {
    const {
      scaleMachinePoolResponse,
      closeModal,
      getOrganizationAndQuota,
    } = this.props;

    if (scaleMachinePoolResponse.fulfilled
        && !scaleMachinePoolResponse.pending
        && !scaleMachinePoolResponse.error) {
      this.resetResponse();
      closeModal();
      getOrganizationAndQuota();
    }
  }

  resetResponse() {
    const {
      resetScaleDefaultMachinePoolResponse,
      resetScaleMachinePoolResponse,
      isDefaultMachinePool,
    } = this.props;
    if (isDefaultMachinePool) {
      resetScaleDefaultMachinePoolResponse();
    } else {
      resetScaleMachinePoolResponse();
    }
  }

  render() {
    const {
      closeModal,
      handleSubmit,
      scaleMachinePoolResponse,
      isMultiAz,
      masterResizeAlertThreshold,
      initialValues,
      organization,
      isByoc,
      machineType,
      pristine,
      cloudProviderID,
    } = this.props;

    const cancelEdit = () => {
      this.resetResponse();
      closeModal();
    };

    const error = scaleMachinePoolResponse.error ? (
      <ErrorBox message="Error editing machine pool" response={scaleMachinePoolResponse} />
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

    const pending = scaleMachinePoolResponse.pending || organization.pending;

    const className = isByoc ? 'edit-cluster-modal' : 'edit-cluster-modal edit-cluster-modal-rhinfra';

    return (
      <Modal
        className={className}
        title="Edit node count"
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

ScaleMachinePoolModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  resetScaleDefaultMachinePoolResponse: PropTypes.func.isRequired,
  resetScaleMachinePoolResponse: PropTypes.func.isRequired,
  scaleMachinePoolResponse: PropTypes.object,
  min: PropTypes.shape({
    value: PropTypes.number,
    validationMsg: PropTypes.string,
  }).isRequired,
  isMultiAz: PropTypes.bool,
  isDefaultMachinePool: PropTypes.bool,
  initialValues: PropTypes.shape({
    id: PropTypes.string,
    nodes_compute: PropTypes.number,
  }).isRequired,
  masterResizeAlertThreshold: PropTypes.number,
  organization: PropTypes.object.isRequired,
  getOrganizationAndQuota: PropTypes.func.isRequired,
  machineTypes: PropTypes.object.isRequired,
  getMachineTypes: PropTypes.func.isRequired,
  isByoc: PropTypes.bool,
  machineType: PropTypes.string,
  cloudProviderID: PropTypes.string.isRequired,
  pristine: PropTypes.bool, // from redux-form
};

ScaleMachinePoolModal.defaultProps = {
  scaleMachinePoolResponse: {},
};

export default ScaleMachinePoolModal;
