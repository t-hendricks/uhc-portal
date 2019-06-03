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
import { Brand, PageHeader } from '@patternfly/react-core';
import { noop } from '../../common/helpers';
import rhProductTitle from '../../styles/images/logo.png';
import HeaderToolBar from './HeaderToolBar';

const { insights } = require('../../../package.json');

function RouterlessHeader(props) {
  const {
    isLoggedIn, userProfile, logoutUser,
  } = props;
  return (
    <PageHeader
      className="uhc_header"
      logo={<Brand src={rhProductTitle} alt="Red Hat OpenShift" />}
      logoProps={{
        href: `/${insights.appname}`,
      }}
      toolbar={
        <HeaderToolBar isLoggedIn={isLoggedIn} userProfile={userProfile} logoutUser={logoutUser} />
      }
    />
  );
}

RouterlessHeader.propTypes = {
  isLoggedIn: PropTypes.bool,
  userProfile: PropTypes.object.isRequired,
  logoutUser: PropTypes.func,
};

RouterlessHeader.defaultProps = {
  logoutUser: noop,
  isLoggedIn: false,
};

export default RouterlessHeader;
