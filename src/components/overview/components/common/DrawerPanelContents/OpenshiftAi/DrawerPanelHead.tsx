import React from 'react';

import PRODUCT_CARD_LOGOS from '../../ProductCardLogos';
import GeneralDrawerPanelHead from '../GeneralDrawerPanelHead';

const OpenshiftAiDrawerPanelHead = (
  <GeneralDrawerPanelHead
    {...PRODUCT_CARD_LOGOS.openshiftAi}
    trialButtonLink="https://www.redhat.com/en/technologies/cloud-computing/openshift/openshift-ai/trial"
  />
);

export default OpenshiftAiDrawerPanelHead;
