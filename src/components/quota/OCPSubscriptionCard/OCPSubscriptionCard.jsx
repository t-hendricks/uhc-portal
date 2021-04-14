import React from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Button,
  List,
  ListItem,
  ListComponent,
  OrderType,
  Stack,
  StackItem,
} from '@patternfly/react-core';

function OCPSubscriptionCard() {
  return (
    <Card>
      <CardTitle>
        OpenShift Container Platform now uses Subscription Watch to
        manage subscriptions.
      </CardTitle>
      <CardBody>
        <Stack hasGutter>
          <StackItem>
            To get started, cluster owners or organization administrators should:
          </StackItem>
          <StackItem>
            <List component={ListComponent.ol} type={OrderType.number} className="osp-list">
              <ListItem>View a cluster in OpenShift Cluster Manager.</ListItem>
              <ListItem>
                Choose “Edit subscription settings” from either the actions menu in the upper right,
                or in the Subscriptions settings section of the Overview.
              </ListItem>
              <ListItem>
                Select the options that apply to your cluster in the dialog and save.
              </ListItem>
              <ListItem>
                Subscription Watch should handle the rest.
                There’s no more attaching subscriptions to clusters.
              </ListItem>
            </List>
          </StackItem>
          <StackItem>
            <Button component="a" href="https://cloud.redhat.com/subscriptions/openshift-sw" rel="noopener noreferrer" target="_blank">
              Open Subscription Watch
            </Button>
          </StackItem>
        </Stack>
      </CardBody>
    </Card>
  );
}

export default OCPSubscriptionCard;
