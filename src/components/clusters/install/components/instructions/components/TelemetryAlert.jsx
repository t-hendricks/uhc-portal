import React from 'react';
import { Alert } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';

import links from '../../../../../../common/installLinks';

const TelemetryAlert = () => {
  const title = (
    <>
      Red Hat collects a limited amount of telemetry data. By installing OpenShift Container
      Platform 4, you accept our data collection policy.
      {' '}
      <a href={links.TELEMETRY_INFORMATION} rel="noreferrer noopener" target="_blank">
        Learn more
        {' '}
        <ExternalLinkAltIcon color="#0066cc" size="sm" />
      </a>
      {' '}
      about the data we collect.
    </>
  );

  return (
    <Alert
      variant="info"
      isInline
      title={title}
      className="telemetry-alert"
    />
  );
};

export default TelemetryAlert;
