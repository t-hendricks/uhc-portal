import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
} from '@patternfly/react-core';

import DownloadPullSecret from '../../../../downloads/DownloadPullSecret';
import CopyPullSecret from '../../../../downloads/CopyPullSecret';

function PullSecretSection({ token, pendoID, text }) {
  return (
    <>
      <Text component="p">
        { text || 'Download or copy your pull secret. You\'ll be prompted for this information during installation.'}
      </Text>
      <div>
        <DownloadPullSecret token={token} pendoID={pendoID} />
        <CopyPullSecret token={token} variant="link-tooltip" pendoID={pendoID} />
      </div>
    </>
  );
}

PullSecretSection.propTypes = {
  token: PropTypes.object.isRequired,
  pendoID: PropTypes.string,
  text: PropTypes.string,
};

export default PullSecretSection;
