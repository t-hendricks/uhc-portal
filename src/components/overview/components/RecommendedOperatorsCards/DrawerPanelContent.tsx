import { ReactNode } from 'react';

import GitopsDrawerPanelBody from './DrawerPanelContents/Gitops/DrawerPanelBody';
import GitopsDrawerPanelHead from './DrawerPanelContents/Gitops/DrawerPanelHead';
import PipelinesDrawerPanelBody from './DrawerPanelContents/Pipelines/DrawerPanelBody';
import PipelinesDrawerPanelHead from './DrawerPanelContents/Pipelines/DrawerPanelHead';
import ServiceMeshDrawerPanelBody from './DrawerPanelContents/ServiceMesh/DrawerPanelBody';
import ServiceMeshDrawerPanelHead from './DrawerPanelContents/ServiceMesh/DrawerPanelHead';

import './DrawerPanelContent.scss';

type DrawerPanelContentNode = {
  head?: ReactNode;
  body: ReactNode;
};

const DRAWER_PANEL_CONTENT = {
  gitops: { head: GitopsDrawerPanelHead, body: GitopsDrawerPanelBody },
  pipelines: { head: PipelinesDrawerPanelHead, body: PipelinesDrawerPanelBody },
  serviceMesh: { head: ServiceMeshDrawerPanelHead, body: ServiceMeshDrawerPanelBody },
};

export { DRAWER_PANEL_CONTENT, DrawerPanelContentNode };
