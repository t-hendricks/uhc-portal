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

/**
 * This component renders a timestamp returned by the API in a human readable format. For example,
 * in an US locate with time zone UTC+2 the output for `2018-10-15T15:03:41.948943Z` is `10/15/2018
 * 5:03:41 PM`.
 *
 * If no date is given, or if it is an empty string, then it will render `N/A`.
 *
 * If the given date is not in the expected format (RFC 3339) or the date can't be parsed because of
 * any other reason, then a error message is sent to the console, and `N/A` is displayed.
 */
function Timestamp(props) {
  const { value } = props;
  let text = 'N/A';
  if (value) {
    const date = new Date(value);
    const time = date.getTime();
    if (Number.isNaN(time)) {
      // eslint-disable-next-line no-console
      console.error("Can't parse date '%s'", value);
    } else {
      text = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    }
  }
  return (
    <span>{text}</span>
  );
}

Timestamp.propTypes = {
  /**
   * String containing the date to render, using the format described in RFC 3339.
   */
  value: PropTypes.string.isRequired,
};

export default Timestamp;
