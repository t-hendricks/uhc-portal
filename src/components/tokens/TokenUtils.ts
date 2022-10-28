/**
 * Most of the code comes from https://github.com/RedHatInsights/insights-chrome/blob/master/src/js/jwt/jwt.ts
 * Updating it so we can create a hidden iframe to load the token instead
 *
 * TODO: Update doOffline function API in https://github.com/RedHatInsights/insights-chrome/blob/master/src/js/jwt/jwt.ts
 * so that we can provide a callback and skip calling the kc.login method, since we're using an iframe approach.
 * Once the API allows for that, we can remove most of the code here.
 */
import Keycloak, { KeycloakConfig, KeycloakInitOptions } from 'keycloak-js';
import urijs from 'urijs';

const defaultOptions = {
  realm: 'redhat-external',
  clientId: 'cloud-services',
  cookieName: 'cs_jwt',
};

const DEFAULT_ROUTES = {
  prod: {
    url: ['access.redhat.com', 'prod.foo.redhat.com', 'cloud.redhat.com', 'console.redhat.com'],
    sso: 'https://sso.redhat.com/auth',
    portal: 'https://access.redhat.com',
  },
  qa: {
    url: ['qa.foo.redhat.com', 'qa.cloud.redhat.com', 'qa.console.redhat.com'],
    sso: 'https://sso.qa.redhat.com/auth',
    portal: 'https://access.qa.redhat.com',
  },
  ci: {
    url: ['ci.foo.redhat.com', 'ci.cloud.redhat.com', 'ci.console.redhat.com'],
    sso: 'https://sso.qa.redhat.com/auth',
    portal: 'https://access.qa.redhat.com',
  },
  qaprodauth: {
    url: [
      'qaprodauth.foo.redhat.com',
      'qaprodauth.cloud.redhat.com',
      'qaprodauth.console.redhat.com',
    ],
    sso: 'https://sso.redhat.com/auth',
    portal: 'https://access.redhat.com',
  },
  stage: {
    url: [
      'stage.foo.redhat.com',
      'cloud.stage.redhat.com',
      'console.stage.redhat.com',
      'fetest.stage.redhat.com',
    ],
    sso: 'https://sso.stage.redhat.com/auth',
    portal: 'https://access.stage.redhat.com',
  },
  gov: {
    url: ['gov.cloud.redhat.com', 'gov.console.redhat.com'],
    sso: 'https://sso.redhat.com/auth',
    portal: 'https://access.redhat.com',
  },
  govStage: {
    url: ['gov.cloud.stage.redhat.com', 'gov.console.stage.redhat.com'],
    sso: 'https://sso.stage.redhat.com/auth',
    portal: 'https://access.redhat.com',
  },
  dev: {
    url: ['console.dev.redhat.com'],
    sso: 'https://sso.redhat.com/auth',
    portal: 'https://access.redhat.com',
  },
};

const OFFLINE_REDIRECT_STORAGE_KEY = 'chrome.offline.redirectUri';

// Parse through keycloak options routes
const insightsUrl = async (env: typeof DEFAULT_ROUTES) => {
  const ssoEnv = Object.entries(env).find(([, { url }]) => url.includes(window.location.hostname));

  if (ssoEnv) {
    return ssoEnv?.[1].sso;
  }
  return 'https://sso.qa.redhat.com/auth';
};

/**
 * Tries to load the offline token
 *
 * @param {function(string):void} onError
 * Callback after token load encountered an error.
 * The callback gets the failure reason string as a parameter.
 */
export const loadOfflineToken = (onError: (reason: string) => void) => {
  insights.chrome.auth
    .getOfflineToken()
    .then((response: any) => {
      // eslint-disable-next-line no-console
      console.log('Tokens: getOfflineToken succeeded => scope', response.data.scope);
      if (window.parent) {
        // We are inside an iframe, pass the token up to the parent
        window.parent.postMessage({
          token: response.data.refresh_token,
        });
      }
    })
    .catch((reason: string) => {
      // First time this method is called it will error out
      if (onError) {
        onError(reason);
      }
    });
};

export const doOffline = (onDone: (token: string) => void) => {
  const noAuthParam = 'noauth';
  const offlineToken = '2402500adeacc30eb5c5a8a5e2e0ec1f';

  // clear previous postback
  localStorage.removeItem(OFFLINE_REDIRECT_STORAGE_KEY);
  const url = urijs(window.location.href);
  url.removeSearch(noAuthParam);
  url.addSearch(noAuthParam, offlineToken);
  const redirectUri = url.toString();

  if (redirectUri) {
    // set new postback
    localStorage.setItem(OFFLINE_REDIRECT_STORAGE_KEY, redirectUri);
  }

  Promise.resolve(insightsUrl(DEFAULT_ROUTES)).then(async (ssoUrl) => {
    const options: KeycloakInitOptions &
      KeycloakConfig & { promiseType: string; redirectUri: string; url: string } = {
      ...defaultOptions,
      promiseType: 'native',
      redirectUri,
      url: ssoUrl,
    };

    const kc = new Keycloak(options);

    await kc.init(options);

    // Open an iframe to the token sso URL and with a redirect of the current page
    const iframe = document.createElement('iframe');
    const src = kc.createLoginUrl({
      prompt: 'none',
      redirectUri: url.toString(),
    });
    iframe.setAttribute('src', src);
    iframe.setAttribute('title', 'keycloak-silent-check-sso');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const messageCallback = (event: any) => {
      // this method is called from the iframe child
      if (event.origin !== window.location.origin || iframe.contentWindow !== event.source) {
        return;
      }

      if (typeof event.data === 'object' && event.data.token) {
        if (onDone) {
          onDone(event.data.token);
        }

        window.removeEventListener('message', messageCallback);
        document.body.removeChild(iframe);
      }
    };

    window.addEventListener('message', messageCallback);
  });
};
