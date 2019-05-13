import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Alert,
  Button,
  ControlLabel,
  FormControl,
  FormGroup,
  Icon,
  MessageDialog,
  Spinner,
} from 'patternfly-react';

import { deleteClusterDialogActions } from './DeleteClusterDialogActions';
import { closeModal } from '../../../common/Modal/ModalActions';
import shouldShowModal from '../../../common/Modal/ModalSelectors';
import { noop } from '../../../../common/helpers';

class DeleteClusterDialog extends React.Component {
  state = {
    clusterNameInput: '',
    infraIdInput: '',
    awsKeyInput: '',
    awsSecretInput: '',
  }

  componentWillReceiveProps(props) {
    const { modalData } = props;
    const { infraIdInput } = this.state;

    if (modalData.infraID && !infraIdInput) {
      // Fill in the infraID input field if available
      this.setState({
        infraIdInput: modalData.infraID,
      });
    }
  }

  componentDidUpdate() {
    const { deleteClusterResponse } = this.props;
    if (deleteClusterResponse.fulfilled) {
      // Close the dialog and tell the parent they might want to refresh.
      this.closeDialog(true);
    }
  }

  setValue(field, event) {
    this.setState({
      [field]: event.target.value,
    });
  }

  closeDialog(parentShouldRefresh) {
    const { clearDeleteClusterResponse, close, onClose } = this.props;
    // reset the input, so it'll be empty next time the dialog is opened.
    this.setState({
      clusterNameInput: '',
      infraIdInput: '',
      awsKeyInput: '',
      awsSecretInput: '',
    });
    clearDeleteClusterResponse(); // clear the response for the next time the dialog is shown.
    close(); // Close the dialog.
    onClose(parentShouldRefresh); // call the onClose event handler from the parent.
  }

  render() {
    const {
      isOpen,
      modalData,
      deleteCluster,
      updateAndDeleteCluster,
      deleteClusterResponse,
    } = this.props;

    const {
      clusterID,
      clusterName,
      infraID,
      managed,
    } = modalData;

    const {
      clusterNameInput,
      infraIdInput,
      awsKeyInput,
      awsSecretInput,
    } = this.state;

    const errorContainer = deleteClusterResponse.error ? (
      <Alert>
        <span>{`Error deleting cluster: ${deleteClusterResponse.errorMessage}`}</span>
      </Alert>) : null;

    const isPending = deleteClusterResponse.pending;
    const isValid = managed
      ? clusterNameInput === clusterName
      : (infraIdInput && awsKeyInput && awsSecretInput);

    const doSubmit = () => {
      if (managed) {
        deleteCluster(clusterID);
      } else {
        updateAndDeleteCluster(clusterID, {
          infra_id: infraIdInput,
          aws: {
            access_key_id: awsKeyInput,
            secret_access_key: awsSecretInput,
          },
        });
      }
    };

    const deleteBtn = (
      <Button id="deleteClusterBtn" bsStyle={!isPending ? 'danger' : 'default'} disabled={!isValid || isPending} onClick={() => doSubmit(clusterID)}>
        {!isPending ? 'Delete' : <Spinner size="sm" inline loading />}
      </Button>
    );

    const icon = <Icon type="pf" name="warning-triangle-o" />;

    const primaryContent = (
      <React.Fragment>
        {errorContainer}
        <p>
          This action cannot be undone. It will uninstall the cluster, and all data will be deleted.
        </p>
      </React.Fragment>
    );

    const managedForm = (
      <React.Fragment>
        <p>
          Confirm deletion by typing
          {' '}
          <span style={{ fontWeight: 'bold' }}>{clusterName}</span>
          {' '}
          below:
        </p>
        <FormControl
          type="text"
          value={clusterNameInput}
          placeholder="Enter name"
          onChange={e => this.setValue('clusterNameInput', e)}
          disabled={isPending}
          autoFocus
        />
      </React.Fragment>
    );

    const selfManagedForm = (
      <React.Fragment>
        <p>
          Please enter all the necessary information to delete the
          {' '}
          <span style={{ fontWeight: 'bold' }}>{clusterName}</span>
          {' '}
          cluster:
        </p>
        <FormGroup>
          <ControlLabel htmlFor="infra-id">Infra ID</ControlLabel>
          <FormControl
            id="infra-id"
            type="text"
            value={infraIdInput}
            placeholder="Enter Infra ID"
            onChange={e => this.setValue('infraIdInput', e)}
            disabled={isPending || !!infraID}
            autoFocus={!infraID}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel htmlFor="aws-key">AWS access key ID</ControlLabel>
          <FormControl
            id="aws-key"
            type="password"
            value={awsKeyInput}
            placeholder="AWS access key ID"
            onChange={e => this.setValue('awsKeyInput', e)}
            disabled={isPending}
            autoFocus={!!infraID}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel htmlFor="aws-secret">AWS secret access key</ControlLabel>
          <FormControl
            id="aws-secret"
            type="password"
            value={awsSecretInput}
            placeholder="AWS secret access key"
            onChange={e => this.setValue('awsSecretInput', e)}
            disabled={isPending}
          />
        </FormGroup>
      </React.Fragment>
    );

    const footer = (
      <React.Fragment>
        <Button bsStyle="default" onClick={() => this.closeDialog(false)} disabled={isPending}>
          Cancel
        </Button>
        {deleteBtn}
      </React.Fragment>);

    return isOpen && (
      <MessageDialog
        show={isOpen}
        onHide={() => this.closeDialog(false)}
        primaryActionButtonBsStyle="danger"
        title="Delete Cluster"
        icon={icon}
        primaryContent={primaryContent}
        secondaryContent={managed ? managedForm : selfManagedForm}
        footer={footer}
      />
    );
  }
}

DeleteClusterDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  modalData: PropTypes.object,
  clearDeleteClusterResponse: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  deleteCluster: PropTypes.func.isRequired,
  updateAndDeleteCluster: PropTypes.func.isRequired,
  deleteClusterResponse: PropTypes.object,
  onClose: PropTypes.func,
};

DeleteClusterDialog.defaultProps = {
  onClose: noop,
};

const mapStateToProps = state => ({
  isOpen: shouldShowModal(state, 'delete-cluster'),
  modalData: state.modal.activeModal.data,
  deleteClusterResponse: state.deleteCluster.deletedCluster,
});

const mapDispatchToProps = {
  clearDeleteClusterResponse: () => deleteClusterDialogActions.deletedClusterResponse(),
  updateAndDeleteCluster: (clusterID, attrs) => deleteClusterDialogActions
    .updateAndDeleteCluster(clusterID, attrs),
  deleteCluster: clusterID => deleteClusterDialogActions.deleteCluster(clusterID),
  close: () => closeModal('delete-cluster'),
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteClusterDialog);
