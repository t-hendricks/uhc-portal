
import React from 'react';
import PropTypes from 'prop-types';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Button, Row, Col } from 'patternfly-react';
import ClustersPage from './ClustersPage';
import Header from './Header';
import ClusterDetails from './ClusterDetails';

const PortalRouter = ({ history, authenticated, loginFunction }) => {
  if (!authenticated) {
    return (
      <div>
        <Header />
        <Row>
          <Col xs={6} md={4} xsOffset={6}>
            <Button bsSize="large" style={{ marginTop: '20px' }} onClick={loginFunction}>
Log In
            </Button>
          </Col>
        </Row>
      </div>);
  }
  return (
    <div>
      <Header />
      <ConnectedRouter history={history}>
        <Switch>
          <Redirect from="/" exact to="/clusters" />
          <Route path="/clusters" component={ClustersPage} />
          <Route path="/cluster/:id" component={ClusterDetails} />
        </Switch>
      </ConnectedRouter>
    </div>
  );
};

PortalRouter.propTypes = {
  history: PropTypes.object.isRequired,
  authenticated: PropTypes.bool.isRequired,
  loginFunction: PropTypes.func.isRequired,
};

export default PortalRouter;
