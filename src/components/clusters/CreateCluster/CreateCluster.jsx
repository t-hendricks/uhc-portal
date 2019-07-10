import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardBody,
} from '@patternfly/react-core';
import openShiftDedicatedLogo from '../../../styles/images/Logo-Red_Hat-OpenShift_Dedicated-A-Standard-RGB.svg';
import openShiftContainerPlatformLogo from '../../../styles/images/Logo-Red_Hat-OpenShift-Container_Platform-A-Standard-RGB.svg';
import FavoriteButton from '../../common/FavoriteButton';
import CreateClusterModal from '../ClusterList/components/CreateClusterModal';
import PageTitle from '../install/components/instructions/components/PageTitle';


function CreateCluster({ openModal, hasQuota }) {
  const osdCard = (
    <Card component="a" onClick={() => openModal('create-cluster')} className="infra-card create-cluster-card">
      <div className="create-cluster-favorite-btn-container">
        <FavoriteButton isActive>Recommended</FavoriteButton>
      </div>
      <CardHeader className="create-cluster-header">
        <img src={openShiftDedicatedLogo} alt="OpenShift Dedicated" className="create-cluster-logo" />
      </CardHeader>
      <CardBody>
        Create a Red Hat-managed cluster (OSD),
        provisioned on Amazon Web Services.
      </CardBody>
    </Card>
  );

  const ocpCard = (
    <Link to="/install" className="infra-card pf-c-card create-cluster-card" target="_blank">
      <CardHeader className="create-cluster-header">
        <img src={openShiftContainerPlatformLogo} alt="OpenShift Container Platform" className="create-cluster-logo" />
      </CardHeader>
      <CardBody>
        Install an OCP cluster manually and manage it yourself.
        Once installation is complete, the cluster will be automatically
        registered to the Cluster Manager.
      </CardBody>
    </Link>
  );

  return (
    <React.Fragment>
      <Card>
        <div className="pf-c-content create-cluster-page">
          <PageTitle title="Create a Cluster to Get Started" />
          <div className="flex-container">
            {hasQuota && (<React.Fragment>{osdCard}</React.Fragment>)}
            {ocpCard}
          </div>
        </div>
      </Card>
      <CreateClusterModal />
    </React.Fragment>
  );
}

CreateCluster.propTypes = {
  openModal: PropTypes.func.isRequired,
  hasQuota: PropTypes.bool.isRequired,
};

export default CreateCluster;
