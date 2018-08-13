import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Icon, Modal, Grid, Row, Col,
} from 'patternfly-react';
import { Link } from 'react-router-dom';


function ClusterCreationSuccessModal({ closeTo, clusterID }) {
  return (
    <Modal show style={{ padding: '15px' }}>
      <Modal.Header>
        <Link to={closeTo}>
          <button type="button" className="close" aria-hidden="true" aria-label="Close">
            <Icon type="pf" name="close" />
          </button>
        </Link>
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
        <Link to={closeTo}>
          <Button>
            Close
          </Button>
        </Link>
        <Link to={`/cluster/${clusterID}`} style={{ marginRight: '15px' }}>
          <Button bsStyle="primary">
            Cluster Details
          </Button>
        </Link>
      </Modal.Footer>
    </Modal>
  );
}

ClusterCreationSuccessModal.propTypes = {
  closeTo: PropTypes.string.isRequired,
  clusterID: PropTypes.string.isRequired,
};

export default ClusterCreationSuccessModal;
