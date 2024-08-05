import { ReactNode } from 'react';

import GITOPS from './DrawerPanelContents/GITOPS';
import PIPELINES from './DrawerPanelContents/PIPELINES';
import SERVICE_MESH from './DrawerPanelContents/SERVICE_MESH';

import './DrawerPanelContent.scss';

type DrawerPanelContentNode = {
  head?: ReactNode;
  body: ReactNode;
};

const DRAWER_PANEL_CONTENT = {
  gitops: GITOPS,
  pipelines: PIPELINES,
  serviceMesh: SERVICE_MESH,
};

export { DRAWER_PANEL_CONTENT, DrawerPanelContentNode };
