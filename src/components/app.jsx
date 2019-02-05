/*
Copyright (c) 2018 Red Hat, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { hot } from 'react-hot-loader';
import { Alert } from 'patternfly-react';

import routes from '../routes';

import Header from './header';
import Footer from './footer';
import LoginPage from './LoginPage';
import ErrorBoundary from './ErrorBoundary';
import ClustersList from './clusters/ClusterList';
import ClusterDetails from './clusters/ClusterDetails';
import InstallCluster from './clusters/InstallCluster';

class App extends React.Component {
  constructor() {
    super();

    this.menu = routes();
  }

  navigateTo(path) {
    const { history } = this.props;
    console.log(path);
    console.dir(history);
    console.dir(history.push(path));
  }

  renderRoutes() {
    const { authenticated, userProfile } = this.props;
    // note: in this condition, I've added !authenticated even though
    // it shouldn't really happen. If the user is not authenticated,
    // they would get a login page. However, I wanted to be extra-sure
    // that if something changes in the future, the full router will
    // be the "normal" one, and no exception will be raised if userProfile
    // is undefined.
    if (!authenticated || (userProfile.email && userProfile.email.endsWith('@redhat.com'))) {
      return (
        <div>
          <Alert type="warning" className="alpha-notice">
            <p>
              This is an alpha version of the service, restricted to Red Hat internal
              testing only.
            </p>
            <p>
              All customers and external users and testers should go to&nbsp;
              <a href="https://try.openshift.com">try.openshift.com</a>
              &nbsp;and follow instructions from there.
            </p>
          </Alert>
          <Switch>
            <Redirect from="/" exact to="/clusters" />
            <Route path="/clusters/install" component={InstallCluster} />
            <Route path="/clusters" component={ClustersList} />
            <Route path="/cluster/:id" component={ClusterDetails} />
          </Switch>
        </div>
      );
    }
    return (
      <Switch>
        <Route path="/clusters/install" component={InstallCluster} />
        <Redirect from="/" to="/clusters/install" />
      </Switch>
    );
  }

  render() {
    const {
      history, authenticated, loginFunction, userProfile, logoutFunction,
    } = this.props;

    if (!authenticated) {
      return (<LoginPage loginFunction={loginFunction} />);
    }

    return (
      <div className="layout-pf layout-pf-fixed">
        <Header isLoggedIn userProfile={userProfile} logoutUser={logoutFunction} />
        <div>
          <div className="coc-content">
            <ErrorBoundary>
              <ConnectedRouter history={history}>
                { this.renderRoutes() }
              </ConnectedRouter>
            </ErrorBoundary>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

App.propTypes = {
  userProfile: PropTypes.object,
  location: PropTypes.shape({ pathname: PropTypes.string.isRequired }),
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  authenticated: PropTypes.bool.isRequired,
  loginFunction: PropTypes.func.isRequired,
  logoutFunction: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  userProfile: state.userProfile,
});

export default hot(module)(withRouter(connect(mapStateToProps)(App)));
