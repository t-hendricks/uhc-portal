import React from 'react';
import { useSelector } from 'react-redux';

import { Button } from '@patternfly/react-core';
import { DownloadIcon } from '@patternfly/react-icons';

import { urlsSelector, tools, channels } from '../../../../common/installLinks.mjs';
import { detectOS, architecturesForToolOS } from '../../../downloads/DownloadsPage/DownloadsPage';

function DownloadOcCliButton() {
  // Determine the latest stable release URL for the OC CLI.
  const githubReleases = useSelector(state => state.githubReleases);
  const urls = urlsSelector(githubReleases);
  const detectedOs = detectOS();
  const [{ value: detectedOsArchitecture }] = architecturesForToolOS(
    urls,
    tools.OC,
    channels.STABLE,
    detectedOs,
  );
  const href = urls[tools.OC][channels.STABLE][detectedOsArchitecture]?.[detectedOs];

  return (
    <Button component="a" href={href} variant="link" icon={<DownloadIcon />} isInline>
      Download OC CLI
    </Button>
  );
}

export default DownloadOcCliButton;
