import React, { PropsWithChildren, useEffect } from 'react';

import config from '../../config';

import { AppDrawer } from './AppDrawer';
import EnvOverrideMessage from './EnvOverrideMessage';
import ErrorBoundary from './ErrorBoundary';

export const AppPage: React.FC<PropsWithChildren<{ title?: string }>> = ({ children, title }) => {
  useEffect(() => {
    if (title) {
      document.title = title;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppDrawer>
      {config.envOverride && <EnvOverrideMessage env={config.envOverride} />}
      <ErrorBoundary>{children}</ErrorBoundary>
    </AppDrawer>
  );
};
