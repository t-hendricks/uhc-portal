/*
Copyright (c) 2019 Red Hat, Inc.

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

/**
 * Rounds the given number so that it has at most the given number of decimal
 * places. This is intended mostly for display purposes, to avoid displaying
 * very long numbers.
 *
 * @param {number} value - The value to round.
 * @param {number} places - The maximum number of decimal places to preserve.
 * @returns {number} The rounded value.
 */
const round = (value, places) => {
  const factor = 10.0 ** places;
  return Math.round(value * factor) / factor;
};

export default round;
