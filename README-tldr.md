# README - the short version

## First time setup?
Run `make dev-env-setup`.  Note this will use `sudo` to add lines to your `/etc/hosts`.

## Development environment proxied to a real backend (staging)

```sh
yarn build && yarn start
```

### Alternative: Running with insights proxy

See full readme file for detailed instructions.

## Development environment using the mock data server

To start the "chromed environment" using the mock data server:
```
make && yarn build && yarn startmock
```

If you prefer running the components separately, follow the steps above, but instead of step 2, run `./mockdata/mockserver.py`.
You can replace the backend while the app is running.

## => Accessing the UI

With any of the above options, UI will be served at https://prod.foo.redhat.com:1337/openshift/

## Merge Request Review

* Code that changes behavior requires a test
* When you touch a component without tests add one
* Large merge requests should be resubmitted in smaller chunks
* Test broad changes locally
