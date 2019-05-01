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
import { withRouter } from 'react-router';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';

import ClustersList from '../clusters/ClusterList';
import ClusterDetails from '../clusters/ClusterDetails';
import InstallCluster from '../clusters/install/InstallCluster';
import Tokens from '../tokens/Tokens';

class Router extends React.Component {
  renderRoutes() {
    const { authenticated, userProfile } = this.props;
    // note: in this condition, I've added !authenticated even though
    // it shouldn't really happen. If the user is not authenticated,
    // they would get a login page. However, I wanted to be extra-sure
    // that if something changes in the future, the full router will
    // be the "normal" one, and no exception will be raised if userProfile
    // is undefined.
    if (!authenticated || (userProfile.keycloakProfile.email && userProfile.keycloakProfile.email.endsWith('@redhat.com'))) {
      return (
        <Switch>
          { APP_EMBEDDED && <Route path="/token" component={Tokens} /> }
          <Route path="/install" component={InstallCluster} />
          <Route path="/details/:id" component={ClusterDetails} />
          <Route path="/" component={ClustersList} />
        </Switch>
      );
    }
    return (
      <Switch>
        <Route path="/install" component={InstallCluster} />
        <Redirect from="/" to="/install" />
      </Switch>
    );
  }

  render() {
    const {
      history,
    } = this.props;

    return (
      <ConnectedRouter history={history}>
        {this.renderRoutes()}
      </ConnectedRouter>
    );
  }
}

Router.propTypes = {
  userProfile: PropTypes.object,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  authenticated: PropTypes.bool.isRequired,
};


export default (withRouter(Router));
