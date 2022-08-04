import React from 'react';
import type { RouterProps } from 'react-router-dom';
import { matchPath } from 'react-router-dom';

import getNavClickParams from '../../common/getNavClickParams';
import { removeBaseName } from '../../common/getBaseName';

type History = RouterProps['history'];
type Listener = Parameters<History['listen']>[0];
type Location = Parameters<Listener>[0];

type Props = {
  history: History;
};

const Insights = ({ history }: Props) => {
  const ocmListeners = React.useRef<{[event: string]: Function[]}>({ APP_REFRESH: [] });
  React.useEffect(() => {
    const highlightNavItem = (location: Location) => {
      insights.chrome.appNavClick(getNavClickParams(location.pathname));
    };

    const navigateToApp = (event: any) => {
      const { location } = history;
      // update route only when it's clicked by the user and can have route change
      /**
       * Chrome is no longer sending the target object.
       * Now it the link href is directly sent under "event.domEvent.href" path
       * Condition won't be necessary after July 26th 2021.
       * That is when nav changes hit prod-stable env
       */
      if (event.domEvent && (event.domEvent?.target?.pathname || event.domEvent?.href)) {
        const targetPathName = removeBaseName(
          event.domEvent?.target?.pathname || event.domEvent?.href,
        );
        if (matchPath(location.pathname, { path: targetPathName, exact: true })) {
          dispatchOcmEvent('APP_REFRESH');
        } else {
          history.push(targetPathName);
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
      ocmListeners.current[event].forEach(callback => callback());
    };

    const cleanupInsightsListener = insights.chrome.on('APP_NAVIGATION', navigateToApp);
    const cleanupRouteListener = history.listen(highlightNavItem);

    insights.ocm = {
      on: (event: string, callback: Function) => {
        if (event !== 'APP_REFRESH') {
          // eslint-disable-next-line no-console
          console.error(`Invalid event - ${event}`);
          return () => {};
        }
        return addOcmListener(event, callback);
      },
    };

    return () => {
      cleanupInsightsListener();
      cleanupRouteListener();
      delete insights.ocm;
    };
  }, [history]);

  return null;
};

export default Insights;
