
import React from 'react'
import PropTypes from 'prop-types'
import { ConnectedRouter } from 'connected-react-router'
import { Route, Switch, Redirect } from 'react-router-dom'
import App from './App'
import Header from './Header'
import { CreateClusterModal } from './CreateClusterModal.js';

const PortalRouter = ({ history }) => {
  return (
    <div>
      <Header/>
      <ConnectedRouter history={history}>
        <Switch>
          <Redirect from="/" exact to="/clusters"/>
          <Route path="/clusters" component={App}/>
        </Switch>
      </ConnectedRouter>
    </div>
  )
}

PortalRouter.propTypes = {
  history: PropTypes.object.isRequired
}

export default PortalRouter
