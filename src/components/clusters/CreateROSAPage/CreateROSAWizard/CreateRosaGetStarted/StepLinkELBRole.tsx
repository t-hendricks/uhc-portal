import React from 'react';
import {
  Text,
  TextVariants,
  Title,
  ListComponent,
  OrderType,
  List,
  ListItem,
} from '@patternfly/react-core';

import InstructionCommand from '~/components/common/InstructionCommand';

const awsCommands = {
  getRole: 'aws iam get-role --role-name "AWSServiceRoleForElasticLoadBalancing"',
  createRole:
    'aws iam create-service-linked-role --aws-service-name "elasticloadbalancing.amazonaws.com"',
};

const StepLinkELBRole = () => (
  <>
    <Title headingLevel="h3">
      Create the service linked role for the Elastic Load Balancer (ELB)
    </Title>
    <Text component={TextVariants.p}>
      Your AWS account must have a service-linked role set up to allow ROSA to utilize ELB.
    </Text>
    <List component={ListComponent.ol} type={OrderType.number}>
      <ListItem className="pf-u-mb-lg">
        To check if the role exists for your account, run this command in your terminal:
        <br />
        <InstructionCommand
          textAriaLabel="Copyable AWS check for ELB account role"
          className="pf-u-mt-md"
        >
          {awsCommands.getRole}
        </InstructionCommand>
      </ListItem>
      <ListItem>
        If the role doesn&apos;t exist, create it by running the following command:
        <br />
        <InstructionCommand
          textAriaLabel="Copyable AWS create ELB account role"
          className="pf-u-mt-md"
        >
          {awsCommands.createRole}
        </InstructionCommand>
      </ListItem>
    </List>
  </>
);

export default StepLinkELBRole;
