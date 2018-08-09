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
import { Route, Link } from 'react-router-dom';
import './ClustersPage.css';
import { PaginationRow, Label, Button } from 'patternfly-react';
import PropTypes from 'prop-types';
import * as fromClusterList from './ducks/clusterlist';
import { ClusterList } from './ClusterList';
import CreateClusterModal from './CreateClusterModal';
import 'patternfly/dist/css/patternfly.css';
import 'patternfly/dist/css/patternfly-additions.css';

class ClustersPage extends Component {
  componentDidMount() {
    const { fetchClusters } = this.props;
    fetchClusters(this.createQueryParams(this.props));
  }

  createQueryParams(oldParams, newParams) {
    return Object.assign({}, oldParams, newParams); // should exclude irrelevant values
  };

  render() {
    const {
      clustersPaged,
      clustersCurrentPage,
      clustersPageSize,
      clusterCount,
      clustersErrored,
      clustersLastPage,
      clustersRequested,
      fetchClusters,
    } = this.props;
    let label;
    if (clustersRequested) {
      label = (
        <Label bsStyle="warning">
          {' '}
Requested
          {' '}
        </Label>
      );
    } else if (clustersErrored) {
      label = (
        <Label bsStyle="danger">
          {' '}
Error fetching data
          {' '}
        </Label>
      );
    } else {
      label = (
        <Label bsStyle="success">
          {' '}
Updated
          {' '}
        </Label>
      );
    }

    let clusters = Object.values(clustersPaged);

    // Add fake data. I hope we can remove this soon...
    clusters = clusters.map(cluster => Object.assign({}, {
      clusterID: cluster.id,
      state: cluster.state,
      title: cluster.name,
      properties: { nodes: cluster.nodes.total },
      expandedContentText:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
      compoundExpandText: {
        nodes: 'Text describing Item 1s nodes',
      },
    }));

    const pageSelect = param => fetchClusters(this.createQueryParams(this.props, param));
    const onNextPage = () => pageSelect({ clustersCurrentPage: clustersCurrentPage + 1 });
    const onPreviousPage = () => pageSelect({ clustersCurrentPage: clustersCurrentPage - 1 });
    const onLastPage = () => pageSelect({ clustersCurrentPage: clustersLastPage });
    const onFirstPage = () => pageSelect({ clustersCurrentPage: 0 });
    const onPageSizeSelect = size => pageSelect({ clustersPageSize: size });

    return (
      <div>
        {label}

        <ClusterList clusters={clusters} />
        <PaginationRow
          viewType="list"
          pagination={{ page: clustersCurrentPage + 1, perPage: clustersPageSize, perPageOptions: [5, 10, 15, 25] }}
          itemCount={clusterCount}
          amountOfPages={clustersLastPage + 1}
          onPerPageSelect={onPageSizeSelect}
          onPreviousPage={onPreviousPage}
          onNextPage={onNextPage}
          itemsStart={clustersCurrentPage * clustersPageSize + 1}
          itemsEnd={Math.min((clustersCurrentPage + 1) * clustersPageSize, clusterCount)}
          onLastPage={onLastPage}
          onFirstPage={onFirstPage}
          pageInputValue={clustersCurrentPage + 1}
        />
        <br />
        <div>
          <Link to="/clusters/create">
            <Button>
              Create cluster
            </Button>
          </Link>
          <Route
            path="/clusters/create"
            render={() => (
              <CreateClusterModal cancelTo="/clusters" createTo="/clusters" />
            )}
          />
        </div>
      </div>
    );
  }
}

ClustersPage.propTypes = {
  fetchClusters: PropTypes.func.isRequired,
  clustersPaged: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  })).isRequired,
  clustersCurrentPage: PropTypes.number.isRequired,
  clustersPageSize: PropTypes.number.isRequired,
  clusterCount: PropTypes.number.isRequired,
  clustersErrored: PropTypes.bool.isRequired,
  clustersLastPage: PropTypes.number.isRequired,
  clustersRequested: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  clustersCurrentPage: fromClusterList.getClustersCurrentPage(state),
  clustersPageSize: fromClusterList.getClustersPageSize(state),
  clusterCount: fromClusterList.getClustersClusterCount(state),
  clustersErrored: fromClusterList.getClustersErrored(state),
  clustersLastPage: fromClusterList.getClustersLastPage(state),
  clustersPaged: fromClusterList.getClustersPaged(state),
  clustersRequested: fromClusterList.getClustersRequested(state),
});

const mapDispatchToProps = {
  fetchClusters: fromClusterList.fetchClusters,
};

export default connect(mapStateToProps, mapDispatchToProps)(ClustersPage);
