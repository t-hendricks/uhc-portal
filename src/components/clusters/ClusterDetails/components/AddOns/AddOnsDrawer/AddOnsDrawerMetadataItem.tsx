import React from 'react';

import './AddOnsDrawer.scss';
import { FlexItem } from '@patternfly/react-core';
import ExternalLink from '../../../../../common/ExternalLink';

interface AddOnsMetaDataItemProps {
  activeCardDocsLink?: string;
  installedAddOnOperatorVersion?: string;
  addonID: string;
  clusterID: string;
  externalClusterID: string;
  subscriptionPlanID: string;
}

const AddOnsMetaDataItem = (props: AddOnsMetaDataItemProps) => {
  const {
    activeCardDocsLink,
    installedAddOnOperatorVersion,
    addonID,
    clusterID,
    externalClusterID,
    subscriptionPlanID,
  } = props;

  const customTrackProperties = {
    current_path: '/openshift/details/s',
    tab_title: 'Add-ons',
    tab_id: 'addOnsTabContent',
    card_type: 'addon',
    addon_id: addonID,
    ocm_resource_type: subscriptionPlanID.toLowerCase(),
    resource_id: externalClusterID,
    ocm_cluster_id: clusterID,
  };

  return installedAddOnOperatorVersion || activeCardDocsLink ? (
    <FlexItem>
      {installedAddOnOperatorVersion && (
        <>
          <strong>Current Version</strong> {installedAddOnOperatorVersion}{' '}
        </>
      )}
      {activeCardDocsLink && (
        <ExternalLink href={activeCardDocsLink} customTrackProperties={customTrackProperties}>
          View Documentation
        </ExternalLink>
      )}
    </FlexItem>
  ) : null;
};

export default AddOnsMetaDataItem;
