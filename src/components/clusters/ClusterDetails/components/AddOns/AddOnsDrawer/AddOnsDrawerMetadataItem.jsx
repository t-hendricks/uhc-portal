import React from 'react';
import PropTypes from 'prop-types';

import './AddOnsDrawer.scss';
import { FlexItem } from '@patternfly/react-core';
import ExternalLink from '../../../../../common/ExternalLink';

function AddOnsMetaDataItem(props) {
  const { activeCardDocsLink, installedAddOnOperatorVersion } = props;

  return installedAddOnOperatorVersion || activeCardDocsLink ? (
    <FlexItem>
      {installedAddOnOperatorVersion && (
        <>
          <b>Current Version </b> {installedAddOnOperatorVersion}{' '}
        </>
      )}
      {activeCardDocsLink && (
        <ExternalLink href={activeCardDocsLink}>View Documentation</ExternalLink>
      )}
    </FlexItem>
  ) : null;
}

AddOnsMetaDataItem.propTypes = {
  activeCardDocsLink: PropTypes.string,
  installedAddOnOperatorVersion: PropTypes.string,
};

export default AddOnsMetaDataItem;
