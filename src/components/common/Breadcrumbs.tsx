import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';
import getBaseName from '../../common/getBaseName';

type Props = {
  path: { label: string; path?: string }[];
};

const Breadcrumbs = ({ path }: Props) => (
  <Breadcrumb>
    {path.map((item, i) => {
      const itemLabel = item.label;

      if (i < path.length - 1) {
        const itemPath = item.path;

        return (
          <LinkContainer key={itemLabel} to={itemPath || ''}>
            <BreadcrumbItem to={`${getBaseName()}${itemPath || ''}` || '#'}>
              {itemLabel}
            </BreadcrumbItem>
          </LinkContainer>
        );
      }
      return (
        <BreadcrumbItem key={itemLabel} isActive>
          {itemLabel}
        </BreadcrumbItem>
      );
    })}
  </Breadcrumb>
);

export default Breadcrumbs;
