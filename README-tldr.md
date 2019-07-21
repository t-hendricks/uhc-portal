# README - the short version

## How to get my development environment running?

### First time setup?
For detailed instructions, including how to build and configure the backend proxy and the Insights Chrome, see `README.adoc`.

### Development environment proxied to a real backend

To start the "chromed environment" using the backend proxy, assuming you completed the setup instructions in the README file:

1. Run `yarn build-embedded && yarn start-embedded`
2. Run `./backend` (this will be your backend. Provide additional parameters like `--config=my_config_file.yml` if needed)
3. Run `SPANDX_CONFIG="$(pwd)/profiles/local-frontend.js" bash $PROXY_PATH/scripts/run.sh`

UI will run at https://qa.foo.redhat.com:1337/

Authentication is QA SSO which should accept any user, and the password is always redhat


### Development environment using the mock data server

To start the "chromed environment" using the mock data server

1. Run `yarn build-embedded && yarn startmock-embedded`
2. Run `./mockdata/mockserver.py` (this will be your backend)
3. Run `SPANDX_CONFIG="$(pwd)/profiles/local-frontend-mock.js" bash $PROXY_PATH/scripts/run.sh`

UI will run at https://qa.foo.redhat.com:1337/
Make sure to start the mock server BEFORE starting the insights proxy script.

Authentication is QA SSO which should accept any user, and the password is always redhat
