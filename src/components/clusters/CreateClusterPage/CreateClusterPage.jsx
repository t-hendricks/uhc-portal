import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardBody,
  PageSection,
  Tooltip,
} from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components';
import openShiftDedicatedLogo from '../../../styles/images/Logo-Red_Hat-OpenShift_Dedicated-A-Standard-RGB.svg';
import rhmiLogo from '../../../styles/images/Logo-Red_Hat-Managed_Integration-B-Standard-RGB.svg';
import openShiftContainerPlatformLogo from '../../../styles/images/Logo-Red_Hat-OpenShift-Container_Platform-A-Standard-RGB.svg';
import PageTitle from '../../common/PageTitle';
import Breadcrumbs from '../common/Breadcrumbs';
import { noQuotaTooltip, shouldRefetchQuota } from '../../../common/helpers';

class CreateCluster extends React.Component {
  componentDidMount() {
    // Try to get quota or organization when the component is first mounted.
    const { getOrganizationAndQuota, organization } = this.props;

    if (shouldRefetchQuota(organization)) {
      getOrganizationAndQuota();
    }
  }

  render() {
    const { hasOSDQuota, hasRHMIQuota, organization } = this.props;

    const title = (
      <PageTitle
        title="Create a cluster to get started"
        breadcrumbs={(
          <Breadcrumbs path={[
            { label: 'Clusters' },
            { label: 'Create' },
          ]}
          />
        )}
      />
    );

    const osdCardBody = (
      <>
        <CardHeader className="create-cluster-header">
          <img src={openShiftDedicatedLogo} alt="OpenShift Dedicated" className="create-cluster-logo" />
        </CardHeader>
        <CardBody>
          Create a Red Hat-managed cluster (OSD),
          provisioned on Amazon Web Services or Google Cloud Platform.
        </CardBody>
      </>
    );

    const osdCard = hasOSDQuota ? (
      <Link to="/create/osd" className="infra-card pf-c-card create-cluster-card">
        {osdCardBody}
      </Link>
    ) : (
      <Tooltip
        content={noQuotaTooltip}
      >
        <Card className="infra-card create-cluster-card card-disabled">
          {osdCardBody}
        </Card>
      </Tooltip>
    );

    const ocpCard = (
      <Link to="/install" className="infra-card pf-c-card create-cluster-card">
        <CardHeader className="create-cluster-header">
          <img src={openShiftContainerPlatformLogo} alt="OpenShift Container Platform" className="create-cluster-logo" />
        </CardHeader>
        <CardBody>
          Create an OCP cluster using the command-line installer.
          Your cluster will automatically register to
          the Cluster Manager after installation completes.
        </CardBody>
      </Link>
    );

    // Without quota, the RHMI card should be hidden
    const rhmiCard = hasRHMIQuota ? (
      <Link to="/create/rhmi" className="infra-card pf-c-card create-cluster-card">
        <CardHeader className="create-cluster-header">
          <img src={rhmiLogo} alt="Red Hat Managed Integration" className="create-cluster-logo" />
        </CardHeader>
        <CardBody>
          Create a Red Hat Managed Integration cluster,
          provisioned on Red Hat OpenShift Dedicated using Amazon Web Services.
        </CardBody>
      </Link>
    ) : null;

    const quotaRequestComplete = organization.fulfilled || organization.error;

    return quotaRequestComplete ? (
      <>
        {title}
        <PageSection>
          <Card>
            <div className="pf-c-content ocm-page ocp-osd-selection">
              <div className="flex-container">
                {ocpCard}
                {osdCard}
                {rhmiCard}
              </div>
            </div>
          </Card>
        </PageSection>
      </>
    ) : (
      <>
        {title}
        <PageSection>
          <Spinner centered />
        </PageSection>
      </>
    );
  }
}

CreateCluster.propTypes = {
  hasOSDQuota: PropTypes.bool.isRequired,
  hasRHMIQuota: PropTypes.bool.isRequired,
  organization: PropTypes.object.isRequired,
  getOrganizationAndQuota: PropTypes.func.isRequired,
};

export default CreateCluster;
