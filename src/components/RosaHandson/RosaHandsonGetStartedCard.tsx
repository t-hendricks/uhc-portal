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
import RosaHandsonGetStartedToolbar, {
  RosaHandsonToolbarProps,
} from './RosaHandsonGetStartedToolbar';
import { DemoExperience, DemoExperienceStatusEnum } from './DemoExperienceModels';
import RosaHandsonIcon from './RosaHandsonIcons/RosaHandsonIcon';
import ExternalLink from '../common/ExternalLink';
import RosaHandsOnLinks from './RosaHandsOnLinks';

const CheckListItem = ({
  content,
  popoverContent,
  popoverHeader,
}: {
  content: React.ReactNode;
  popoverContent?: React.ReactNode;
  popoverHeader?: React.ReactNode;
}) => (
  <ListItem
    icon={<CheckIcon color={global_link_Color_dark.value} size="md" />}
    style={{ alignItems: 'baseline' }}
  >
    <Text>{content}</Text>
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

const PopoverBodyContent = ({ maxTrials }: { maxTrials: number }) => (
  <>
    You may launch a demo up to {maxTrials} times total. If you run out of attempts, have questions
    or need help, you can chat with the customer success team by clicking on the hat icon located at
    the bottom-right corner of the page. Alternatively, you can also join the{' '}
    <ExternalLink href={RosaHandsOnLinks.slackChannel}>ROSA community Slack channel</ExternalLink>
  </>
);

const DefaultCardText = ({
  maxTrials,
  maxDuration,
}: {
  maxTrials: number;
  maxDuration: number;
}) => (
  <List isPlain>
    <CheckListItem
      content={`Access to a free hands-on experience of ROSA for ${maxDuration} hours.`}
      popoverContent={<PopoverBodyContent maxTrials={maxTrials} />}
      popoverHeader="What to expect"
    />
    <CheckListItem
      content="One-click deployment of a ROSA cluster in a demo environment."
      popoverContent="Your time will not start until after the cluster is provisioned"
      popoverHeader="Getting started"
    />
    <CheckListItem
      content="A view into a fully managed turnkey application platform with integrated services and tools,
fully backed by a global team of site reliability engineers (SREs)."
    />
    <CheckListItem content="Step-by-step guided content on how to get started and build, deploy and scale an application on ROSA." />
  </List>
);

const StartedCardText = () => (
  <TextContent>
    <Text>
      Clicking the launch experience button below will provide a guided walkthrough of ROSA.
    </Text>
  </TextContent>
);

const CardText = ({ demoExperience }: { demoExperience: DemoExperience }) => (
  <>
    {demoExperience.status === DemoExperienceStatusEnum.Started ? (
      <StartedCardText />
    ) : (
      <DefaultCardText maxTrials={demoExperience.quota?.limit || 3} maxDuration={8} />
    )}
  </>
);

const CardContent = (props: RosaHandsonToolbarProps) => (
  <Stack hasGutter>
    <StackItem>
      <TextContent>
        <Text component="h3">Get started with OpenShift</Text>
      </TextContent>
    </StackItem>
    <StackItem isFilled>
      <CardText {...props} />
    </StackItem>
    <StackItem>
      <RosaHandsonGetStartedToolbar {...props} />
    </StackItem>
  </Stack>
);

const RosaHandsonGetStartedCard = (props: RosaHandsonToolbarProps) => (
  <Card>
    <CardBody>
      <Grid>
        <GridItem span={6}>
          <CardContent {...props} />
        </GridItem>
        <GridItem span={6} style={{ justifySelf: 'right' }}>
          <RosaHandsonIcon />
        </GridItem>
      </Grid>
    </CardBody>
  </Card>
);

export default RosaHandsonGetStartedCard;
