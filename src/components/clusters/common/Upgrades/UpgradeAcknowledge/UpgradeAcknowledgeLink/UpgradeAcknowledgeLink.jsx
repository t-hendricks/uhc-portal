import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
// eslint-disable-next-line camelcase
import { global_warning_color_100 } from '@patternfly/react-tokens';
import './UpgradeAcknowledgeWarningLink.scss';

const UpgradeAcknowledgeLink = (props) => {
  const { clusterId, hasAcks } = props;

  return hasAcks ? (
    <Link
      to={`/details/${clusterId}#updateSettings`}
      className="ocm-upgrade-approval__required-link"
    >
      <ExclamationTriangleIcon color={global_warning_color_100.value} />
      <span className="pf-u-screen-reader">Warning</span> Approval required
    </Link>
  ) : null;
};

UpgradeAcknowledgeLink.propTypes = {
  clusterId: PropTypes.string,
  hasAcks: PropTypes.bool,
};

export default UpgradeAcknowledgeLink;
