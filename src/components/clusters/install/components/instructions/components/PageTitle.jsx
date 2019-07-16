import React from 'react';
import PropTypes from 'prop-types';
import {
  Split,
  SplitItem,
} from '@patternfly/react-core';
import openshiftLogo from '../../../../../../styles/images/Logo-Red_Hat-OpenShift-A-Standard-RGB.svg';

const PageTitle = ({ title }) => (
  <Split>
    <SplitItem>
      <img src={openshiftLogo} alt="OpenShift" className="openshift-logo-install" />
    </SplitItem>
    <SplitItem isFilled>
      <h1 className="install-page-title">{title}</h1>
    </SplitItem>
  </Split>
);
PageTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

export default PageTitle;
