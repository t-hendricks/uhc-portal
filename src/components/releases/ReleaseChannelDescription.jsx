import React from 'react';
import PropTypes from 'prop-types';
import { Level } from '@patternfly/react-core';

const ReleaseChannelDescription = ({ children }) => (
  <dd className="pf-c-description-list__description ocm-l-ocp-releases__channel-detail">
    <Level className="ocm-l-ocp-releases__channel-detail-level">{children}</Level>
  </dd>
);

ReleaseChannelDescription.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ReleaseChannelDescription;
