import React from 'react';
import { Link } from 'react-router-dom-v5-compat';

import { Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';

export type BreadcrumbPath = { label: string; path?: string };

type Props = {
  path: BreadcrumbPath[];
};

const Breadcrumbs = ({ path }: Props) => (
  <Breadcrumb>
    {path.map((item, i) => {
      const itemLabel = item.label;

      if (i < path.length - 1) {
        let itemPath = item.path;
        if (itemLabel === 'Cluster List' && !itemPath) {
          itemPath = '/cluster-list';
        }

        return (
          <BreadcrumbItem
            key={itemLabel}
            render={({ className, ariaCurrent }) => (
              <Link
                to={`${itemPath || '/overview'}`}
                className={className}
                aria-current={ariaCurrent}
              >
                {itemLabel}
              </Link>
            )}
          />
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
