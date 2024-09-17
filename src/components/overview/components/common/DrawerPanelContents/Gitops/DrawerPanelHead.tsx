import React from 'react';

import { Grid, GridItem, Text, TextVariants, Title } from '@patternfly/react-core';

import RedHatOpenShiftGitOpsLogo from '~/styles/images/RedHatOpenShiftGitOpsLogo.svg';

const TITLE = 'Red Hat OpenShift GitOps';

const GitopsDrawerPanelHead = (
  <Grid hasGutter>
    <GridItem span={2}>
      <img
        src={RedHatOpenShiftGitOpsLogo}
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

export default GitopsDrawerPanelHead;
