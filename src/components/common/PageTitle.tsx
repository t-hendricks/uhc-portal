import React from 'react';
import { Split, SplitItem } from '@patternfly/react-core';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';

type Props = {
  title: string;
  breadcrumbs?: React.ReactNode;
  children?: React.ReactNode;
};

const PageTitle = ({ title, breadcrumbs, children }: Props) => (
  <PageHeader>
    {breadcrumbs}
    <Split>
      <SplitItem isFilled>
        <PageHeaderTitle className="ocm-page-title" title={title} />
      </SplitItem>
    </Split>
    {children}
  </PageHeader>
);

export default PageTitle;
