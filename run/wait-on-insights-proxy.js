#!/usr/bin/env node
// Config for https://github.com/jeffbski/wait-on for waiting for insights-proxy

const waitOn = require('wait-on');

const config = {
  interval: 1000,
  strictSSL: false,

  // Insights-proxy cares about the requested domain name.
  // When devoloping locally, we define  prod.foo.redhat.com and friends in /etc/hosts.
  // But it's possible — and necessary in CI — to run selenium-test with that defined
  // only in the browser container.
  //
  // So, need to request https://prod.foo.redhat.com:1337/ without being able to resolve it!
  // This is hack, possibly incorrect SNI (would need to specify `servername` somewhere?),
  // but works.
  resources: [
    "https-get://localhost:1337/"
  ],
  headers: {
    Host: "prod.foo.redhat.com"
  },
};

waitOn(config)
  .then(() => {
    process.exit(0);
  })
  .catch(err => {
    if (err) {
      console.error(err)
    }
    process.exit(1);
  })
