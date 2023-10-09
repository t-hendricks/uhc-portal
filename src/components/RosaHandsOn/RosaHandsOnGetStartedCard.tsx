import React from 'react';
import {
  List,
  ListItem,
  Text,
  TextContent,
  Card,
  CardBody,
  Popover,
  Stack,
  StackItem,
  Grid,
  GridItem,
  Button,
} from '@patternfly/react-core';
import { CheckIcon, HelpIcon } from '@patternfly/react-icons';
// eslint-disable-next-line camelcase
import { global_link_Color_dark } from '@patternfly/react-tokens';
import RosaHandsOnGetStartedToolbar, {
  RosaHandsOnToolbarProps,
} from './RosaHandsOnGetStartedToolbar';
import { DemoExperienceStatusEnum } from './DemoExperienceModels';
import RosaHandsOnIcon from './RosaHandsOnIcons/RosaHandsOnIcon';
import ExternalLink from '../common/ExternalLink';
import { MAX_DURATION, rosaHandsOnLinks } from './constants';

const CheckListItem = ({
  children,
  popoverContent,
  popoverHeader,
}: {
  children: React.ReactNode;
  popoverContent?: React.ReactNode;
  popoverHeader?: React.ReactNode;
}) => (
  <ListItem
    icon={<CheckIcon color={global_link_Color_dark.value} size="md" />}
    style={{ alignItems: 'baseline' }}
  >
    <Text>{children}</Text>
    {popoverContent && (
      <>
        &nbsp;
        <Popover bodyContent={popoverContent} headerContent={popoverHeader} maxWidth="40rem">
          <Button icon={<HelpIcon />} variant="link" isInline />
        </Popover>
      </>
    )}
  </ListItem>
);

const RosaHandsOnGetStartedCard = ({
  demoExperience,
  onRequestCluster,
}: RosaHandsOnToolbarProps) => (
  <Card>
    <CardBody>
      <Grid>
        <GridItem span={6}>
          <Stack hasGutter>
            <StackItem>
              <TextContent>
                <Text component="h3">Get started with OpenShift</Text>
              </TextContent>
            </StackItem>
            <StackItem isFilled>
              {demoExperience.status === DemoExperienceStatusEnum.Started ? (
                <>
                  Clicking the launch experience button below will provide a guided walkthrough of
                  ROSA.
                </>
              ) : (
                <List isPlain>
                  <CheckListItem
                    popoverContent={
                      <>
                        You may launch a demo up to {demoExperience.quota.limit} times total. If you
                        run out of attempts, have questions or need help, you can chat with the
                        customer success team by clicking on the hat icon located at the
                        bottom-right corner of the page. Alternatively, you can also join the{' '}
                        <ExternalLink href={rosaHandsOnLinks.slackChannel}>
                          ROSA community Slack channel
                        </ExternalLink>
                      </>
                    }
                    popoverHeader="What to expect"
                  >
                    Access to a free hands-on experience of ROSA for {MAX_DURATION} hours.
                  </CheckListItem>
                  <CheckListItem
                    popoverContent="Your time will not start until after the cluster is provisioned"
                    popoverHeader="Getting started"
                  >
                    One-click deployment of a ROSA cluster in a demo environment.
                  </CheckListItem>
                  <CheckListItem>
                    A view into a fully managed turnkey application platform with integrated
                    services and tools, fully backed by a global team of site reliability engineers
                    (SREs).
                  </CheckListItem>
                  <CheckListItem>
                    Step-by-step guided content on how to get started and build, deploy and scale an
                    application on ROSA.
                  </CheckListItem>
                </List>
              )}
            </StackItem>
            <StackItem>
              <RosaHandsOnGetStartedToolbar
                demoExperience={demoExperience}
                onRequestCluster={onRequestCluster}
              />
            </StackItem>
          </Stack>
        </GridItem>
        <GridItem span={6} style={{ justifySelf: 'right' }}>
          <RosaHandsOnIcon />
        </GridItem>
      </Grid>
    </CardBody>
  </Card>
);

export default RosaHandsOnGetStartedCard;
