import React from 'react';

import { Button } from '@patternfly/react-core';

import { trackEvents } from '~/common/analytics';
import useAnalytics from '~/hooks/useAnalytics';

import { tools } from '../../../../../common/installLinks.mjs';

const texts = {
  [tools.CRC]: 'Download OpenShift Local',
  [tools.OC]: 'Download command-line tools',
  [tools.X86INSTALLER]: 'Download installer',
  [tools.IBMZINSTALLER]: 'Download installer',
  [tools.PPCINSTALLER]: 'Download installer',
  [tools.ARMINSTALLER]: 'Download installer',
  [tools.MULTIINSTALLER]: 'Download installer',
  [tools.OCM]: 'Download ocm CLI',
  [tools.ROSA]: 'Download the ROSA CLI',
};

export type DownloadButtonProps = {
  url: string;
  disabled?: boolean;
  download?: boolean;
  tool?: (typeof tools)[keyof typeof tools];
  text?: string;
  name?: string;
  pendoID?: string;
};

const DownloadButton = ({
  url,
  disabled = false,
  download = true,
  tool = tools.X86INSTALLER,
  pendoID,
  text = '',
  name = '',
}: DownloadButtonProps) => {
  const track = useAnalytics();

  const handleClick = () => {
    if (name) {
      track(name, pendoID);
    } else if (trackEvents[tool]) {
      track(trackEvents[tool], {
        url,
        path: pendoID,
      });
    }
  };

  return (
    <Button
      component="a"
      href={url}
      variant="secondary"
      className={`download-button tool-${tool.toLowerCase()}`}
      onClick={handleClick}
      disabled={!url || disabled === true}
      data-testid={`download-btn-${tool}`}
      {...(download === true
        ? { download: true }
        : { rel: 'noreferrer noopener', target: '_blank' })}
    >
      {text || texts[tool]}
    </Button>
  );
};

export default DownloadButton;
