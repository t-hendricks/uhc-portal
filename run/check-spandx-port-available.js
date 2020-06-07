#!/usr/bin/env node
// Exit with error if $SPANDX_PORT is taken.
// Similar to https://github.com/redhataccess/spandx/pull/52,
// useful until a fix trickles down to insights-proxy.

const porty = require("porty");

const spandx_port = parseInt(process.env.SPANDX_PORT, 10);

porty.test(spandx_port).then(available => {
  if(available) {
    console.log(`Port ${spandx_port} is available.`)
  } else {
    console.log(`ERROR: port ${spandx_port} is taken.`)
    process.exit(1)
  }
});
