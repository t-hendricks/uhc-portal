
import React from 'react'
import PropTypes from 'prop-types'
import { ConnectedRouter } from 'connected-react-router'
import { Route, Switch } from 'react-router'
import App from './App'
import Header from './Header'


const PortalRouter = ({ history }) => {
  return (
    <div>
      <Header/>
      <ConnectedRouter history={history}>
        <Route exact path="/" component={App}/>
      </ConnectedRouter>
    </div>
  )
}

PortalRouter.propTypes = {
  history: PropTypes.object.isRequired
}

export default PortalRouter
