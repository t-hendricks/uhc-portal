# OCM UI
This repository contains the UI components for the OpenShift Cluster
Manager site.

The UI is a pure JavaScript application written in React and Redux.
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

To build the `backend` proxy server run the `binaries` target of the
*Makefile*:

```
make binaries
```

# Running locally

To run the application in your development environment, you need 3
things:

1.  either a real or mock backend

2.  insights "chrome" proxy

3.  webpack dev server

The following explains these parts in detail; see `README-tldr.md` file
for quick commands that do all that.

In general, once you configure your backend proxy, the `yarn start` command should suffice for running everything. The next section will teach you how to configure it.

## A real backend

You will need to start the backend proxy server, which acts as a
proxy for the *OpenID* and API services that are required by the
application. Before starting it make sure to have an offline access
token, either in the `UHC_TOKEN` environment variable or in the `token`
parameter of the configuration file:

    $ export UHC_TOKEN="eyJ..."
    $ ./backend

To obtain the access token go to the [token
page](https://cloud.redhat.com/openshift/token) and copy the *offline
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

## Running Without a Real Backend (mock backend)

Sometimes the backend might be broken, but you still want to develop the
UI. For this purpose we’ve created a basic mock server that sends mock
data. It doesn’t support all actions the real backend supports, but it
should allow you to run the UI and test basic read-only functionality.

To run it, run `mockdata/mockserver.py`.

Then follow below in another terminal, run `yarn dev-server-for-mock`
instead of `yarn dev-server`, and you’ll get a working UI showing mock
data running with the chromed environment.

## Insights "chrome" proxy

As all apps under cloud.redhat.com, our app uses
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

## Webpack dev server

If using a real backend, run webpack with:

    $ yarn build; yarn dev-server

That also works with mockdata server, but all metrics timestamps will be
"too old", hiding some of the UI. To disable these checks and show old
metrics, use:

    $ yarn build; yarn dev-server-for-mock

The "build" step is crucial at the moment, but we should work to make it
not required in the future.

Once the server is running you can access your UI on
<https://prod.foo.redhat.com:1337/openshift>.

# Automated Selenium tests

## Old style tests

QA have been developing end-to-end UI tests in 2 repos, forked from
Openshift’s test repos:

  - <https://github.com/xueli181114/cucushift>, `ocm/` directory — these
    contain the actual OCM test cases in a [pseudo-English
    DSL](https://en.wikipedia.org/wiki/Cucumber_\(software\)#Gherkin_language).  
    This repo is private but should be accessible to all in Red Hat;
    make sure your ssh key is [known to
    GitHub](https://github.com/settings/keys).

  - <https://github.com/xueli181114/verification-tests/> — ruby
    framework and definitons of "steps" above test cases use. Our OCM
    test cases mostly use `When I perform the ... web action`; this has
    a generic ruby implementation, with the actual steps used for each
    action described in `lib/rules/web/ocm_console/*.xyaml` files in
    another [pseudo-YAML
    DSL](https://github.com/xueli181114/verification-tests/blob/master/doc/webauto.adoc).

### Running old-style selenium Tests

Short version: Don’t need anything running, just `yarn test-e2e` will
start all services, run test & kill all services.

If a test fails, it’ll stop & dump you into "pry" prompt, which is
pretty useless but gives you chance to open VNC and play with the
browser. Type `quit` or simply kbd:\[Ctrl + C\] to continue to next
test.

You can set UNATTENDED=1 env var to skip interactive prompts.

Long version: to run test(s) locally, in addition to all the above
(backend + insights proxy + dev server), you’ll need:

1.  `make run/verification-tests` — clones repo under
    `run/verification-tests`. Note you need this whether you build local
    image or pull Quay in next step, Ruby code from that dir is mounted
    into the container.

2.  Optional: `make selenium-tests-image` , re-builds container image
    with Ruby depedencies. Otherwise, the image will be pulled from Quay
    on first use. If you update verification-tests of the Dockerfile,
    increment the tag in `run/selenium-tests.version.sh` and run `make
    selenium-tests-push` so that CI and rest of the team can use it.

3.  Optional: `export BROWSER=firefox` (or `chrome` or `safari`) to
    choose which browser.

4.  Start `yarn selenium-browser` — runs a browser under Xvnc in a
    container.

5.  `yarn selenium-test` — waits for dependencies, then executes tests
    in a container.

6.  Optional: to observe/debug the test, connect a VNC viewer to
    `localhost`, password is `secret`. If you have Vinagre, simply run
    `yarn selenium-viewer`.

## New style tests (webdriver.io)

To make it easier for developers to write tests, we've decided to switch to a javascript based testing framework - [webdriver.io](https://webdriver.io).

wdio tests are stored in the `selenium-js/` directory. We use the "page objects" pattern, in `selenium-js/pageobjects` - these define selectors for various components.

Test cases are in `selenium-js/specs`.

To run these tests, assuming `yarn start` (or equivalent dev-env) is already running, run the following:

1. `yarn selenium-browser` - this starts the browser container for the test. You can use VNC to connect to it to watch it in action, `localhost` with the password `secret`.

3. Export the credentials in environment variables - `TEST_SELENIUM_NOANYQUOTA_PASSWORD` and `TEST_SELENIUM_NOANYQUOTA_USERNAME`

2. `yarn run wdio` or `yarn selenium-test` - runs the test.

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
