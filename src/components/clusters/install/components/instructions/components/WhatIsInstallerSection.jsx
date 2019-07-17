import React from 'react';
import PropTypes from 'prop-types';
import {
  Popover,
} from '@patternfly/react-core';

const WhatIsInstallerSection = ({ isIPI }) => (
  <React.Fragment>
    <Popover
      position="top"
      aria-label="What is the OpenShift installer?"
      bodyContent={(
        <div>
          The OpenShift Installer is a command-line installation wizard, prompting the user
          for values that it cannot determine on its own and providing reasonable defaults
          for everything else.
          { isIPI && (
            <React.Fragment>
              For more advanced users, the installer provides facilities
              for varying levels of customization.
              {' '}
              <a href="https://docs.openshift.com/container-platform/4.1/installing/installing_aws/installing-aws-customizations.html" target="_blank">
                Learn more
                {' '}
                <span className="fa fa-external-link" aria-hidden="true" />
              </a>
              .
            </React.Fragment>
          )}
        </div>
      )}
    >
      <button type="button" className="popover-hover buttonHref pf4-buttonHref">
        <span className="pficon pficon-info" />
        {' '}
        What is the OpenShift installer?
      </button>
    </Popover>
  </React.Fragment>
);
WhatIsInstallerSection.propTypes = {
  isIPI: PropTypes.bool.isRequired,
};

export default WhatIsInstallerSection;
