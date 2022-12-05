import React from 'react';
import {
  Alert,
  Button,
  ButtonVariant,
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Title,
  Text,
  TextVariants,
} from '@patternfly/react-core';
import { DesktopIcon } from '@patternfly/react-icons';
import { Link } from 'react-router-dom';

const WithWizard = () => (
  <Card>
    <CardTitle>
      <Title headingLevel="h3" size="lg">
        <DesktopIcon className="ocm-c-wizard-get-started--card-icon" />
        Deploy with web interface
      </Title>
    </CardTitle>
    <CardBody>
      <Text component={TextVariants.p} className="pf-u-mb-sm">
        You can deploy your cluster with the web interface.
      </Text>
      {/* TODO: PatternFly incorrectly puts the content of an alert as a h4 - this text should not be a heading */}
      <Alert
        variant="info"
        isInline
        isPlain
        title="Your AWS account will need to be associated with your Red Hat account."
      />
    </CardBody>
    <CardFooter>
      <Button
        variant={ButtonVariant.secondary}
        component={(props: any) => <Link {...props} to="wizard" />}
      >
        <DesktopIcon /> Create with web interface
      </Button>
    </CardFooter>
  </Card>
);

export default WithWizard;
