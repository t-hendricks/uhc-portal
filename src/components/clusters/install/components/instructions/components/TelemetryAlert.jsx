import React from 'react';
import {
  Alert,
} from '@patternfly/react-core';
import links from '../../../../../../common/installLinks';

const TelemetryAlert = () => {
  const title = (
    <React.Fragment>
      Red Hat collects a limited amount of telemetry data. By installing OpenShift Container
      Platform 4, you accept our data collection policy.
      {' '}
      <a href={links.TELEMETRY_INFORMATION} target="_blank">
        Learn more
        {' '}
        <span className="fa fa-external-link" aria-hidden="true" />
      </a>
      {' '}
      about the data we collect.
    </React.Fragment>
  );

  return (
    <Alert
      variant="warning"
      isInline
      title={title}
      className="telemetry-alert"
    />
  );
};

export default TelemetryAlert;
