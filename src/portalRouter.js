
import React from 'react'
import PropTypes from 'prop-types'
import { ConnectedRouter } from 'connected-react-router'
import { Route, Switch } from 'react-router'
import App from './App'

const PortalRouter = ({ history }) => {
  return (
    <ConnectedRouter history={history}>
      <Route exact path="/" component={App} />
    </ConnectedRouter>
  )
}

PortalRouter.propTypes = {
  history: PropTypes.object
}

export default PortalRouter
