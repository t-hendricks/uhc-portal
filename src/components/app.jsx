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

import * as _ from 'lodash-es';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';

import { VerticalNav, VerticalNavMasthead } from 'patternfly-react';

import { routes } from '../routes';
import * as fromUsers from '../ducks/users';

import MastheadOptions from './mastheadOptions/mastheadOptions';
import LoginPage from './LoginPage';
import ClustersPage from './clusters/ClustersPage';
import ClusterDetails from './clusters/ClusterDetails';
import rhProductTitle from '../styles/images/logo.svg';

function renderMenuActions() {
  return (
    <React.Fragment>
      <VerticalNav.Item className="collapsed-nav-item" title="Help" />
      <VerticalNav.Item className="collapsed-nav-item" title="About" />
      <VerticalNav.Item className="collapsed-nav-item" title="User Preferences" />
      <VerticalNav.Item className="collapsed-nav-item" title="Logout" />
    </React.Fragment>
  );
}


class App extends React.Component {
  constructor() {
    super();

    this.menu = routes();
    this.state = {
      aboutShown: false,
    };
  }

  navigateTo(path) {
    const { history } = this.props;
    console.log(path);
    console.dir(history);
    console.dir(history.push(path));
  }

  renderMenuItems() {
    const { location } = this.props;

    const activeItem = this.menu.find(item => _.startsWith(location.pathname, item.to));

    return this.menu.map(item => (
      <VerticalNav.Item
        key={item.to}
        title={item.title}
        iconClass={item.iconClass}
        active={item === activeItem || (!activeItem && item.redirect)}
        onClick={() => this.navigateTo(item.to)}
      />
    ));
  }

  render() {
    const {
      userProfile, history, authenticated, loginFunction, logoutFunction,
    } = this.props;

    if (!authenticated) {
      return (<LoginPage loginFunction={loginFunction} logo={rhProductTitle} />);
    }

    return (
      <div className="layout-pf layout-pf-fixed">
        <VerticalNav>
          <VerticalNavMasthead>
            <VerticalNav.Brand titleImg={rhProductTitle} />
            <MastheadOptions userProfile={userProfile} logoutUser={logoutFunction} />
          </VerticalNavMasthead>
          {this.renderMenuItems()}
          {renderMenuActions()}
        </VerticalNav>
        <div className="container-pf-nav-pf-vertical">
          <div className="coc-content">
            <ConnectedRouter history={history}>
              <Switch>
                <Redirect from="/" exact to="/clusters" />
                <Route path="/clusters" component={ClustersPage} />
                <Route path="/cluster/:id" component={ClusterDetails} />
              </Switch>
            </ConnectedRouter>
          </div>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  userProfile: PropTypes.object,
  location: PropTypes.object,
  history: PropTypes.object.isRequired,
  authenticated: PropTypes.bool.isRequired,
  loginFunction: PropTypes.func.isRequired,
  logoutFunction: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  userProfile: fromUsers.getUserProfile(state),
});

export default withRouter(connect(mapStateToProps)(App));
