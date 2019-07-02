import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Button,
  FormControl,
  Icon,
  MessageDialog,
  Spinner,
  Form,
} from 'patternfly-react';

import { deleteClusterDialogActions } from './DeleteClusterDialogActions';
import { closeModal } from '../../../common/Modal/ModalActions';
import shouldShowModal from '../../../common/Modal/ModalSelectors';
import ErroBox from '../../../common/ErrorBox';
import { noop } from '../../../../common/helpers';

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
      deleteClusterResponse,
    } = this.props;

    const {
      clusterID,
      clusterName,
    } = modalData;

    const {
      clusterNameInput,
    } = this.state;

    const errorContainer = deleteClusterResponse.error && (
      <ErroBox message="Error deleting cluster" response={deleteClusterResponse} />
    );

    const isPending = deleteClusterResponse.pending;
    const isValid = clusterNameInput === clusterName;

    const doSubmit = () => {
      deleteCluster(clusterID);
    };

    const submitForm = (e) => {
      e.preventDefault();
      if (isValid && !isPending) {
        doSubmit();
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
      <Form onSubmit={submitForm}>
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
      </Form>
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
        secondaryContent={managedForm}
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
  deleteCluster: clusterID => deleteClusterDialogActions.deleteCluster(clusterID),
  close: () => closeModal('delete-cluster'),
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteClusterDialog);
