import React from 'react';
import { Text } from '@patternfly/react-core';

import links from '../../../../../common/installLinks.mjs';

const TelemetryDisclaimer = () => (
  <Text component="small">
    Red Hat collects a limited amount of telemetry data. By installing OpenShift Container
    Platform 4, you accept our data collection policy.
    {' '}
    <Text component="a" href={links.TELEMETRY_INFORMATION} rel="noreferrer noopener" target="_blank">
      Learn more
    </Text>
    {' '}
    about the data we collect.
  </Text>
);

export default TelemetryDisclaimer;
