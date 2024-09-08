import { To } from 'react-router-dom';

const {
  insights: { appname },
} = require('../../../package.json');

/** Returns base path for this app */
const ocmBaseName = `/${appname}`;

/** Returns base path for Insights Advisor app */
const advisorBaseName = `${ocmBaseName}/insights/advisor`;

const withBasename = (to: To): To => {
  if (typeof to === 'string') {
    // replace possible "//" after basename
    // replace possible /openshift/openshift with single /openshift
    return `${ocmBaseName}/${to}`
      .replace('//', '/')
      .replace(`${ocmBaseName}${ocmBaseName}`, ocmBaseName);
  }

  return {
    ...to,
    ...(to.pathname && {
      pathname: `${ocmBaseName}/${to.pathname}`
        .replace('//', '/')
        .replace(`${ocmBaseName}${ocmBaseName}`, ocmBaseName),
    }),
  };
};

export { ocmBaseName, advisorBaseName, withBasename };
