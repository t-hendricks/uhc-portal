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
import { Masthead, MenuItem } from 'patternfly-react';
import 'patternfly/dist/css/patternfly.css';
import 'patternfly/dist/css/patternfly-additions.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import logo from './logo.svg';
import * as fromUsers from './ducks/users';

function Header(props) {
  const { userProfile, logoutFunction } = props;
  return (
    <Masthead
      titleImg={logo}
      title="Cluster Reactor"
      navToggle
    >
      <Masthead.Collapse>
        <Masthead.Dropdown id="app-help-dropdown" title={<span title="Help" className="pficon pficon-help" />}>
          <MenuItem eventKey="1">
            Help
          </MenuItem>
          <MenuItem eventKey="2">
            About
          </MenuItem>
        </Masthead.Dropdown>
        <Masthead.Dropdown
          id="app-user-dropdown"
          title={(
            <span>
              <span title="Help" className="pficon pficon-user" />
              <span className="dropdown-title">
                {userProfile.userProfile.firstName}
              </span>
            </span>
          )}
        >
          <MenuItem eventKey="1">
            User Preferences
          </MenuItem>
          <MenuItem eventKey="2" onSelect={logoutFunction}>
            Logout
          </MenuItem>
        </Masthead.Dropdown>
      </Masthead.Collapse>
    </Masthead>
  );
}

Header.propTypes = {
  userProfile: PropTypes.object.isRequired,
  logoutFunction: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  userProfile: fromUsers.getUserProfile(state),
});

export default connect(mapStateToProps)(Header);
