import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
} from '@patternfly/react-core';
import Download from '@axetroy/react-download';
import isEmpty from 'lodash/isEmpty';

import useAnalytics from '~/hooks/useAnalytics';
import { trackEvents } from '~/common/analytics';

function DownloadPullSecret({ token, pendoID, text }) {
  const { track } = useAnalytics();
  const isDisabled = (!token || !!token.error || isEmpty(token));
  const tokenView = token.error ? '' : `${JSON.stringify(token)}\n`;

  const downloadButton = (
    <Button
      variant="secondary"
      isDisabled={isDisabled}
      onClick={() => {
        track(trackEvents.DownloadPullSecret, null, pendoID);
      }}
    >
      {text}
    </Button>
  );

  return isDisabled ? downloadButton : (
    <Download file="pull-secret" content={tokenView} style={{ display: 'inline' }}>
      {downloadButton}
    </Download>
  );
}
DownloadPullSecret.propTypes = {
  token: PropTypes.object.isRequired,
  pendoID: PropTypes.string,
  text: PropTypes.string,
};
DownloadPullSecret.defaultProps = {
  text: 'Download pull secret',
};

export default DownloadPullSecret;
