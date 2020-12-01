import { severity } from '@redhat-cloud-services/rule-components/dist/cjs/RuleTable';

// eslint-disable-next-line import/prefer-default-export
export const severityMapping = Object.keys(severity);

export const appendQueryParameter = (url, parameter, value) => {
  const u = new URL(url);
  const params = new URLSearchParams(u.search);
  params.set(parameter, value);

  return `${u.href}?${params}`;
};

// for statistics purposes (CCXDEV-3552)
export const appendCrParamToDocLinks = (details) => {
  const re = /https:\/\/docs\.openshift.com\/[^ )"]+/g;
  return details.replaceAll(re, match => (appendQueryParameter(match, 'cr', 'OCM')));
};
