import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Col,
} from 'patternfly-react';
import Header from './Header';

function LoginPage({ loginFunction }) {
  return (
    <React.Fragment>
      <Header isLoggedIn={false} />
      <Col xs={6} md={4} xsOffset={6}>
        <Button bsSize="large" style={{ marginTop: '20px' }} onClick={loginFunction}>
          Log In
        </Button>
      </Col>
    </React.Fragment>);
}

LoginPage.propTypes = {
  loginFunction: PropTypes.func.isRequired,
};

export default LoginPage;
