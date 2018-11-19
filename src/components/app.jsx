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

import routes from '../routes';

import Header from './header';
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
                <Switch>
                  <Redirect from="/" exact to="/clusters" />
                  <Route path="/clusters/install" component={InstallCluster} />
                  <Route path="/clusters" component={ClustersList} />
                  <Route path="/cluster/:id" component={ClusterDetails} />
                </Switch>
              </ConnectedRouter>
            </ErrorBoundary>
          </div>
        </div>
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
