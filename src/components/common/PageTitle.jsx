import React from 'react';
import PropTypes from 'prop-types';
import {
  Split,
  SplitItem,
} from '@patternfly/react-core';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';

const PageTitle = ({ title, breadcrumbs, children }) => (
  <PageHeader>
    {breadcrumbs && breadcrumbs}
    <Split>
      <SplitItem isFilled>
        <PageHeaderTitle className="ocm-page-title" title={title} />
      </SplitItem>
    </Split>
    {children && children}
  </PageHeader>
);
PageTitle.propTypes = {
  title: PropTypes.string.isRequired,
  breadcrumbs: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
};

export default PageTitle;
