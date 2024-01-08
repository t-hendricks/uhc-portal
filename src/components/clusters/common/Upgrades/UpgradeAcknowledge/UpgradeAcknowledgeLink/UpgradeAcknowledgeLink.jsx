import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Icon } from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon';
// eslint-disable-next-line camelcase
import { global_warning_color_100 } from '@patternfly/react-tokens/dist/esm/global_warning_color_100';
import './UpgradeAcknowledgeWarningLink.scss';

const UpgradeAcknowledgeLink = (props) => {
  const { clusterId, hasAcks } = props;

  return hasAcks ? (
    <Link
      to={`/details/${clusterId}#updateSettings`}
      className="ocm-upgrade-approval__required-link"
    >
      <Icon>
        <ExclamationTriangleIcon color={global_warning_color_100.value} />
      </Icon>
      <span className="pf-v5-u-screen-reader">Warning</span> Approval required
    </Link>
  ) : null;
};

UpgradeAcknowledgeLink.propTypes = {
  clusterId: PropTypes.string,
  hasAcks: PropTypes.bool,
};

export default UpgradeAcknowledgeLink;
