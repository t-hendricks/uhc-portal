import React from 'react';
import {
  Popover,
} from '@patternfly/react-core';

const LookingForPreReleaseSection = () => (
  <React.Fragment>
    <Popover
      position="top"
      aria-label="Looking for pre-release builds?"
      bodyContent={(
        <div>
          Nightly builds of the latest, pre-release version (4.2) of OpenShift are also
          <a href="https://mirror.openshift.com/pub/openshift-v4/clients/ocp-dev-preview/latest/" target="_blank">
            {' '}
            available for download
            {' '}
            <span className="fa fa-external-link" aria-hidden="true" />
          </a>
          .

          This includes the OpenShift Installer and Command-Line Tools.
          <p />
          For pre-release documentation, please refer to the
          <a href="https://github.com/openshift/installer/tree/master/docs/user" target="_blank">
            {' '}
            latest installer documentation
            {' '}
            <span className="fa fa-external-link" aria-hidden="true" />
          </a>
          .
        </div>
      )}
    >
      <button type="button" className="popover-hover buttonHref">
        <span className="pficon pficon-info" />
        {' '}
        Looking for pre-release builds?
      </button>
    </Popover>
  </React.Fragment>
);

export default LookingForPreReleaseSection;
