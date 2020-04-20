import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  List,
  ListItem,
  ListComponent,
  OrderType,
} from '@patternfly/react-core';


function OCPSubscriptionCard() {
  return (
    <Card>
      <CardHeader className="section-header">
        OpenShift Container Platform now uses Subscription Watch to
        manage subscriptions.
      </CardHeader>
      <CardBody className="section-text">
        To get started, cluster owners or organization administrators should:
        <List component={ListComponent.ol} type={OrderType.number} className="ocp-list">
          <ListItem>View a cluster in OpenShift Cluster Manager.</ListItem>
          <ListItem>
            Choose “Edit Subscription Settings” from either the actions menu in the upper right,
            or in the Subscriptions settings section of the Overview.
          </ListItem>
          <ListItem>Select the options that apply to your cluster in the dialog and save.</ListItem>
          <ListItem>
            Subscription Watch should handle the rest.
            There’s no more attaching subscriptions to clusters.
          </ListItem>
        </List>
      </CardBody>
      <CardBody className="section-text">
        <Button component="a" href="https://cloud.redhat.com/subscriptions/openshift-sw" rel="noopener noreferrer" target="_blank">
          Open Subscription Watch
        </Button>
      </CardBody>
      <CardBody />
    </Card>
  );
}

export default OCPSubscriptionCard;
