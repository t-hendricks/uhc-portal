import React from 'react';
import PropTypes from 'prop-types';
import semver from 'semver';
import { Divider, LevelItem } from '@patternfly/react-core';

import getOCPReleaseChannel from '../../services/releaseChannelService';
import ExternalLink from '../common/ExternalLink';
import PopoverHint from '../common/PopoverHint';
import getCandidateChannelLink from './getCandidateChannelLink';
import getReleaseNotesLink from './getReleaseNotesLink';
import SupportStatus from '../common/SupportStatus';
import ReleaseChannelName from './ReleaseChannelName';
import ReleaseChannelDescription from './ReleaseChannelDescription';

const ReleaseChannel = ({ channel, status }) => {
  const [latestVersion, setLatestVersion] = React.useState('');
  React.useEffect(() => {
    const fetchChannelData = async () => {
      const result = await getOCPReleaseChannel(channel);
      const sortedVersions = result?.data?.nodes?.sort(({ version: left }, { version: right }) =>
        semver.rcompare(left, right),
      );
      setLatestVersion(sortedVersions[0]?.version);
    };

    fetchChannelData();
  }, [channel]);
  const isCandidate = channel.includes('candidate');
  const candidateChannelLink = getCandidateChannelLink(latestVersion);
  const parsed = latestVersion ? semver.coerce(latestVersion) : semver.coerce('4.7');
  const { major, minor } = parsed;
  const releaseNotesLink = getReleaseNotesLink(latestVersion);

  return (
    <>
      <ReleaseChannelName>
        {isCandidate && <Divider className="ocm-l-ocp-releases__divider pf-u-my-lg" />}
        {channel}
        {isCandidate && (
          <PopoverHint
            iconClassName="pf-u-ml-sm"
            hint={
              <>
                <p className="pf-u-mb-md">
                  {`Candidate channels contain candidate releases for a z-stream
                  (e.g., ${major}.${minor}.z). A candidate channel release contains
                  all the features of the product, but is not supported until the
                  release is promoted to the fast, stable, or eus channels.`}
                </p>
                {candidateChannelLink && (
                  <p>
                    <ExternalLink href={candidateChannelLink} noIcon>
                      Learn more about candidate channels
                    </ExternalLink>
                  </p>
                )}
              </>
            }
          />
        )}
      </ReleaseChannelName>
      <ReleaseChannelDescription>
        {latestVersion && (
          <LevelItem>
            Latest version{' '}
            {releaseNotesLink ? (
              <ExternalLink href={releaseNotesLink} noIcon>
                {latestVersion}
              </ExternalLink>
            ) : (
              latestVersion
            )}
          </LevelItem>
        )}
        {status && <SupportStatus status={status} />}
      </ReleaseChannelDescription>
    </>
  );
};

ReleaseChannel.propTypes = {
  channel: PropTypes.string.isRequired,
  status: PropTypes.string,
};

export default ReleaseChannel;
