/*
The Insights Platform delegates menu highlighting resposibility to OCM.
This file contain a function mapping OCM paths to Insights Platform `appNavClick` parameters.
This is used both for in-app navigation (see app/Insights.jsx) or on-load (see main.jsx)
*/

import { removeBaseName } from './getBaseName';

/**
 * Get parameters for `appNavClick` based on the provided path.
 * @param {string} pathname target path
 * */
export default function getNavClickParams(pathname) {
  const cleanPathName = removeBaseName(pathname).replace(/^\//, '');
  const components = cleanPathName.split('/');

  // The `id` and `parentId` below correspond to current navigation structure
  // https://github.com/cben/cloud-services-config/blob/prod-stable/main.yml
  // TODO: will things change with new upcoming json format?
  // https://github.com/cben/cloud-services-config/blob/ci-beta/chrome/openshift-navigation.json
  switch (components[0]) {
    case 'downloads':
    case 'token':
      return { id: 'downloads' };

    case 'quota':
      return {
        id: components[1] || 'openshift-quota',
        parentId: 'subscriptions',
        secondaryNav: true,
      };

    // These belong to "appId": "subscriptions" but important not to send them to "Clusters"
    case 'subscriptions':
      return {
        id: components[1],
        parentId: 'subscriptions',
        secondaryNav: true,
      };

    // Regular 1:1 cases.
    case 'overview':
    case 'releases':
      return { id: components[0] };

    // Too many cluster-related pages to list ('', 'details', 'archived', 'create', 'register'...)
    default:
      return { id: '' }; // "Clusters"
  }
}
