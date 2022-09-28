/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { LandingPageCTLItem } from './LandingPageCTLItem';
import type { LandingPageEstateItem } from './LandingPageEstateItem';

export type SelfServiceLandingPageSchema = {
  configTryLearn?: {
    configure?: Array<LandingPageCTLItem>;
    try?: Array<LandingPageCTLItem>;
  };
  estate?: {
    items?: Array<LandingPageEstateItem>;
  };
};
