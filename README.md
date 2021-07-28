# OCM UI
This repository contains the UI components for the OpenShift Cluster
Manager site.

The UI is a JavaScript application written in React and Redux.
Additionally it contains a helper development server, `backend`, written
in Go.

# Style

To promote consistency in the code base and prevent bike-shedding over
style issues, OCM follows the JavaScript and React style guides produced
by airbnb.

[airbnb style guides](https://github.com/airbnb/javascript)

To guide and aid developers in style consistency, OCM uses eslint and
the eslint tools provided by airbnb.

[eslint](https://eslint.org/) [airbnb eslint
tools](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb)

To run the linter

```
    $ yarn lint
```

## Local Linting

To use eslint tools locally (e.g. as part of your editor config), you
may need to follow the installation and usage instructions using global
installation.

[Installation
instructions](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb#eslint-config-airbnb-1)

# Building

To build the application install the `yarn` tool and then run these
commands:

```
yarn install
yarn build
```

# Running locally

For a first time setup, run `make dev-env-setup`. This will ask for your `sudo` password, to add some entries to `/etc/hosts`

After initial setup, run `yarn start`.

The UI will be available at https://prod.foo.redhat.com:1337/openshift/

## Running Without a Real Backend (mock backend)

Sometimes the backend might be broken, but you still want to develop the
UI. For this purpose we’ve created a basic mock server that sends mock
data. It doesn’t support all actions the real backend supports, but it
should allow you to run the UI and test basic read-only functionality.

To configure the mock server with insights proxy, run `yarn insights-proxy-setup`
then use `yarn startmock` to use the mock server

# Automated Selenium tests

## New style tests (webdriver.io)

To make it easier for developers to write tests, we've decided to switch to a javascript based testing framework - [webdriver.io](https://webdriver.io).

wdio tests are stored in the `selenium-js/` directory. We use the "page objects" pattern, in `selenium-js/pageobjects` - these define selectors for various components.

Test cases are in `selenium-js/specs`.

Short version: Don’t need anything running, just `yarn test-e2e` will start all services, run test & kill all services.  However when developing, the below procedure allows much faster iterations.

Long version: To run these tests, assuming `yarn start` (or equivalent dev-env) is already running, run the following:

1. `yarn selenium-browser` - this starts the browser container for the test. You can use VNC to connect to it to watch it in action, `localhost` with the password `secret`.

2. Export the credentials in environment variables - `TEST_SELENIUM_WITHQUOTA_PASSWORD` and `TEST_SELENIUM_WITHQUOTA_USER`

3. `yarn run wdio` or `yarn selenium-test` - runs the test.

4.  Optional: to observe/debug the test, connect a VNC viewer to `localhost`, password is `secret`.
    If you have Vinagre, simply run `yarn selenium-viewer`.


# Alternative option for running locally: insights-proxy

## The backend proxy

You will need to start the backend proxy server, which acts as a
proxy for the *OpenID* and API services that are required by the
application.

To build the `backend` proxy server run the `binaries` target of the
*Makefile*:

```
make binaries
```

Before starting it make sure to have an offline access
token, either in the `UHC_TOKEN` environment variable or in the `token`
parameter of the configuration file:

    $ export UHC_TOKEN="eyJ..."
    $ ./backend

To obtain the access token go to the [token
page](https://console.redhat.com/openshift/token) and copy the *offline
access token*.

By default the backend proxy server will be available at
<http://localhost:8010>, and the default configuration of the
application is already prepared to use it.

If you need to change the configuration used by this backend proxy, then
create a YAML file. 

By default, if nothing else is specified, the backend proxy will attempt to load the config file from the default location: `backend-config.yml`.

You can alsoand specify the config file with the `--config` command line
option:

    $ ./backend --config=my.yml

Or with the `BACKEND_CONFIG` environment variable:

    $ BACKEND_CONFIG="my.yml" ./backend

The content of this file should be something like this (or any subset of
it):

``` yaml
listener:
  address: localhost:8010

keycloak:
  url: https://sso.redhat.com/auth/realms/redhat-external/protocol/openid-connect/token
  client_id: cloud-services
  client_secret: # empty by default

proxies:
- prefix: /api/
  target: https://api.stage.openshift.com

token: eyJ...  # default token for any user. Optional.
token_map:  # map specific user names (in QA auth server) to access tokens. Optional.
  user1: eyJ...
  user2: eyJ...
```

Note that this `--config` option and the configuration file are
optional, the default configuration already uses `localhost`,
`sso.redhat.com` and port `8002`, and already forwards all API requests
to the staging environment.

If you need to use a service located in some other place, for example if
you need to use the clusters service deployed in your local environment,
you can add an additional proxy configuration:

``` yaml
proxies:
- prefix: /api/clusters_mgmt/
  target: https://api.127.0.0.1.nip.io
```

That will forward requests starting with `/api/clusters_mgmt/` to your
local clusters service, and the rest to the staging environment.


## Insights "chrome" proxy

As all apps under console.redhat.com, our app uses
[insights-chrome](https://github.com/RedHatInsights/insights-chrome).
(The term "chrome" refers to it being responsible for header & menu
around the main content, no relation to Google Chrome.)

It’s not a regular build dependency but is injected by CDN using [Edge
Side Includes](https://en.wikipedia.org/wiki/Edge_Side_Includes) tags.
To mimic this, as well as resulting URL structure, in development we
have to use
[insights-proxy](https://github.com/RedHatInsights/insights-proxy).

`make insights-proxy-setup` will autimatically clone/pull insights-proxy
under `run/insights-proxy` subdirectory and perform its setup
instructions (`patch-etc-hosts.sh`, `update.sh`). . Note that this
includes using `sudo` to patch you /etc/hosts.

This is a one-time setup process but safe to repeat if you want to
update the proxy.

Now you can use

    $ yarn insights-proxy

which waits for a backend to be serving (might not work otherwise), then
runs an `insightsproxy` container with our `profiles/local-frontend.js`
config, passing API requests to the backend (or mock server) described
above.

You may set `RUNNER=podman` or `RUNNER=docker` env var to choose with
which tool the container will be updated/run.

  - Some ways to kill insights-proxy "detach" the container instead of
    exiting. `yarn stop-insights-proxy` helps.


# Deploying

The staging and production OCM sites are deployed into the Insights
enviroments using the `push_to_insights.sh` script. This script is
called via git hooks. See the script for more details.

Use `./deploy_info.js` script to check which versions are now deployed.
If you want to monitor/debug the deploy jobs, `./deploy_info.js --json`
output has all the info you’ll need.

# Merge Request review

  - Code that changes behavior requires a test

  - When you touch a component without tests add one

  - Large merge requests should be resubmitted in smaller chunks

  - Test broad changes locally
