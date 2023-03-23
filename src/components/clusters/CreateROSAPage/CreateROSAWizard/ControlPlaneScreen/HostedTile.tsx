import React from 'react';
import { Tile, Text, TextVariants, List, Alert } from '@patternfly/react-core';
import ExternalLink from '~/components/common/ExternalLink';
import links from '~/common/installLinks.mjs';
import { defaultMarginBottomSpacing, ListItem, hypershiftValue } from './ControlPlaneCommon';

type HostedTileProps = {
  handleChange: (string: hypershiftValue) => void;
  isSelected: boolean;
};

const HostedTile = ({ handleChange, isSelected }: HostedTileProps) => (
  <Tile
    title="Hosted"
    isDisplayLarge
    isStacked
    onClick={() => handleChange('true')}
    isSelected={isSelected}
    className="controlPlaneScreenTile"
    data-testid="hosted-control-planes"
  >
    <Text component={TextVariants.p} className={defaultMarginBottomSpacing}>
      Run an OpenShift cluster where the control plane is decoupled from the data plane, and is
      treated like a multi-tenant workload on a hosted service cluster. The data plane is on a
      separate network domain that allows segmentation between management and workload traffic.
    </Text>
    <List isPlain className={defaultMarginBottomSpacing}>
      <ListItem>Control plane resources are hosted in a Red Hat-owned AWS account</ListItem>
      <ListItem>Better resource utilization with faster cluster creation</ListItem>
      <ListItem>Lower AWS infrastructure costs</ListItem>
      <ListItem>Red Hat SRE managed</ListItem>
    </List>
    <Alert
      variant="warning"
      isInline
      isPlain
      title="Compliance certifications available soon"
      className={defaultMarginBottomSpacing}
    />
    <Alert
      variant="warning"
      isInline
      isPlain
      title="Virtual Private Cloud is required"
      className={defaultMarginBottomSpacing}
    >
      <Text component={TextVariants.p}>
        To create a ROSA cluster that is hosted by Red Hat, you must be able to create clusters on a
        VPC.
      </Text>
      <Text component={TextVariants.p}>
        <ExternalLink href={links.VIRTUAL_PRIVATE_CLOUD_URL}>
          Learn more about Virtual Private Cloud
        </ExternalLink>
      </Text>
    </Alert>
  </Tile>
);

export default HostedTile;
