import React from 'react';
import PropTypes from 'prop-types';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import {
  Stack, StackItem, Text,
} from '@patternfly/react-core';
import { tools } from '../../../../../../common/installLinks';
import instructionsMapping from '../../instructionsMapping';
import RHCOSDownloadAndSelect from './RHCOSDownloadAndSelect';
import DownloadButton from '../DownloadButton';

const RHCOSSection = (props) => {
  const {
    token,
    cloudProviderID,
    pendoID,
  } = props;
  let instructionsObj = instructionsMapping[cloudProviderID];
  if (instructionsObj.upi) {
    instructionsObj = instructionsObj.upi;
  }
  const downloadButtons = (rhcosDownloads) => {
    // rhcosDownloads is an array where each item corresponds to a row of buttons
    const buttons = rhcosDownloads.map((item) => {
      const {
        url,
        archURL,
        buttonText,
        name,
      } = item;
      /** item may be an object with field archURL when there are multi-arch variants available
       * for it. It may also be an array of such objects, which corresponds to a row of buttons
       * controlled by the same architecture selector,  */
      if ((!url && archURL) || Array.isArray(item)) {
        const key = Array.isArray(item) ? item.map(i => i.name).join('|') : name;
        return (
          <RHCOSDownloadAndSelect
            key={key}
            rhcosDownloads={item}
            pendoID={pendoID}
            token={token}
          />
        );
      }
      return (
        <StackItem key={name}>
          <DownloadButton
            url={url}
            tool={tools.RHCOS}
            text={buttonText}
            name={name}
            disabled={!token}
            pendoID={pendoID}
          />
        </StackItem>
      );
    });
    return (
      <Stack hasGutter className="pf-u-mt-md">
        {buttons}
      </Stack>
    );
  };
  return (
    <>
      <Text component="p">
        Download RHCOS to create machines for your cluster to use during installation.
        {instructionsObj.rhcosAdditionalInstructions
          && typeof instructionsObj.rhcosAdditionalInstructions === 'string'
          && (
            <>
              {' '}
              {instructionsObj.rhcosAdditionalInstructions}
            </>
          )}
        {' '}
        {instructionsObj.rhcosLearnMoreURL && (
          <Text component="a" href={instructionsObj.rhcosLearnMoreURL} rel="noreferrer noopener" target="_blank">
            Learn more
            {' '}
            <ExternalLinkAltIcon size="sm" />
            .
          </Text>
        )}
      </Text>
      { instructionsObj.rhcosAdditionalInstructions
        && typeof instructionsObj.rhcosAdditionalInstructions !== 'string'
        && (
          <>
            {' '}
            {instructionsObj.rhcosAdditionalInstructions}
          </>
        )}
      {
        downloadButtons(instructionsObj.rhcosDownloads)
      }
    </>
  );
};

RHCOSSection.propTypes = {
  pendoID: PropTypes.string,
  token: PropTypes.object.isRequired,
  cloudProviderID: PropTypes.string.isRequired,
};

export default RHCOSSection;
