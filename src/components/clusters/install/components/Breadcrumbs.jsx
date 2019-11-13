import React from 'react';
import PropTypes from 'prop-types';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Breadcrumb, BreadcrumbItem,
} from '@patternfly/react-core';
import getBaseName from '../../../../common/getBaseName';

function Breadcrumbs({ path }) {
  return (
    <Breadcrumb>
      {path.map((item, i) => {
        if (i < path.length - 1) {
          return (
            <LinkContainer key={item.label} to={item.path || ''}>
              <BreadcrumbItem to={`${getBaseName()}${item.path}` || '#'}>
                {item.label}
              </BreadcrumbItem>
            </LinkContainer>
          );
        }
        return (
          <BreadcrumbItem key={item.label} isActive>
            {item.label}
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
