import React from 'react';

import { urls } from '~/common/installLinks.mjs';

type DownloadsPageRowsType = {
  expanded: { [index: string]: boolean };
  setExpanded: (param: { [index: string]: boolean }) => void;
  selections: { [index: string]: { OS: string | null; architecture: string } };
  setSelections: (param1: {}) => void;
  toolRefs: { [index: string]: React.RefObject<any> };
  urls: typeof urls;
};

export { DownloadsPageRowsType };
