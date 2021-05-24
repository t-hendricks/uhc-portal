/*
The Insights Platform delegates menu highlighting resposibility to OCM.
This file contain a function mapping OCM paths to Insights Platform `appNavClick` parameters.
This is used both for in-app navigation (see app/Insights.jsx) or on-load (see main.jsx)
*/

import getBaseName from './getBaseName';

/**
 * Get parameters for `appNavClick` based on the provided path.
 * @param {string} pathname target path
* */
export default function getNavClickParams(pathname) {
  const cleanPathName = pathname.replace(new RegExp(`^${getBaseName()}`, 'i'), ''); // remove basename
  let params = {};
  switch (cleanPathName.split('/')[1]) {
    case 'quota':
      params = {
        id: cleanPathName.startsWith('/quota/resource-limits') ? 'resource-limits' : 'openshift-quota',
        parentId: 'subscriptions',
        secondaryNav: true,
      };
      break;
    case 'overview':
      params.id = 'overview';
      break;
    case 'releases':
      params.id = 'releases';
      break;
    default:
      params.id = '';
  }
  return params;
}
