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
import { Route, Link } from 'react-router-dom'
import './App.css';
import * as fromClusterList from './ducks/clusterlist';
import * as fromUsers from './ducks/users';
import * as fromClusterDetails from './ducks/clusterdetails';
import { ClusterList } from './ClusterList';
import { CreateClusterModal } from './CreateClusterModal';
import { Pager, Label, Button } from 'patternfly-react'
import PropTypes from 'prop-types'
import "patternfly/dist/css/patternfly.css";
import "patternfly/dist/css/patternfly-additions.css";

class App extends Component {
  componentDidMount() {
    const { fetchClusters, clustersCurrentPage, userProfile } = this.props;
    fetchClusters(clustersCurrentPage);
    this.handleNext = this.handleNext.bind(this);
    this.handlePrevious = this.handlePrevious.bind(this);
  }
  handleNext() {
    const { fetchClusters, clustersCurrentPage } = this.props;
    fetchClusters(clustersCurrentPage + 1);
  }
  handlePrevious() {
    const { fetchClusters, clustersCurrentPage } = this.props;
    fetchClusters(clustersCurrentPage - 1);
  }
  render() {
    const {
      clustersPaged,
      clustersCurrentPage,
      clustersErrored,
      clustersLastPage,
      clustersRequested,
      userProfile,
      fetchClusterDetails,
      clusterDetails,
    } = this.props;
    let label;
    if (clustersRequested) label = <Label bsStyle="warning"> Requested </Label>;
    else if (clustersErrored) label = <Label bsStyle="danger"> Error fetching data </Label>
    else label = <Label bsStyle="success"> Updated </Label>

    let clusters = Object.values(clustersPaged)

    // Add fake data. I hope we can remove this soon...
    clusters = clusters.map(cluster => Object.assign({}, {
      clusterID: cluster.id,
      title: cluster.name,
      "properties": { "nodes": cluster.nodes.total },
      "expandedContentText":
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
      "compoundExpandText": {
        "nodes": "Text describing Item 1s nodes"
      }}))
    return (
      <div>
        {label}

        <ClusterList clusters={clusters} showClusterDetails={this.props.showClusterDetails}></ClusterList>
        <Pager
          messages={{nextPage: 'The Next Page', previousPage: 'The Previous Page'}}
          onNextPage={this.handleNext}
          onPreviousPage={this.handlePrevious}
          disableNext={clustersCurrentPage === clustersLastPage}
          disablePrevious={clustersCurrentPage === 0}
        />

        <div>
          <Link to="/clusters/create">
            <Button>Create cluster</Button>
          </Link>
          <Route path="/clusters/create" render={() => (
            <CreateClusterModal cancelTo="/clusters" createTo="/clusters"/>
          )}>
          </Route>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  fetchClusters: PropTypes.func.isRequired,
  fetchClusterDetails: PropTypes.func.isRequired,
  clustersPaged: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  })).isRequired,
  clustersCurrentPage: PropTypes.number.isRequired,
  clustersErrored: PropTypes.bool.isRequired,
  clustersLastPage: PropTypes.number.isRequired,
  clustersRequested: PropTypes.bool.isRequired,
  userProfile: PropTypes.object.isRequired,
  clusterDetails: PropTypes.object.isRequired,

};

const mapStateToProps = state => ({
  clustersCurrentPage: fromClusterList.getClustersCurrentPage(state),
  clustersErrored: fromClusterList.getClustersErrored(state),
  clustersLastPage: fromClusterList.getClustersLastPage(state),
  clustersPaged: fromClusterList.getClustersPaged(state),
  clustersRequested: fromClusterList.getClustersRequested(state),
  userProfile: fromUsers.getUserProfile(state),
  clusterDetails: fromClusterDetails.getClusterDetails(state)
});

const mapDispatchToProps = {
  fetchClusters: fromClusterList.fetchClusters,
  fetchClusterDetails: fromClusterDetails.fetchClusterDetails,
  showClusterDetails: fromClusterDetails.showClusterDetails
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
