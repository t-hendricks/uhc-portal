# README - the short version

## First time setup?
Run `make insights-proxy-setup`.  Note this will use `sudo` to add lines to your `/etc/hosts`.

## Development environment proxied to a real backend

To start the "chromed environment" using the backend proxy, you'll need a token from https://console.redhat.com/openshift/token.

```sh
export UHC_TOKEN=...
make && yarn build && yarn start
```

### Alternative: Running the components separately

First run `make` for various setup. Then:

1. Run `yarn build && yarn dev-server`
2. Run `./backend` (this will be your backend. Provide additional parameters like `--config=my_config_file.yml` if needed)
3. Run `yarn insights-proxy`

## Development environment using the mock data server

To start the "chromed environment" using the mock data server:
```
make && yarn build && yarn startmock
```

If you prefer running the components separately, follow the steps above, but instead of step 2, run `./mockdata/mockserver.py`.
You can replace the backend while the app is running.

## => Accessing the UI

With any of the above options, UI will be served at https://qa.foo.redhat.com:1337/openshift/

Authentication is QA SSO which accepts various user names (e.g. `foo`, `user`, `redhat`), and the password is always `redhat`.

## Merge Request Review

* Code that changes behavior requires a test
* When you touch a component without tests add one
* Large merge requests should be resubmitted in smaller chunks
* Test broad changes locally
