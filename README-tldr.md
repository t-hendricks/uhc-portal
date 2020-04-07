# README - the short version

## How to get my development environment running?

### First time setup?
Run `make setup`.  Note this will use `sudo` to add lines to your `/etc/hosts`.

### Development environment proxied to a real backend

To start the "chromed environment" using the backend proxy, assuming you completed `make setup` or manual setup per the README.adoc file:

1. Run `yarn build && yarn dev-server`
2. Run `./backend` (this will be your backend. Provide additional parameters like `--config=my_config_file.yml` if needed)
3. Run `yarn insights-proxy`

Experimental: instead of running these separately, try `yarn build && yarn start` to run all 3 processes in one terminal (needs UHC_TOKEN env var, no way to pass --config currently).

UI will run at https://qa.foo.redhat.com:1337/

Authentication is QA SSO which accepts various user names (e.g. `foo`, `user`, `redhat`), and the password is always `redhat`.

### Development environment using the mock data server

To start the "chromed environment" using the mock data server, follow the steps above, but instead of step 2,
run `./mockdata/mockserver.py`. You can replace the backend while the app is running.

Experimental: instead of running these separately, try `yarn build && yarn startmock` to run all 3 processes in one terminal.
