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
        It is now easier than ever before to understand your company&apos;s
        current status regarding subscription utilization.
        <ul className="ocp-list">
          <li>No more entitling individual clusters.</li>
          <li>Improved visibility of OpenShift Container Platform usage for self governance.</li>
          <li>Historical trending.</li>
          <li>Forthcoming subscription alerting capabilities.</li>
        </ul>
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
