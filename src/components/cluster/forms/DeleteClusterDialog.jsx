import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Button, Icon, Alert, FormControl, Spinner, MessageDialog,
} from 'patternfly-react';

import { clusterActions } from '../ClusterActions';
import { closeModal } from '../../Modal/ModalActions';
import shouldShowModal from '../../Modal/ModalSelectors';
import { noop } from '../../../common/helpers';

class DeleteClusterDialog extends React.Component {
  state = {
    clusterNameInput: '',
  }

  componentDidUpdate() {
    const { deleteClusterResponse } = this.props;
    if (deleteClusterResponse.fulfilled) {
      // Close the dialog and tell the parent they might want to refresh.
      this.closeDialog(true);
    }
  }

  setValue(event) {
    this.setState({
      clusterNameInput: event.target.value,
    });
  }

  closeDialog(parentShouldRefresh) {
    const { clearDeleteClusterResponse, close, onClose } = this.props;
    // reset the input, so it'll be empty next time the dialog is opened.
    this.setState({
      clusterNameInput: '',
    });
    clearDeleteClusterResponse(); // clear the response for the next time the dialog is shown.
    close(); // Close the dialog.
    onClose(parentShouldRefresh); // call the onClose event handler from the parent.
  }

  render() {
    const {
      isOpen, clusterID, clusterName, submit, deleteClusterResponse,
    } = this.props;

    const { clusterNameInput } = this.state;

    const errorContainer = deleteClusterResponse.error ? (
      <Alert>
        <span>{`Error deleting cluster: ${deleteClusterResponse.errorMessage}`}</span>
      </Alert>) : null;


    const isPending = deleteClusterResponse.pending;
    const isValid = clusterNameInput === clusterName;

    const deleteBtn = (
      <Button id="deleteClusterBtn" bsStyle={!isPending ? 'danger' : 'default'} disabled={!isValid || isPending} onClick={() => submit(clusterID)}>
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
    const secondaryContent = (
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
          onChange={e => this.setValue(e)}
          autoFocus
        />
      </React.Fragment>);

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
        secondaryContent={secondaryContent}
        footer={footer}
      />
    );
  }
}

DeleteClusterDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  clusterID: PropTypes.string.isRequired,
  clusterName: PropTypes.string.isRequired,
  clearDeleteClusterResponse: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  deleteClusterResponse: PropTypes.object,
  onClose: PropTypes.func,
};

DeleteClusterDialog.defaultProps = {
  onClose: noop,
};

const mapStateToProps = state => ({
  isOpen: shouldShowModal(state, 'delete-cluster'),
  clusterName: state.modal.activeModal.data.clusterName,
  clusterID: state.modal.activeModal.data.clusterID,
  deleteClusterResponse: state.cluster.deletedCluster,
});

const mapDispatchToProps = {
  clearDeleteClusterResponse: () => clusterActions.deletedClusterResponse(),
  submit: clusterID => clusterActions.deleteCluster(clusterID),
  close: () => closeModal('delete-cluster'),
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteClusterDialog);
