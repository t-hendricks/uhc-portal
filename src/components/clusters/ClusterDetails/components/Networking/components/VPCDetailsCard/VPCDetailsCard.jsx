import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardTitle,
  Title,
  CardBody,
  CardFooter,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Button,
} from '@patternfly/react-core';

import modals from '~/components/common/Modal/modals';
import EditClusterWideProxyDialog from '../EditClusterWideProxyDialog';

import './VPCDetailsCard.scss';

const VPCDetailsCard = (props) => {
  const {
    privateLink,
    httpProxyUrl,
    httpsProxyUrl,
    additionalTrustBundle,
    openModal,
    gcpVPCName,
  } = props;

  const isPrivateLinkInitialized = typeof privateLink !== 'undefined';

  const handleEditClusterProxy = () => {
    openModal(modals.EDIT_CLUSTER_WIDE_PROXY);
  };

  return (
    <Card className="ocm-c-networking-vpc-details__card">
      <CardTitle>
        <Title headingLevel="h2" className="card-title">Virtual Private Cloud (VPC)</Title>
      </CardTitle>
      <CardBody className="ocm-c-networking-vpc-details__card--body pf-l-stack pf-m-gutter">
        {gcpVPCName || isPrivateLinkInitialized ? (
          <>
            <Title headingLevel="h3" className="pf-l-stack__item">VPC Details</Title>
            <DescriptionList isHorizontal className="pf-l-stack__item pf-m-auto-column-widths details-card-dl">
              {gcpVPCName ? (
                <DescriptionListGroup>
                  <DescriptionListTerm>VPC name</DescriptionListTerm>
                  <DescriptionListDescription>{gcpVPCName}</DescriptionListDescription>
                </DescriptionListGroup>
              ) : null}
              {isPrivateLinkInitialized ? (
                <DescriptionListGroup>
                  <DescriptionListTerm>PrivateLink</DescriptionListTerm>
                  <DescriptionListDescription>{privateLink ? 'Enabled' : 'Disabled'}</DescriptionListDescription>
                </DescriptionListGroup>
              ) : null}
            </DescriptionList>
          </>
        ) : null}
        <Title headingLevel="h3" className="pf-l-stack__item --">Cluster-wide proxy</Title>
        <DescriptionList isHorizontal className="pf-l-stack__item details-card-dl">
          <DescriptionListGroup>
            <DescriptionListTerm>HTTP proxy URL</DescriptionListTerm>
            <DescriptionListDescription>{httpProxyUrl || 'N/A'}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>HTTPS proxy URL</DescriptionListTerm>
            <DescriptionListDescription>{httpsProxyUrl || 'N/A'}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Additional trust bundle</DescriptionListTerm>
            <DescriptionListDescription>
              {(additionalTrustBundle === 'REDACTED' ? 'Uploaded' : additionalTrustBundle) || 'N/A'}
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
        <EditClusterWideProxyDialog />
      </CardBody>
      <CardFooter>
        <Button
          variant="secondary"
          onClick={handleEditClusterProxy}
        >
          Edit cluster-wide proxy
        </Button>
      </CardFooter>
    </Card>
  );
};

VPCDetailsCard.propTypes = {
  openModal: PropTypes.func.isRequired,
  privateLink: PropTypes.bool,
  httpProxyUrl: PropTypes.string,
  httpsProxyUrl: PropTypes.string,
  additionalTrustBundle: PropTypes.string,
  gcpVPCName: PropTypes.string,
};

export default VPCDetailsCard;
