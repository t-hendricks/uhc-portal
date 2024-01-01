import { Button } from '@patternfly/react-core';
import FileSaver from 'file-saver';
import isEmpty from 'lodash/isEmpty';
import React from 'react';

import { trackEvents } from '~/common/analytics';
import useAnalytics from '~/hooks/useAnalytics';
import { AccessTokenCfg } from '~/types/accounts_mgmt.v1';
import { ErrorState } from '~/types/types';

export type DownloadPullSecretProps = {
  token: ErrorState | AccessTokenCfg;
  pendoID: string;
  text?: string;
};

const DownloadPullSecret = ({
  token,
  pendoID,
  text = 'Download pull secret',
}: DownloadPullSecretProps) => {
  const track = useAnalytics();
  const [isDisabled, setIsDisabled] = React.useState(true);
  const [tokenView, setTokenView] = React.useState('');

  React.useEffect(() => {
    setIsDisabled(!token || !!(token as ErrorState).error || isEmpty(token));
    setTokenView((token as ErrorState).error ? '' : `${JSON.stringify(token)}\n`);
  }, [token]);

  const downloadPullSecret = () => {
    track(trackEvents.DownloadPullSecret, { path: pendoID });
    const blob = new Blob([tokenView], { type: 'text/plain;charset=utf-8' });
    FileSaver.saveAs(blob, 'pull-secret');
  };

  return (
    <Button
      data-testid="download-pull-secret"
      variant="secondary"
      onClick={downloadPullSecret}
      isDisabled={isDisabled}
      style={{ display: 'inline' }}
    >
      {text}
    </Button>
  );
};

export default DownloadPullSecret;
