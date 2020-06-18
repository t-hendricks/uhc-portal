import React from 'react';

import links from '../../../../../common/installLinks';

const TelemetryDisclaimer = () => (
  <p className="small-text">
      Red Hat collects a limited amount of telemetry data. By installing OpenShift Container
      Platform 4, you accept our data collection policy.
    {' '}
    <a href={links.TELEMETRY_INFORMATION} rel="noreferrer noopener" target="_blank">
        Learn more
    </a>
    {' '}
      about the data we collect.
  </p>
);

export default TelemetryDisclaimer;
