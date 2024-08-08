import React from 'react';

import { Grid, GridItem, Text, TextVariants, Title } from '@patternfly/react-core';

import RedHatOpenShiftServiceMeshLogo from '~/styles/images/RedHatOpenShiftServiceMeshLogo.svg';

const TITLE = 'Red Hat OpenShift Service Mesh';

const ServiceMeshDrawerPanelHead = (
  <Grid hasGutter>
    <GridItem span={2}>
      <img
        src={RedHatOpenShiftServiceMeshLogo}
        alt={`${TITLE} logo`}
        className="drawer-panel-content__logo"
      />
    </GridItem>
    <GridItem span={10}>
      <Title headingLevel="h2" data-testid="drawer-panel-content__title">
        {TITLE}
      </Title>
      <Text component={TextVariants.small}>by Red Hat</Text>
    </GridItem>
  </Grid>
);

export default ServiceMeshDrawerPanelHead;
