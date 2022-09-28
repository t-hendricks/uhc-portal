import React from 'react';
import PropTypes from 'prop-types';

import './AddOnsDrawer.scss';
import { FlexItem } from '@patternfly/react-core';
import ExternalLink from '../../../../../common/ExternalLink';

function AddOnsMetaDataItem(props) {
  const { activeCardDocsLink, installedAddOnOperatorVersion } = props;

  return (
    <FlexItem>
      {installedAddOnOperatorVersion ? (
        <>
          <b>Current Version </b> {installedAddOnOperatorVersion}{' '}
        </>
      ) : (
        ''
      )}
      {activeCardDocsLink ? (
        <ExternalLink href={activeCardDocsLink}>View Documentation</ExternalLink>
      ) : (
        ''
      )}
    </FlexItem>
  );
}

AddOnsMetaDataItem.propTypes = {
  activeCardDocsLink: PropTypes.string,
  installedAddOnOperatorVersion: PropTypes.string,
};

export default AddOnsMetaDataItem;
