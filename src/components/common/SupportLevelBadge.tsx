import React from 'react';
import { Popover, PopoverPosition, Label } from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';

import links from '../../common/installLinks.mjs';
import ExternalLink from './ExternalLink';

export enum SupportLevelType {
  devPreview = 'DEV_PREVIEW',
  cooperativeCommunity = 'COOPERATIVE_COMMUNITY',
}

type BadgeSupportData = {
  [key in SupportLevelType]: {
    title: string;
    link: string;
    text: string;
  };
};

const badgeLevels: BadgeSupportData = {
  [SupportLevelType.devPreview]: {
    title: 'Developer Preview',
    link: links.INSTALL_PRE_RELEASE_SUPPORT_KCS,
    text:
      'Developer preview features provide early access to upcoming product innovations, enabling\n' +
      'you to test functionality and provide feedback during the development process.',
  },
  [SupportLevelType.cooperativeCommunity]: {
    title: 'Cooperative Community',
    link: links.COOPERATIVE_COMMUNITY_SUPPORT_KCS,
    text:
      'Cooperative Community Support provides assistance to Red Hat customers that have questions\n' +
      'about community-provided software that is often used with our Red Hat products',
  },
};

const SupportLevelBadge = ({ type }: { type: SupportLevelType }) => {
  const badgeInfo = badgeLevels[type];
  const infoElem = (
    <>
      <div className="pf-u-mb-sm">{badgeInfo.text}</div>
      <ExternalLink href={badgeInfo.link}>Learn more</ExternalLink>
    </>
  );
  return (
    <Popover position={PopoverPosition.top} bodyContent={infoElem}>
      <Label
        style={{ cursor: 'pointer' }}
        color="orange"
        onClick={(event) => {
          event.preventDefault();
        }}
        icon={<InfoCircleIcon color="var(--pf-c-label__content--Color)" />}
        className="pf-u-ml-md pf-u-display-inline"
      >
        {badgeInfo.title}
      </Label>
    </Popover>
  );
};

export default SupportLevelBadge;
