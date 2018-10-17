import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Icon, Modal, Grid, Row, Col,
} from 'patternfly-react';
import { Link } from 'react-router-dom';


function ClusterCreationSuccessMessage({ closeFunc, clusterID }) {
  return (
    <React.Fragment>
      <Modal.Header>
        <button type="button" className="close" aria-hidden="true" aria-label="Close" onClick={closeFunc}>
          <Icon type="pf" name="close" />
        </button>
        <Modal.Title>
            Cluster Creation
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Grid>
          <Row style={{ paddingTop: '15px', paddingBottom: '15px' }}>
            <Col xs={6} style={{ textAlign: 'center' }}>
              <Icon type="fa" name="check" size="5x" />
            </Col>
          </Row>
          <Row>
            <Col md={6} style={{ textAlign: 'center' }}>
                Creating your cluster…
            </Col>
          </Row>
        </Grid>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={closeFunc}>
          Close
        </Button>
        <Link to={`/cluster/${clusterID}`} style={{ marginRight: '15px' }}>
          <Button bsStyle="primary">
            Cluster Details
          </Button>
        </Link>
      </Modal.Footer>
    </React.Fragment>
  );
}

ClusterCreationSuccessMessage.propTypes = {
  closeFunc: PropTypes.func.isRequired,
  clusterID: PropTypes.string.isRequired,
};

export default ClusterCreationSuccessMessage;
