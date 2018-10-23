import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Button, Icon, Form, Modal, Alert, Grid, Row, Col, FormGroup, ControlLabel, FormControl,
} from 'patternfly-react';
import { clusterActions } from '../../redux/actions/clusterActions';

class EditDisplayNameDialog extends React.Component {
  state = {
    currentValue: '',
  }

  updateCurrentValue(event) {
    this.setState({ currentValue: event.target.value });
  }

  render() {
    const {
      clusterID, clusterName, closeFunc, submit, editClusterDisplayNameResponse,
      clearDisplayNameResponse,
    } = this.props;

    const { currentValue } = this.state;

    if (editClusterDisplayNameResponse.fulfilled) {
      // FIXME This produces a warning because it causes a dispatch during a state transition
      clearDisplayNameResponse();
      closeFunc(true);
      return null;
    }

    let errorContainer = <div />;
    if (editClusterDisplayNameResponse.error) {
      errorContainer = (
        <Alert>
          <span>
            Error changing display name:
          </span>
          <span>
            {editClusterDisplayNameResponse.error}
          </span>
          <span>
            {editClusterDisplayNameResponse.errorMessage}
          </span>
        </Alert>
      );
    }
    return (
      <React.Fragment>
        <Modal.Header>
          <button type="button" className="close" aria-hidden="true" aria-label="Close" onClick={closeFunc}>
            <Icon type="pf" name="close" />
          </button>
          <Modal.Title>
            Edit Display Name
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorContainer}
          <Grid>
            <Form className="displayNameForm">
              <Row>
                <Col sm={6} className="name-label">
                  Cluster Name
                </Col>
              </Row>
              <Row>
                <Col sm={6} style={{ wordWrap: 'break-word' }}>
                  {clusterName}
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <FormGroup controlId="displayName">
                    <ControlLabel>
                      Display Name
                    </ControlLabel>
                    <FormControl
                      type="text"
                      value={currentValue}
                      placeholder="Enter a new name"
                      onChange={e => this.updateCurrentValue(e)}
                    />
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </Grid>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="default" onClick={closeFunc}>
            Cancel
          </Button>
          <Button bsStyle="primary" onClick={() => { submit(clusterID, currentValue.trim()); }}>
            Save
          </Button>
        </Modal.Footer>
      </React.Fragment>
    );
  }
}

EditDisplayNameDialog.propTypes = {
  clusterID: PropTypes.string.isRequired,
  clusterName: PropTypes.string.isRequired,
  clearDisplayNameResponse: PropTypes.func.isRequired,
  closeFunc: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  editClusterDisplayNameResponse: PropTypes.object,
};

const mapStateToProps = state => ({
  editClusterDisplayNameResponse: state.cluster.editedCluster,
});

const mapDispatchToProps = {
  clearDisplayNameResponse: () => clusterActions.clearDisplayNameResponse(),
  submit: (clusterID, displayName) => clusterActions.editClusterDisplayName(clusterID, displayName),
};

export default connect(mapStateToProps, mapDispatchToProps)(EditDisplayNameDialog);
