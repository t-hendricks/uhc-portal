# OCM UI
This repository contains the UI components for the OpenShift Cluster
Manager site.

The UI is a JavaScript application written in React and Redux.
Additionally it contains a helper development server, `backend`, written
in Go.

Slack channels: `#service-development` for OCM in general, `#ocm-osd-ui` for UI.

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

To configure the mock server with insights proxy, run `make insights-proxy-setup`
then use `yarn startmock` to use the mock server

### Preparing Data for Mock Backend

The mock backend serves the data stored in the files under the `mockdata/api` directory. There's an one-to-one mapping between API requests and the files. For example, for the request `GET /api/clusters_mgmt/v1/clusters`, the mock backend serves the file `api/clusters/mgmt/v1/clusters.json`.

The file contains JSON data which can be as simple as a single API response.

```json
{
  "kind": "ClusterList",
  "page": 1,
  "size": 14,
  "total": 14,
  "items": [
    ......
  ]
}
```

For multiple API responses, use an array. A `match` field in the special `_meta_` object is used to match a request to its response. Responses are matched in the order as they are set in the array. It is a match when the `_meta_` is missing or it does not contain the `match` field.

For example, this file contains two API responses. The backend returns the 1st one when the request method is POST. Otherwise, it returns the 2nd as the default.

```json
[
  {
    "_meta_": {
      "match": {
        "method": "POST",
      }
    },
    "kind": "Cluster",
    "id": "abcxyz",
    ......
  },
  {
    "kind": "ClusterList",
    "page": 1,
    "size": 14,
    "total": 14,
    "items": [
      ......
    ]
  }
]
```

The `match` field can have,

- `method` to match the HTTP method;

- `request_body` to match the request payload.

Multiple rules are combined using `AND`. For example, in order to match a `POST` request with the payload `{"action": "create", "resource_type": "Cluster"}`, use

```json
"_meta_": {
  "match": {
    "method": "POST",
    "request_body": {
      "action": "create",
      "resource_type": "Cluster"
    }
  }
},
```

An `inject` field can be added to `_meta_` to change the request behaviour,

- `delay` to add a delay for the request;

- `ams_error` to replace the response by an AMS error.

For example, using this `inject`, it takes 1s for the request to return an AMS error with error code 11.

```json
"_meta_": {
  "inject": {
    "delay": "1s",
    "ams_error": "11"
  }
},

------ response (duration 1s) ------
{
  "id": "11",
  "kind": "Error",
  "href": "/api/accounts_mgmt/v1/errors/11",
  "code": "ACCT-MGMT-11",
  "reason": "Error calling OCM Account Manager",
  "operation_id": "021187a5-5650-41ed-9027-27d6e9ed9075"
}
```

# Automated Selenium tests

## New style tests (webdriver.io)

To make it easier for developers to write tests, we've decided to switch to a javascript based testing framework - [webdriver.io](https://webdriver.io).

wdio tests are stored in the `selenium-js/` directory. We use the "page objects" pattern, in `selenium-js/pageobjects` - these define selectors for various components.

Test cases are in `selenium-js/specs`.

Short version: Don’t need anything running, just `yarn e2e-test` will start all services, run test & kill all services.  However when developing, the below procedure allows much faster iterations.

Long version: To run these tests, assuming `yarn start` (or equivalent dev-env) is already running, run the following in separate terminals.

 1. You need _some_ WebDriver server running on localhost:4444.

    - To use same thing as under CI, in a container:

      Optionally export `BROWSER=firefox` or `BROWSER=chrome`.
      Run `yarn selenium-browser`. This starts a selenium control server on port 4444, and VNC server on port 5900.

      Optional: to observe/debug the test, connect a VNC viewer to `localhost`, password is `secret`.
      If you have Vinagre (`sudo dnf install vinagre`), simply run `yarn selenium-viewer`.

      - Actually in CI we use run/selenium-pod.sh that starts containers differently to avoid port conflicts for parallel CI.
        It also uses static nginx, which requires a full `yarn build` on every change — inconvenient for development.

    - Or get a local driver, that opens a browser window directly on your screen — no VNC needed!
      For chrome: `sudo dnf install chromedriver` or `brew install --cask chromedriver`.
      
      Having that, run `chromedriver --port=4444 --url-base=/wd/hub --verbose`

      See https://webdriver.io/docs/driverbinaries for some other options.

 2. Export the credentials in environment variables - `TEST_SELENIUM_WITHQUOTA_PASSWORD` and `TEST_SELENIUM_WITHQUOTA_USER` (ask team members).

    Optionally export `SELENIUM_DEBUG=true` environment variable if you want to stop on failure to let you debug (otherwise, it writes a screenshot file and moves on).

    Optionally export `BROWSER=chrome` or similar — should match driver you're using.  
    Run `yarn selenium-test`.  
    Can pass wdio flags e.g. `yarn selenium-test --spec selenium-js/specs/Downloads.js`.

The yarn commands are defined in package.json "scripts" section, some running scripts from run/ directory.
Both `selenium-test` and `selenium-viewer` will wait for the browser, so you can start them in any order.

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
which tool containers will be updated/run.

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
