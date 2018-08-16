import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Row, Col, Masthead,
} from 'patternfly-react';

function LoginPage({ loginFunction, logo }) {
  return (
    <div>
      <Masthead
        titleImg={logo}
        title="OpenShift Unified Hybrid Cloud"
        navToggle={false}
      />
      <Row>
        <Col xs={6} md={4} xsOffset={6}>
          <Button bsSize="large" style={{ marginTop: '20px' }} onClick={loginFunction}>
            Log In
          </Button>
        </Col>
      </Row>
    </div>);
}

LoginPage.propTypes = {
  loginFunction: PropTypes.func.isRequired,
  logo: PropTypes.object.isRequired,
};

export default LoginPage;
