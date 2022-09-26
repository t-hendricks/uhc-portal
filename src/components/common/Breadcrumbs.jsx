import React from 'react';
import PropTypes from 'prop-types';
import { LinkContainer } from 'react-router-bootstrap';
import { Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';
import getBaseName from '../../common/getBaseName';

function Breadcrumbs({ path }) {
  return (
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
}

Breadcrumbs.propTypes = {
  path: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string,
    }).isRequired,
  ).isRequired,
};

export default Breadcrumbs;
