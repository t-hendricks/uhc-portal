import React from 'react';
import { Text, Title } from '@patternfly/react-core';

const LeadingInfo = ({ isRosa, SSOLogin }: { isRosa: boolean; SSOLogin: boolean }) => (
  <>
    <Text component="p">
      {`Red Hat OpenShift ${isRosa ? 'Service on AWS' : 'Cluster Manager'} is a managed service that makes it easy for you to use OpenShift ${isRosa ? 'on AWS' : ''} without needing to install, operate or upgrade your own OpenShift (Kubernetes) cluster.`}
    </Text>
    {!SSOLogin && (
      <>
        <Title headingLevel="h3">Your API token</Title>
        <Text component="p">
          Use this API token to authenticate against your Red Hat OpenShift Cluster Manager account.
        </Text>
      </>
    )}
  </>
);

export default LeadingInfo;
