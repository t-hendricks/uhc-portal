import React from 'react';
import { matchPath, useHistory } from 'react-router-dom';
import getNavClickParams from '../../common/getNavClickParams';
import ocmBaseName, { removeOcmBaseName } from '../../common/getBaseName';

const Insights = () => {
  const history = useHistory();

  const ocmListeners = React.useRef<{ [event: string]: (() => void)[] }>({ APP_REFRESH: [] });
  React.useEffect(() => {
    const navigateToApp = (event: any) => {
      const { location } = history;
      // update route only when it's clicked by the user and can have route change
      const path = event.domEvent?.href;
      if (path && path.startsWith(ocmBaseName())) {
        const targetPathName = removeOcmBaseName(path);
        if (matchPath(location.pathname, { path: targetPathName, exact: true })) {
          dispatchOcmEvent('APP_REFRESH');
        } else {
          // AppNavigationCB called before new history entry is added;
          // schedule history to be replaced afterwards so that Router notices change
          setTimeout(() => history.replace(targetPathName), 0);
        }
      }
    };

    const addOcmListener = (event: string, callback: Function) => {
      const listeners: Function[] = ocmListeners.current[event];
      let cleanupFn = () => {};
      if (!listeners.includes(callback)) {
        listeners.push(callback);
        const idx = listeners.length - 1;
        cleanupFn = () => listeners.splice(idx, 1);
      }
      return cleanupFn;
    };

    const dispatchOcmEvent = (event: string) => {
      ocmListeners.current[event].forEach((callback) => callback());
    };

    const cleanupInsightsListener = insights.chrome.on('APP_NAVIGATION', navigateToApp);
    const cleanupRouteListener = history.listen((location) => {
      insights.chrome.appNavClick(getNavClickParams(location.pathname));
    });

    insights.ocm = {
      on: (event: string, callback: () => void) => {
        if (event !== 'APP_REFRESH') {
          // eslint-disable-next-line no-console
          console.error(`Invalid event - ${event}`);
          return () => {};
        }
        return addOcmListener(event, callback);
      },
    };

    return () => {
      cleanupInsightsListener?.();
      cleanupRouteListener();
      delete insights.ocm;
    };
  }, [history]);

  return null;
};

export default Insights;
