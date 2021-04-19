import { Component } from 'react';
import { matchPath } from 'react-router-dom';
import PropTypes from 'prop-types';

class Insights extends Component {
  componentDidMount() {
    const { history } = this.props;
    this.cleanupInsightsListener = insights.chrome.on('APP_NAVIGATION', this.navigateToApp);
    this.cleanupRouteListener = history.listen(this.highlightNavItem);
    this.ocmListeners = { APP_REFRESH: [] };
    insights.ocm = {
      on: (event, callback) => {
        if (event !== 'APP_REFRESH') {
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
    let params = {
      id: '',
    };
    switch (location.pathname.split('/')[1]) {
      case 'subscriptions': // old menu compatibility
        params.id = 'subscriptions';
        break;
      case 'quota': // new menu
        params = {
          id: 'openshift-quota',
          parentId: 'subscriptions',
          secondaryNav: true,
        };
        break;
      case 'overview':
        params.id = 'overview';
        break;
      default:
        params.id = '';
    }
    insights.chrome.appNavClick(params);
  };

  navigateToApp = (event) => {
    const { history } = this.props;
    const { location } = history;
    // update route only when it's clicked by the user and can have route change
    if (event.domEvent) {
      if (matchPath(location.pathname, { path: `/${event.navId}`, exact: true })) {
        this.dispatchOcmEvent('APP_REFRESH');
      } else {
        history.push(`/${event.navId}`);
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
