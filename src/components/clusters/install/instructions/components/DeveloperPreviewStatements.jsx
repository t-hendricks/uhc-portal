import React from 'react';
import { Text, TextList, TextListItem } from '@patternfly/react-core';

import links from '../../../../../common/installLinks.mjs';
import ExternalLink from '../../../../common/ExternalLink';

const DeveloperPreviewStatements = () => (
  <>
    <Text component="p">
      Because these are{' '}
      <ExternalLink href={links.INSTALL_PRE_RELEASE_SUPPORT_KCS} noIcon>
        developer preview
      </ExternalLink>{' '}
      builds:
    </Text>
    <TextList>
      <TextListItem>Production use is not permitted.</TextListItem>
      <TextListItem>
        Installation and use is not eligible for Red Hat production support.
      </TextListItem>
      <TextListItem>
        Upgrades to, from, or between developer preview versions are not supported.
      </TextListItem>
    </TextList>
  </>
);

export default DeveloperPreviewStatements;
