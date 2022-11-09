import { buildUrlParams } from './queryHelpers';

// get the URL to TnC UX app.
// - baseURL is the base URL of TnC UX app;
// - redirectURL is the return URL if the user clicks "Accept", "Deny", or "Defer";
// - cancelURL is the return URL if the user clicks "Cancel".
const getTermsAppURL = (baseURL: string, redirectURL: string, cancelURL: string): string => {
  const params = {
    redirect: redirectURL,
    cancelRedirect: cancelURL,
  };
  // baseURL contains params already.
  return `${baseURL}&${buildUrlParams(params)}`;
};

export default getTermsAppURL;
