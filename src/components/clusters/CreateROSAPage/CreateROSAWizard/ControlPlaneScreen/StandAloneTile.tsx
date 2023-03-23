import React from 'react';
import { Tile, Text, TextVariants, List } from '@patternfly/react-core';
import { defaultMarginBottomSpacing, ListItem, hypershiftValue } from './ControlPlaneCommon';

type StandAloneTileProps = {
  handleChange: (string: hypershiftValue) => void;
  isSelected: boolean;
};

const StandAloneTile = ({ handleChange, isSelected }: StandAloneTileProps) => (
  <Tile
    title="Standalone"
    isDisplayLarge
    isStacked
    onClick={() => handleChange('false')}
    isSelected={isSelected}
    className="controlPlaneScreenTile"
    data-testid="standalone-control-planes"
  >
    <Text component={TextVariants.p} className={defaultMarginBottomSpacing}>
      Run an OpenShift cluster where the control plane and data plane are coupled. The control plane
      is hosted by a dedicated group of physical or virtual nodes and the network stack is shared.
    </Text>
    <List isPlain className={defaultMarginBottomSpacing}>
      <ListItem>Control plane resources are hosted in your own AWS account</ListItem>
      <ListItem>Full compliance certifications</ListItem>
      <ListItem>Red Hat SRE managed</ListItem>
    </List>
  </Tile>
);

export default StandAloneTile;
