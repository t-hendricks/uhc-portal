import React from 'react';
import PropTypes from 'prop-types';
import semver from 'semver';

import getOCPReleaseChannel from '../../services/releaseChannelService';
import ExternalLink from '../common/ExternalLink';
import getReleaseNotesLink from './getReleaseNotesLink';

const ReleaseChannel = ({ channel }) => {
  const [latestVersion, setLatestVersion] = React.useState('');
  React.useEffect(() => {
    const fetchChannelData = async () => {
      const result = await getOCPReleaseChannel(channel);
      const sortedVersions = result?.data?.nodes?.sort(
        ({ version: left }, { version: right }) => semver.rcompare(left, right)
       );
      setLatestVersion(sortedVersions[0]?.version);
    };

    fetchChannelData();
  }, [channel]);
  const releaseNotesLink = getReleaseNotesLink(latestVersion);

  return (
    <>
      <dt className="pf-c-description-list__term pf-u-mt-md">
        {channel}
      </dt>
      {latestVersion && (
        <dd className="pf-c-description-list__description ocm-l-ocp-releases__channel-detail">
          Latest version
          {' '}
          {releaseNotesLink ? (
            <ExternalLink href={releaseNotesLink} noIcon>
              {latestVersion}
            </ExternalLink>
          ) : (
            latestVersion
          )}
        </dd>
      )}
    </>
  );
};

ReleaseChannel.propTypes = {
  channel: PropTypes.string.isRequired,
};

export default ReleaseChannel;
