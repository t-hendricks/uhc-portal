import { Component } from 'react';
import { matchPath } from 'react-router-dom';
import PropTypes from 'prop-types';

import getNavClickParams from '../../common/getNavClickParams';
import { removeBaseName } from '../../common/getBaseName';

class Insights extends Component {
  componentDidMount() {
    const { history } = this.props;
    this.cleanupInsightsListener = insights.chrome.on('APP_NAVIGATION', this.navigateToApp);
    this.cleanupRouteListener = history.listen(this.highlightNavItem);
    this.ocmListeners = { APP_REFRESH: [] };
    insights.ocm = {
      on: (event, callback) => {
        if (event !== 'APP_REFRESH') {
          // eslint-disable-next-line no-console
          console.error(`Invalid event - ${event}`);
          return () => {};
        }
        return this.addOcmListener(event, callback);
      },
    };
  }

  componentWillUnmount() {
    this.cleanupInsightsListener();
    this.cleanupRouteListener();
    delete insights.ocm;
  }

  highlightNavItem = (location) => {
    insights.chrome.appNavClick(getNavClickParams(location.pathname));
  };

  navigateToApp = (event) => {
    const { history } = this.props;
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
        this.dispatchOcmEvent('APP_REFRESH');
      } else {
        history.push(targetPathName);
      }
    }
  };

  addOcmListener = (event, callback) => {
    const listeners = this.ocmListeners[event];
    let cleanupFn = () => {};
    if (!listeners.includes(callback)) {
      listeners.push(callback);
      const idx = listeners.length - 1;
      cleanupFn = () => listeners.splice(idx, 1);
    }
    return cleanupFn;
  };

  dispatchOcmEvent = (event) => {
    this.ocmListeners[event].forEach(callback => callback());
  };

  render() { return null; }
}

Insights.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    listen: PropTypes.func.isRequired,
  }).isRequired,
};

export default Insights;
