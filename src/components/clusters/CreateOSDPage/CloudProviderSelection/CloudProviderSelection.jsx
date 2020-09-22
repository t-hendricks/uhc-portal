import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import {
  Card,
  CardBody,
  PageSection,
  Title,
  Tooltip,
} from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components';
import Unavailable from '../../../common/Unavailable';
import CardBadge from '../../common/CardBadge';
import Breadcrumbs from '../../common/Breadcrumbs';
import PageTitle from '../../../common/PageTitle';
import { noQuotaTooltip, shouldRefetchQuota } from '../../../../common/helpers';
import AWSLogo from '../../../../styles/images/AWS.png';
import GCPLogo from '../../../../styles/images/google-cloud-logo.svg';

class CloudProviderSelection extends Component {
  componentDidMount() {
    document.title = 'Create an OpenShift Dedicated cluster | Red Hat OpenShift Cluster Manager | Choose your cloud provider';
    const { getOrganizationAndQuota, organization } = this.props;
    if (shouldRefetchQuota(organization)) {
      getOrganizationAndQuota();
    }
  }

  render() {
    const {
      hasOSDQuota, hasGcpQuota, hasAwsQuota, organization,
    } = this.props;

    if (!organization.pending && (organization.fulfilled || organization.error)) {
      if (!hasOSDQuota) {
        return (
          <Redirect to="/create" />
        );
      }
    }

    const breadcrumbs = (
      <Breadcrumbs path={[
        { label: 'Clusters' },
        { label: 'Create', path: '/create' },
        { label: 'OpenShift Dedicated' },
      ]}
      />
    );

    const gcpCardBody = (
      <CardBody>
        <img src={GCPLogo} alt="GCP" className="create-cluster-logo" />
        <Title headingLevel="h5" size="lg">Run on Google Cloud Platform</Title>
      </CardBody>
    );

    const gcpCard = hasGcpQuota ? (
      <Link to="/create/osd/gcp" className="aws-ipi-upi-infra-card infra-card pf-c-card">
        {gcpCardBody}
      </Link>
    ) : (
      <Tooltip content={noQuotaTooltip}>
        <Card className="infra-card aws-ipi-upi-infra-card create-cluster-card card-disabled">
          {gcpCardBody}
        </Card>
      </Tooltip>
    );

    const awsCardBody = (
      <CardBody>
        <img src={AWSLogo} alt="AWS" className="create-cluster-logo" />
        <Title headingLevel="h5" size="lg">Run on Amazon Web Services</Title>
      </CardBody>
    );

    const awsCard = hasAwsQuota ? (
      <Link to="/create/osd/aws" className="aws-ipi-upi-infra-card infra-card pf-c-card">
        <CardBadge isHidden />
        {awsCardBody}
      </Link>
    ) : (
      <Tooltip content={noQuotaTooltip}>
        <Card className="infra-card aws-ipi-upi-infra-card create-cluster-card card-disabled">
          {awsCardBody}
        </Card>
      </Tooltip>
    );

    const title = (<PageTitle title="Create an OpenShift Dedicated Cluster" breadcrumbs={breadcrumbs} />);

    if (organization.fulfilled) {
      return (
        <PageSection>
          <Card>
            <div className="pf-c-content ocm-page">
              <Title headingLevel="h3" size="2xl">
                Select an infrastructure provider
              </Title>
              <div className="flex-container">
                {awsCard}
                {gcpCard}
              </div>
            </div>
          </Card>
        </PageSection>
      );
    }

    if (organization.error) {
      return (
        <PageSection>
          <Unavailable
            message="Error retrieving quota"
            response={organization}
          />
        </PageSection>
      );
    }

    return (
      <>
        {title}
        <PageSection>
          <Spinner centered />
        </PageSection>
      </>
    );
  }
}

CloudProviderSelection.propTypes = {
  getOrganizationAndQuota: PropTypes.func.isRequired,
  organization: PropTypes.object.isRequired,
  hasGcpQuota: PropTypes.bool.isRequired,
  hasAwsQuota: PropTypes.bool.isRequired,
  hasOSDQuota: PropTypes.bool.isRequired,
};

export default CloudProviderSelection;
