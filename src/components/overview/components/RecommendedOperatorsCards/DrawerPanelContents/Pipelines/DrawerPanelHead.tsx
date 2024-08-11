import React from 'react';

import { Grid, GridItem, Text, TextVariants, Title } from '@patternfly/react-core';

import RedHatOpenShiftPipelinesLogo from '~/styles/images/RedHatOpenShiftPipelinesLogo.svg';

const TITLE = 'Red Hat OpenShift Pipelines';

const PipelinesDrawerPanelHead = (
  <Grid hasGutter>
    <GridItem span={2}>
      <img
        src={RedHatOpenShiftPipelinesLogo}
        alt={`${TITLE} logo`}
        className="drawer-panel-content__logo"
        data-testid={`${TITLE}-drawer-panel-content__logo`}
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

export default PipelinesDrawerPanelHead;
