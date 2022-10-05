# README - the short version

## First time setup?
Run `make dev-env-setup`.  Note this will use `sudo` to add lines to your `/etc/hosts`.

## Development environment

```sh
yarn install && yarn start
```

### Heavier alternative: Running with insights proxy

```sh
make insights-proxy-setup && yarn install && yarn start-with-proxy
```

## => Accessing the UI

With any of the above options, UI will be served at https://prod.foo.redhat.com:1337/openshift/, and mockserver will run in the background.

By default UI will use a real staging backend.
You can override by appending to URL `?env=production`, `?env=staging` or `?env=mockdata` (to use static files from `mockdata/` dir).

With all backends, login uses production SSO.

## Merge Request Review

* For external contributors: If you need a merge request review, please message the OCM UI team at the `#ocm-osd-ui` slack channel.
* Code that changes behavior requires a test
* When you touch a component without tests add one
* Large merge requests should be resubmitted in smaller chunks
* Test broad changes locally
