import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
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
        <ol className="ocp-list">
          <li>View a cluster in OpenShift Cluster Manager.</li>
          <li>
            Choose “Edit Subscription Settings” from either the actions menu in the upper right,
            or in the Subscriptions settings section of the Overview.
          </li>
          <li>Select the options that apply to your cluster in the dialog and save.</li>
          <li>
            Subscription Watch should handle the rest.
            There’s no more attaching subscriptions to clusters.
          </li>
        </ol>
      </CardBody>
      <CardBody className="section-text">
        <Button component="a" href="https://cloud.redhat.com/beta/subscriptions/openshift-sw" rel="noopener noreferrer" target="_blank">
          Open Subscription Watch
        </Button>
      </CardBody>
      <CardBody />
    </Card>
  );
}

export default OCPSubscriptionCard;
