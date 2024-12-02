import React from 'react';

import ExternalLink from '~/components/common/ExternalLink';

import docLinks from '../../../common/installLinks.mjs';
import OpenShiftProductIcon from '../../../styles/images/OpenShiftProductIcon.svg';

export interface BannerContentData {
  icon: React.JSX.Element;
  learnMoreLink: React.JSX.Element;
  title: string;
  text: string;
  iconCardBodyClassName: string;
}

export const osdBannerContents: BannerContentData = {
  icon: <img src={OpenShiftProductIcon} alt="OpenShift" />,
  learnMoreLink: (
    <ExternalLink href={docLinks.WHAT_IS_OSD}>Learn more about OpenShift Dedicated</ExternalLink>
  ),
  title: 'Red Hat OpenShift Dedicated',
  text: 'Automate the deployment and management of your clusters on our fully managed cloud service dedicated to you. Focus on the applications and business, not managing infrastructure.',
  iconCardBodyClassName: 'rosa-aws-redhat-vertical-logo',
};

export const rosaBannerContents: BannerContentData = {
  icon: <img src={OpenShiftProductIcon} alt="OpenShift" />,
  learnMoreLink: <ExternalLink href={docLinks.WHAT_IS_ROSA}>Learn more about ROSA</ExternalLink>,
  title: 'Red Hat OpenShift Service on AWS (ROSA)',
  text: 'Quickly build, deploy, and scale applications with our fully-managed turnkey application platform.',
  iconCardBodyClassName: 'rosa-aws-redhat-vertical-logo',
};
