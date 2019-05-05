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
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';

import ClustersList from '../clusters/ClusterList';
import ClusterDetails from '../clusters/ClusterDetails';
import InstallCluster from '../clusters/install/InstallCluster';
import Tokens from '../tokens/Tokens';

function Router(props) {
  const { history } = props;

  return (
    <ConnectedRouter history={history}>
      <Switch>
        { APP_EMBEDDED && <Route path="/token" component={Tokens} /> }
        <Route path="/install" component={InstallCluster} />
        <Route path="/details/:id" component={ClusterDetails} />
        <Route path="/" component={ClustersList} />
      </Switch>
    </ConnectedRouter>
  );
}

Router.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
};

export default (withRouter(Router));
