/*
 Copyright (c) 2018 Red Hat, Inc.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
  http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. 
*/

import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import * as fromClusterDetails from './ducks/clusterdetails';
import { ListView, Button, Row, Col, Modal, Icon } from 'patternfly-react'

import PropTypes from 'prop-types'

class ClusterDetails extends Component {
  componentDidMount() {
    const { fetchClusterDetails, clusterID } = this.props;
    this.close = this.close.bind(this);
    if (clusterID !== null && clusterID !== undefined) {
      fetchClusterDetails(clusterID);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.clusterID !== prevProps.clusterID && this.props.clusterID !== null && this.props.clusterID !== undefined) {
      this.props.fetchClusterDetails(this.props.clusterID);
    }
  }

  close() {
    this.props.hideClusterDetails()
  }

  render() {
    if (this.props.clusterID===null || this.props.details[this.props.clusterID] === undefined) {
      return <div/>
    }
    var details = this.props.details[this.props.clusterID];
    return (
      <Modal show={this.props.show} onHide={this.close}>
      <Modal.Header>
        <button
          className="close"
          onClick={this.close}
          aria-hidden="true"
          aria-label="Close">
            <Icon type="pf" name="close" />
        </button>
        <Modal.Title>Cluster Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Name: {details.name}</p>
        <p>Memory: {details.memory.total}</p>
        <p>Nodes: {details.nodes.total}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button bsStyle="primary" onClick={this.close}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>);
  }
}

ClusterDetails.propTypes = {
  fetchClusterDetails: PropTypes.func.isRequired,
  details: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  details: fromClusterDetails.getClusterDetails(state),
  show: fromClusterDetails.showSelector(state),
  clusterID: fromClusterDetails.currentCluster(state)
});

const mapDispatchToProps = {
  fetchClusterDetails: fromClusterDetails.fetchClusterDetails,
  hideClusterDetails: fromClusterDetails.hideClusterDetails
};

export default connect(mapStateToProps, mapDispatchToProps)(ClusterDetails);