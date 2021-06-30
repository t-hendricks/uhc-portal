/*
Copyright (c) 2019 Red Hat, Inc.

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

import size from 'lodash/size';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import Spinner from '@redhat-cloud-services/frontend-components/Spinner';
import { Link } from 'react-router-dom';

import {
  Card,
  Split,
  SplitItem,
  PageSection,
} from '@patternfly/react-core';

import ClusterListFilter from '../common/ClusterListFilter';
import ClusterListFilterDropDown from '../ClusterList/components/ClusterListFilterDropdown';
import ClusterListFilterChipGroup from '../ClusterList/components/ClusterListFilterChipGroup';
import ArchivedClusterListTable from './components/ArchiveClusterListTable/ArchivedClusterListTable';
import RefreshBtn from '../../common/RefreshButton/RefreshButton';
import ErrorTriangle from '../common/ErrorTriangle';
import GlobalErrorBox from '../common/GlobalErrorBox';
import Breadcrumbs from '../../common/Breadcrumbs';

import Unavailable from '../../common/Unavailable';
import ConnectedModal from '../../common/Modal/ConnectedModal';
import UnarchiveClusterDialog from '../common/UnarchiveClusterDialog';

import ViewPaginationRow from '../common/ViewPaginationRow/viewPaginationRow';
import { viewPropsChanged, createViewQueryObject } from '../../../common/queryHelpers';
import { viewConstants } from '../../../redux/constants';

class ArchivedClusterList extends Component {
  constructor(props) {
    super(props);

    // refresh needs to be bound because it is passed to another component
    this.refresh = this.refresh.bind(this);
  }

  componentDidMount() {
    document.title = 'Cluster Archives | Red Hat OpenShift Cluster Manager';
    const {
      getCloudProviders, cloudProviders, setListFlag, invalidateClusters,
    } = this.props;

    setListFlag('showArchived', true);
    invalidateClusters();

    if (!cloudProviders.fulfilled && !cloudProviders.pending) {
      getCloudProviders();
    }
  }

  componentDidUpdate(prevProps) {
    // Check for changes resulting in a fetch
    const {
      viewOptions, valid, pending,
    } = this.props;
    if ((!valid && !pending)
      || viewPropsChanged(viewOptions, prevProps.viewOptions)) {
      this.refresh();
    }
  }

  componentWillUnmount() {
    const { closeModal, invalidateClusters } = this.props;
    closeModal();
    invalidateClusters();
  }

  refresh() {
    const { fetchClusters, viewOptions } = this.props;
    fetchClusters(createViewQueryObject(viewOptions));
  }

  render() {
    const {
      error,
      errorCode,
      valid,
      pending,
      clusters,
      viewOptions,
      setSorting,
      openModal,
      invalidateClusters,
      errorMessage,
      operationID,
    } = this.props;

    const breadCrumbs = (
      <Breadcrumbs path={[
        { label: 'Clusters' },
        { label: 'Cluster Archives' },
      ]}
      />
    );

    const pageHeader = (
      <PageHeader>
        {breadCrumbs}
        <PageHeaderTitle title="Cluster Archives" />
      </PageHeader>
    );

    if (error && !size(clusters)) {
      return (
        <PageSection>
          <Unavailable
            message="Error retrieving cluster archives"
            response={{
              errorMessage,
              operationID,
              errorCode,
            }}
          />
        </PageSection>
      );
    }

    if ((!size(clusters) && pending && isEmpty(viewOptions.filter)) || !valid) {
      return (
        <>
          {pageHeader}
          <PageSection>
            <Card>
              <div className="cluster-list">
                <div className="cluster-loading-container">
                  <Spinner centered />
                </div>
              </div>
            </Card>
          </PageSection>
        </>
      );
    }

    return (
      <>
        {pageHeader}
        <PageSection>
          <Card>
            <div className="cluster-list">
              <GlobalErrorBox />
              <Split id="cluster-list-top">
                <SplitItem>
                  <ClusterListFilter view={viewConstants.ARCHIVED_CLUSTERS_VIEW} />
                </SplitItem>
                <SplitItem className="pf-l-split__item split-margin-left">
                  <ClusterListFilterDropDown
                    view={viewConstants.ARCHIVED_CLUSTERS_VIEW}
                    isDisabled={pending}
                  />
                </SplitItem>
                <SplitItem className="pf-l-split__item split-margin-left">
                  <div className="show-active-clusters-link">
                    <Link to="/">
                      Show active clusters
                    </Link>
                  </div>
                </SplitItem>
                <SplitItem className="spinner-fit-container">
                  { pending && <Spinner className="cluster-list-spinner" /> }
                  { error && <ErrorTriangle errorMessage={errorMessage} className="cluster-list-warning" /> }
                </SplitItem>
                <SplitItem isFilled />
                <SplitItem>
                  <ViewPaginationRow
                    viewType={viewConstants.ARCHIVED_CLUSTERS_VIEW}
                    currentPage={viewOptions.currentPage}
                    pageSize={viewOptions.pageSize}
                    totalCount={viewOptions.totalCount}
                    totalPages={viewOptions.totalPages}
                    variant="top"
                  />
                </SplitItem>
                <SplitItem>
                  <RefreshBtn autoRefresh refreshFunc={this.refresh} classOptions="cluster-list-top" />
                </SplitItem>
              </Split>
              <ClusterListFilterChipGroup view={viewConstants.ARCHIVED_CLUSTERS_VIEW} />
              <ArchivedClusterListTable
                clusters={clusters || []}
                viewOptions={viewOptions}
                setSorting={setSorting}
                openModal={openModal}
              />
              <ViewPaginationRow
                viewType={viewConstants.ARCHIVED_CLUSTERS_VIEW}
                currentPage={viewOptions.currentPage}
                pageSize={viewOptions.pageSize}
                totalCount={viewOptions.totalCount}
                totalPages={viewOptions.totalPages}
                variant="bottom"
              />
              <ConnectedModal
                ModalComponent={UnarchiveClusterDialog}
                onClose={invalidateClusters}
              />
            </div>
          </Card>
        </PageSection>
      </>
    );
  }
}

ArchivedClusterList.propTypes = {
  invalidateClusters: PropTypes.func.isRequired,
  fetchClusters: PropTypes.func.isRequired,
  valid: PropTypes.bool.isRequired,
  clusters: PropTypes.array.isRequired,
  error: PropTypes.bool.isRequired,
  errorCode: PropTypes.number,
  errorMessage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.element,
  ]).isRequired,
  pending: PropTypes.bool.isRequired,
  viewOptions: PropTypes.object.isRequired,
  setSorting: PropTypes.func.isRequired,
  getCloudProviders: PropTypes.func.isRequired,
  cloudProviders: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  setListFlag: PropTypes.func.isRequired,
  operationID: PropTypes.string,
};

export default ArchivedClusterList;
