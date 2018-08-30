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

import { Dropdown, Icon, MenuItem } from 'patternfly-react';
import helpers from '../../common/helpers';

const MastheadOptions = ({
  userProfile, showHelp, showAboutModal, logoutUser,
}) => (
  <nav className="collapse navbar-collapse">
    <ul className="navbar-iconic nav navbar-nav navbar-right">
      <Dropdown componentClass="li" id="help">
        <Dropdown.Toggle useAnchor className="nav-item-iconic">
          <Icon type="pf" name="help" />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <MenuItem onClick={showHelp}>
            Help
          </MenuItem>
          <MenuItem onClick={showAboutModal}>
            About
          </MenuItem>
        </Dropdown.Menu>
      </Dropdown>
      <Dropdown componentClass="li" id="user">
        <Dropdown.Toggle useAnchor className="nav-item-iconic">
          <Icon type="pf" name="user" />
          <span className="dropdown-title">
            {userProfile.firstName || userProfile.username}
          </span>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <MenuItem onClick={logoutUser}>
            Log out
          </MenuItem>
        </Dropdown.Menu>
      </Dropdown>
    </ul>
  </nav>
);

MastheadOptions.propTypes = {
  userProfile: PropTypes.object.isRequired,
  showHelp: PropTypes.func,
  showAboutModal: PropTypes.func,
  showUserPreferences: PropTypes.func,
  logoutUser: PropTypes.func,
};

MastheadOptions.defaultProps = {
  showHelp: helpers.noop,
  showAboutModal: helpers.noop,
  showUserPreferences: helpers.noop,
  logoutUser: helpers.noop,
};

export default MastheadOptions;
