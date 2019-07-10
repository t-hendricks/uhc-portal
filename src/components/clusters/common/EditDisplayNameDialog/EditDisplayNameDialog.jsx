import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Form, Modal, Grid, Col, Row, FormControl, ControlLabel, FormGroup,
} from 'patternfly-react';
import ModalHeader from '../../../common/Modal/components/ModalHeader';
import ErrorBox from '../../../common/ErrorBox';


class EditDisplayNameDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validFor: null,
      currentValue: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    const { validFor } = this.state;
    if (nextProps.clusterID !== validFor) {
      this.setState((state, props) => ({
        validFor: nextProps.clusterID,
        currentValue: props.displayName,
      }));
    }
  }


  componentDidUpdate() {
    const {
      editClusterResponse, resetResponse, closeModal, onClose,
    } = this.props;
    if (editClusterResponse.fulfilled) {
      resetResponse();
      closeModal();
      onClose();
    }
  }

  setValue(event) {
    this.setState({
      currentValue: event.target.value,
    });
  }

  render() {
    const {
      isOpen, closeModal, submit, editClusterResponse, resetResponse, clusterID,
    } = this.props;
    const { currentValue } = this.state;

    const cancelEdit = () => {
      resetResponse();
      closeModal();
    };

    const hasError = editClusterResponse.error && (
      <ErrorBox message="Error changing display name" response={editClusterResponse} />
    );

    const handleSubmit = () => { submit(clusterID, currentValue); };

    return isOpen && (
    <Modal show onHide={cancelEdit}>
      <Modal.Header>
        <ModalHeader title="Edit Display Name" onClose={cancelEdit} />
      </Modal.Header>
      <Modal.Body>
        <Form horizontal onSubmit={(e) => { handleSubmit(); e.preventDefault(); }}>
          <Grid>
            <Row>
              <Col sm={5}>
                {hasError}
                <FormGroup>
                  <ControlLabel>
                    Display Name
                  </ControlLabel>
                  <FormControl
                    type="text"
                    value={currentValue}
                    placeholder="Enter display name"
                    onChange={e => this.setValue(e)}
                    autoFocus
                  />
                </FormGroup>
              </Col>
            </Row>
          </Grid>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button bsStyle="default" onClick={cancelEdit}>
            Cancel
        </Button>
        <Button bsStyle="primary" onClick={handleSubmit}>
            Edit
        </Button>
      </Modal.Footer>
    </Modal>
    );
  }
}

EditDisplayNameDialog.propTypes = {
  isOpen: PropTypes.bool,
  closeModal: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  resetResponse: PropTypes.func.isRequired,
  editClusterResponse: PropTypes.object,
  displayName: PropTypes.string,
  clusterID: PropTypes.string,
};

EditDisplayNameDialog.defaultProps = {
  isOpen: false,
  editClusterResponse: {},
};

export default EditDisplayNameDialog;
