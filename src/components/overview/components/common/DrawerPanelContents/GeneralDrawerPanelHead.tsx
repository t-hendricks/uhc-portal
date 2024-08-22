import React from 'react';

import { Grid, GridItem, Text, TextVariants, Title } from '@patternfly/react-core';

import ExternalLink from '~/components/common/ExternalLink';

type GeneralDrawerPanelHeadProps = {
  title: string;
  logo: string;
  trialButtonLink?: string;
};

const GeneralDrawerPanelHead = ({ title, logo, trialButtonLink }: GeneralDrawerPanelHeadProps) => (
  <Grid hasGutter>
    <GridItem span={2}>
      <img
        src={logo}
        alt={`${title} logo`}
        className="drawer-panel-content__logo"
        data-testid={`${title}-drawer-panel-content__logo`}
      />
    </GridItem>
    <GridItem span={10}>
      <Title headingLevel="h2" data-testid="drawer-panel-content__title">
        {title}
      </Title>
      <Text component={TextVariants.small}>by Red Hat</Text>
    </GridItem>
    {trialButtonLink ? (
      <>
        <GridItem span={2} />
        <GridItem span={10}>
          <ExternalLink href={trialButtonLink} isButton variant="primary">
            Start free trial
          </ExternalLink>
        </GridItem>
      </>
    ) : null}
  </Grid>
);

export default GeneralDrawerPanelHead;
