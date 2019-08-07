import React from 'react';
import PropTypes from 'prop-types';

import { Spinner } from '@redhat-cloud-services/frontend-components';
import {
  Button,
  Icon,
  MessageDialog,
} from 'patternfly-react';
import ErrorBox from '../../../../common/ErrorBox';

import { noop } from '../../../../../common/helpers';

class DeleteIDPDialog extends React.Component {
  componentDidUpdate() {
    const { deletedIDPResponse } = this.props;
    if (deletedIDPResponse.fulfilled) {
      this.closeDialog(true);
    }
  }

  closeDialog(parentShouldRefresh) {
    const { clearDeleteIDPResponse, close, onClose } = this.props;

    clearDeleteIDPResponse(); // clear the response for the next time the dialog is shown.
    close(); // Close the dialog.
    onClose(parentShouldRefresh); // call the onClose event handler from the parent.
  }

  render() {
    const {
      isOpen,
      modalData,
      deleteIDP,
      deletedIDPResponse,
    } = this.props;

    const {
      clusterID,
      idpID,
    } = modalData;

    const errorContainer = deletedIDPResponse.error && (
      <ErrorBox message="Error removing Identiy Provider" response={deletedIDPResponse} />
    );

    const isPending = deletedIDPResponse.pending;

    const deleteBtn = (
      <Button id="deleteIDPBtn" bsStyle={!isPending ? 'danger' : 'default'} disabled={isPending} onClick={() => deleteIDP(clusterID, idpID)}>
        {!isPending ? 'Delete' : <div className="delete-idp-spinner-container"><Spinner /></div>}
      </Button>
    );

    const icon = <Icon type="pf" name="warning-triangle-o" />;

    const primaryContent = (
      <React.Fragment>
        {errorContainer}
        <p>
          You are going to remove the configured Identity Provider for this cluster.
          This action cannot be undone.
        </p>
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
        title="Remove Identity Provider"
        icon={icon}
        primaryContent={primaryContent}
        footer={footer}
      />
    );
  }
}

DeleteIDPDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  modalData: PropTypes.object,
  clearDeleteIDPResponse: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  deleteIDP: PropTypes.func.isRequired,
  deletedIDPResponse: PropTypes.object,
  onClose: PropTypes.func,
};

DeleteIDPDialog.defaultProps = {
  onClose: noop,
};

export default DeleteIDPDialog;
