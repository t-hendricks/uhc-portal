import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
} from '@patternfly/react-core';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome/useChrome';
import { tools } from '../../../../../common/installLinks.mjs';
import { getTrackEvent, trackEvents } from '~/common/analytics';

const texts = {
  [tools.CRC]: 'Download OpenShift Local',
  [tools.OC]: 'Download command-line tools',
  [tools.X86INSTALLER]: 'Download installer',
  [tools.IBMZINSTALLER]: 'Download installer',
  [tools.PPCINSTALLER]: 'Download installer',
  [tools.ARMINSTALLER]: 'Download installer',
  [tools.OCM]: 'Download ocm CLI',
  [tools.ROSA]: 'Download the ROSA CLI',
};

const DownloadButton = ({
  url,
  disabled = false,
  download = true,
  tool = tools.X86INSTALLER,
  pendoID,
  text = '',
  name = '',
}) => {
  const { analytics } = useChrome();
  const buttonText = text || texts[tool];
  const downloadProps = download ? (
    { download: true }
  ) : (
    { rel: 'noreferrer noopener', target: '_blank' }
  );

  return (
    <Button
      component="a"
      href={url}
      variant="secondary"
      className={`download-button tool-${tool.toLowerCase()}`}
      onClick={() => {
        const eventObj = getTrackEvent(trackEvents[tool], url, pendoID);
        analytics.track(name || eventObj.event, name ? pendoID : eventObj.properties);
      }}
      disabled={!url || disabled}
      {...downloadProps}
    >
      {buttonText}
    </Button>
  );
};
DownloadButton.propTypes = {
  pendoID: PropTypes.string,
  url: PropTypes.string,
  disabled: PropTypes.bool,
  download: PropTypes.bool,
  tool: PropTypes.oneOf(Object.values(tools)),
  text: PropTypes.string,
  name: PropTypes.string,
};

export default DownloadButton;
