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
import { hot } from 'react-hot-loader';
import { Page, PageSection, PageSectionVariants } from '@patternfly/react-core';

import Header from './Header';
import Footer from './Footer';
import Router from './Router';
import LoginPage from './LoginPage';
import ErrorBoundary from './ErrorBoundary';

class App extends React.PureComponent {
  render() {
    const {
      authenticated, loginFunction, userProfile, logoutFunction, children,
    } = this.props;

    let { HeaderComponent } = this.props;

    if (!authenticated) {
      return <LoginPage loginFunction={loginFunction} />;
    }

    const content = (
      <ErrorBoundary>
        {children || (
          <Router
            authenticated={authenticated}
            userProfile={userProfile}
          />)}
      </ErrorBoundary>
    );

    if (APP_EMBEDDED) {
      return (
        <section className="pf-c-page__main-section">
          {content}
        </section>
      );
    }

    HeaderComponent = HeaderComponent || Header;
    const header = (
      <HeaderComponent
        isLoggedIn
        userProfile={userProfile}
        logoutUser={logoutFunction}
      />);

    return (
      <Page header={header}>
        <PageSection variant={PageSectionVariants.light}>
          <div className="coc-content">
            {content}
          </div>
        </PageSection>
        <Footer />
      </Page>
    );
  }
}

App.propTypes = {
  userProfile: PropTypes.object,
  authenticated: PropTypes.bool.isRequired,
  loginFunction: PropTypes.func.isRequired,
  logoutFunction: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  HeaderComponent: PropTypes.func,
};

const mapStateToProps = state => ({
  userProfile: state.userProfile,
});

export default hot(module)(connect(mapStateToProps)(App));
