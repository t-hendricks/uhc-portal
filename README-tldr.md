# README - the short version

## First time setup?
Run `make dev-env-setup`.  Note this will use `sudo` to add lines to your `/etc/hosts`.

## Development environment

```sh
yarn build && yarn start2
```

By default proxied to a real backend (staging), append `?env=mockserver` to use static files from `mockdata/` dir.

### Alternative: Running with insights proxy

See full readme file for detailed instructions.
## => Accessing the UI

With any of the above options, UI will be served at https://prod.foo.redhat.com:1337/openshift/

## Merge Request Review

* Code that changes behavior requires a test
* When you touch a component without tests add one
* Large merge requests should be resubmitted in smaller chunks
* Test broad changes locally
