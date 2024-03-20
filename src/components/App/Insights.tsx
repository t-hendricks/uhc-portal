import React from 'react';
import { Location, matchPath, useLocation, useNavigate } from 'react-router-dom-v5-compat';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { Chrome } from '~/types/types';
import getNavClickParams from '../../common/getNavClickParams';
import { ocmAppPath, removeOcmBaseName } from '../../common/getBaseName';

const Insights = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const chrome = useChrome() as Chrome;

  const ocmListeners = React.useRef<{ [event: string]: (() => void)[] }>({ APP_REFRESH: [] });

  const dispatchOcmEvent = (event: string) => {
    ocmListeners.current[event].forEach((callback) => callback());
  };

  React.useEffect(() => {
    const navigateToApp = (event: any) => {
      // update route only when it's clicked by the user and can have route change
      const path = event.domEvent?.href;
      if (path && path.startsWith(ocmAppPath)) {
        const targetPathName = removeOcmBaseName(path);
        if (matchPath(targetPathName, location.pathname)) {
          dispatchOcmEvent('APP_REFRESH');
        } else {
          // AppNavigationCB called before new history entry is added;
          // schedule history to be replaced afterwards so that Router notices change
          setTimeout(() => navigate(targetPathName, { replace: true }), 0);
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

    const cleanupInsightsListener = chrome.on('APP_NAVIGATION', navigateToApp);
    const cleanupRouteListener = (location: Location<any>) => {
      chrome.appNavClick(getNavClickParams(location.pathname));
    };

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
      cleanupRouteListener(location);
      delete insights.ocm;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, navigate]);

  return null;
};

export default Insights;
