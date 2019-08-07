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
import Router from './Router';
import ErrorBoundary from './ErrorBoundary';

class App extends React.PureComponent {
  render() {
    const { children } = this.props;

    const content = (
      <ErrorBoundary>
        {children || <Router />}
      </ErrorBoundary>
    );

    return (
      <section className="pf-c-page__main-section">
        {content}
      </section>
    );
  }
}


App.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

const mapStateToProps = state => ({
  userProfile: state.userProfile,
});

export default hot(module)(connect(mapStateToProps)(App));
