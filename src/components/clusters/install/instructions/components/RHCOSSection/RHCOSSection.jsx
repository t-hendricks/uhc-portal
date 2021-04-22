import React from 'react';
import PropTypes from 'prop-types';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import {
  Split, SplitItem, Stack, StackItem, Text,
} from '@patternfly/react-core';
import instructionsMapping from '../../instructionsMapping';
import RHCOSDownloadAndSelect from './RHCOSDownloadAndSelect';
import DownloadButton, { downloadButtonModes } from '../DownloadButton';

const RHCOSSection = (props) => {
  const {
    learnMoreURL,
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
      /** Item may be an object {alternatives: [downloads]} corrsponds to a row of
       *  buttons where the user needs to select one of the options */
      if (!item.alternatives) {
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
        if (url && !archURL) {
          return (
            <StackItem key={name}>
              <DownloadButton
                token={token}
                url={url}
                mode={downloadButtonModes.RHCOS}
                text={buttonText}
                name={name}
                disabled={!token}
                pendoID={pendoID}
              />
            </StackItem>
          );
        }
      }
      const altsSplitItems = item.alternatives.map((alt, index) => {
        const { url, name, buttonText } = alt;
        return (
          <>
            <SplitItem key={name}>
              <DownloadButton
                token={token}
                url={url}
                mode={downloadButtonModes.RHCOS}
                text={buttonText}
                name={name}
                disabled={!token}
                pendoID={pendoID}
              />
            </SplitItem>
            {
                index !== item.alternatives.length - 1 && (
                  <SplitItem key={`alt-${name}`}>
                    or
                  </SplitItem>
                )
              }
          </>
        );
      });
      return (
        <Split hasGutter>
          {altsSplitItems}
        </Split>
      );
    });
    return (
      <Stack hasGutter>
        {buttons}
      </Stack>
    );
  };

  return (
    <>
      {learnMoreURL && (
      <Text component="p">
        Download RHCOS to create machines for your cluster to use during installation.
        { instructionsObj.rhcosAdditionalInstructions && (
          <>
            {' '}
            {instructionsObj.rhcosAdditionalInstructions}
          </>
        )}
        {' '}
        <Text component="a" href={learnMoreURL} rel="noreferrer noopener" target="_blank">
          Learn more
          {' '}
          <ExternalLinkAltIcon size="sm" />
          .
        </Text>
      </Text>
      )}
      {
        downloadButtons(instructionsObj.rhcosDownloads)
      }
    </>
  );
};

RHCOSSection.propTypes = {
  learnMoreURL: PropTypes.string,
  pendoID: PropTypes.string,
  token: PropTypes.object.isRequired,
  cloudProviderID: PropTypes.string.isRequired,
};

export default RHCOSSection;
