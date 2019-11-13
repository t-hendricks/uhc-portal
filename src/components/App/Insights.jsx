import { Component } from 'react';
import { matchPath } from 'react-router-dom';
import PropTypes from 'prop-types';
import delay from 'lodash/delay';

class Insights extends Component {
  componentDidMount() {
    const { history } = this.props;
    this.cleanupInsightsListener = insights.chrome.on('APP_NAVIGATION', this.navigateToApp);
    this.cleanupRouteListener = history.listen(this.highlightNavItem);
    const { location } = history;
    // the Insights side nav menu could load slower than our app.
    // the initial highlight should be triggered at different delayed time.
    [0, 500, 1500, 2000].forEach(delayed => delay(() => this.highlightNavItem(location), delayed));
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

  highlightNavItem = (location) => {
    let appId = '';
    if (location.pathname.split('/')[1] === 'subscriptions') {
      appId = 'subscriptions';
    }
    insights.chrome.appNavClick({ id: appId });
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
  }).isRequired,
};

export default Insights;
