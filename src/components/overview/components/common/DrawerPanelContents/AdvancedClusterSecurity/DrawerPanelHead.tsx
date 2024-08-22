import React from 'react';

import PRODUCT_CARD_LOGOS from '../../ProductCardLogos';
import GeneralDrawerPanelHead from '../GeneralDrawerPanelHead';

const AdvancedClusterSecurityDrawerPanelHead = (
  <GeneralDrawerPanelHead
    {...PRODUCT_CARD_LOGOS.advancedClusterSecurity}
    trialButtonLink="https://www.redhat.com/en/technologies/cloud-computing/openshift/advanced-cluster-security-kubernetes/trial"
  />
);

export default AdvancedClusterSecurityDrawerPanelHead;
