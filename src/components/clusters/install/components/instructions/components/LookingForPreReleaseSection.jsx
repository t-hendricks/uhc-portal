import React from 'react';
import { Link } from 'react-router-dom';
import { CodeIcon } from '@patternfly/react-icons';

const LookingForPreReleaseSection = () => (
  <React.Fragment>
    <span className="pf-c-label pf-m-compact dev-preview-label">
      <CodeIcon />
      {' '}
      Developer Preview
    </span>
    {' '}
    <Link to="/install/pre-release">
     Download pre-release builds
    </Link>
  </React.Fragment>
);

export default LookingForPreReleaseSection;
