import React from 'react';
import PropTypes from 'prop-types';

const ReleaseChannelName = ({ children }) => (
  <dt className="pf-c-description-list__term pf-u-mt-md">{children}</dt>
);

ReleaseChannelName.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ReleaseChannelName;
