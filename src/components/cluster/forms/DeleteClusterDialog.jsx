import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Button, Icon, Form, Modal, Alert, FormGroup, ControlLabel, FormControl, HintBlock, Spinner,
} from 'patternfly-react';

import { clusterActions } from '../ClusterActions';

class DeleteClusterDialog extends React.Component {
  state = {
    clusterNameInput: '',
    isValid: false,
  }

  validateClusterName(event) {
    const { clusterName } = this.props;
    const currentValue = event.target.value;

    this.setState({
      clusterNameInput: currentValue,
      isValid: event.target.value === clusterName,
    });
  }

  render() {
    const {
      clusterID, clusterName, closeFunc, submit, deleteClusterResponse,
      clearDeleteClusterResponse,
    } = this.props;

    const { clusterNameInput, isValid } = this.state;

    if (deleteClusterResponse.fulfilled) {
      // FIXME This produces a warning because it causes a dispatch during a state transition
      clearDeleteClusterResponse();
      closeFunc(true);
      return null;
    }

    const errorContainer = deleteClusterResponse.error ? (
      <Alert>
        <span>{`Error deleting cluster: ${deleteClusterResponse.errorMessage}`}</span>
      </Alert>) : null;


    const isPending = deleteClusterResponse.pending;

    const deleteBtn = (
      <Button id="deleteClusterBtn" bsStyle={!isPending ? 'danger' : 'default'} disabled={!isValid || isPending} onClick={() => submit(clusterID)}>
        {!isPending ? 'Delete' : <Spinner size="sm" inline loading />}
      </Button>
    );

    return (
      <React.Fragment>
        <Modal.Header>
          <button type="button" className="close" aria-hidden="true" aria-label="Close" onClick={() => closeFunc(false)}>
            <Icon type="pf" name="close" />
          </button>
          <Modal.Title>
            Delete Cluster
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorContainer}
          <Form id="deleteCluster">
            <FormGroup>
              <ControlLabel>
                Confirm deletion of cluster
                {' '}
                <span>{`"${clusterName}"`}</span>
                {' '}
                by typing the cluster name:
              </ControlLabel>
              <FormControl
                type="text"
                value={clusterNameInput}
                placeholder="type cluster name to confirm"
                onChange={e => this.validateClusterName(e)}
              />
            </FormGroup>
          </Form>
          <HintBlock
            id="deleteClusterHint"
            title="Note!"
            body="The cluster will be uninstalled and all data will be deleted. This action cannot be undone."
          />
        </Modal.Body>
        <Modal.Footer>
          {deleteBtn}
          <Button bsStyle="default" onClick={() => closeFunc(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </React.Fragment>
    );
  }
}

DeleteClusterDialog.propTypes = {
  clusterID: PropTypes.string.isRequired,
  clusterName: PropTypes.string.isRequired,
  clearDeleteClusterResponse: PropTypes.func.isRequired,
  closeFunc: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  deleteClusterResponse: PropTypes.object,
};

const mapStateToProps = state => ({
  deleteClusterResponse: state.cluster.deletedCluster,
});

const mapDispatchToProps = {
  clearDeleteClusterResponse: () => clusterActions.deletedClusterResponse(),
  submit: clusterID => clusterActions.deleteCluster(clusterID),
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteClusterDialog);
