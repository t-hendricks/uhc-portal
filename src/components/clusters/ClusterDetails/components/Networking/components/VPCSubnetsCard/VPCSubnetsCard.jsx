import React from 'react';
import PropTypes from 'prop-types';

import {
  Card,
  CardBody,
  CardTitle,
  List,
  ListItem,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
} from '@patternfly/react-core';

const subnetCount = (awsSubnetsLength, gcpNetwork) => (gcpNetwork ? 2 : awsSubnetsLength);

function VPCSubnetsCard({ awsSubnets, gcpNetwork }) {
  if (awsSubnets.length === 0 && !gcpNetwork) {
    return null;
  }

  return (
    <Card className="ocm-c-networking-network-configuration__card">
      <CardTitle>VPC subnets ({subnetCount(awsSubnets.length, gcpNetwork)})</CardTitle>
      <CardBody className="ocm-c-networking-network-configuration__card--body">
        {awsSubnets.length > 0 ? (
          <List isPlain>
            {awsSubnets.map((subnet) => (
              <ListItem>{subnet}</ListItem>
            ))}
          </List>
        ) : null}

        {gcpNetwork ? (
          <DescriptionList>
            <DescriptionListGroup>
              <DescriptionListTerm>Control plane subnet</DescriptionListTerm>
              <DescriptionListDescription>
                {gcpNetwork.control_plane_subnet}
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Compute subnet</DescriptionListTerm>
              <DescriptionListDescription>{gcpNetwork.compute_subnet}</DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        ) : null}
      </CardBody>
    </Card>
  );
}

VPCSubnetsCard.propTypes = {
  awsSubnets: PropTypes.arrayOf(PropTypes.string),
  gcpNetwork: PropTypes.shape({
    control_plane_subnet: PropTypes.string,
    compute_subnet: PropTypes.string,
  }),
};

VPCSubnetsCard.defaultProps = {
  awsSubnets: [],
};

export default VPCSubnetsCard;
