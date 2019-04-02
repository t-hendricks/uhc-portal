import React from 'react';
import PropTypes from 'prop-types';
import { BadgedResource } from '../../../common/BadgedResource';
import {
  kindAbbrs, kindStrings, getResourceBadgeColor, resourceTypes,
} from '../../../common/BadgedResource/ResourceTypes';

function ClusterBadge(props) {
  const { clusterName } = props;
  return (
    <BadgedResource
      resourceName={clusterName}
      kindStr={kindStrings.cluster}
      kindAbbr={kindAbbrs.cluster}
      badgeColor={getResourceBadgeColor(resourceTypes.CLUSTER)}
    />);
}

ClusterBadge.propTypes = {
  clusterName: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
};

export default ClusterBadge;
