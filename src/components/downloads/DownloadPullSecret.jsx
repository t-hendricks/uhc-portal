import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@patternfly/react-core';
import FileSaver from 'file-saver';
import isEmpty from 'lodash/isEmpty';

import useAnalytics from '~/hooks/useAnalytics';
import { trackEvents } from '~/common/analytics';

function DownloadPullSecret({ token, pendoID, text }) {
  const track = useAnalytics();
  const isDisabled = !token || !!token.error || isEmpty(token);
  const tokenView = token.error ? '' : `${JSON.stringify(token)}\n`;

  const downloadPullSecret = () => {
    track(trackEvents.DownloadPullSecret, { path: pendoID });
    const blob = new Blob([tokenView], { type: 'text/plain;charset=utf-8' });
    FileSaver.saveAs(blob, 'pull-secret');
  };

  return (
    <Button
      variant="secondary"
      onClick={downloadPullSecret}
      isDisabled={isDisabled}
      style={{ display: 'inline' }}
    >
      {text}
    </Button>
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
