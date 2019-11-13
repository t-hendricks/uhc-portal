import React from 'react';
import PropTypes from 'prop-types';
import {
  Split,
  SplitItem,
} from '@patternfly/react-core';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import openshiftLogo from '../../styles/images/Logo-Red_Hat-OpenShift-A-Standard-RGB.svg';

const PageTitle = ({ title, breadcrumbs }) => (
  <PageHeader>
    {breadcrumbs && breadcrumbs}
    <Split>
      <SplitItem>
        <img src={openshiftLogo} alt="OpenShift" className="openshift-logo-page-title" />
      </SplitItem>
      <SplitItem isFilled>
        <PageHeaderTitle className="ocm-page-title" title={title} />
      </SplitItem>
    </Split>
  </PageHeader>
);
PageTitle.propTypes = {
  title: PropTypes.string.isRequired,
  breadcrumbs: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
};

export default PageTitle;
