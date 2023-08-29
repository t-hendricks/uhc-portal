import React from 'react';
import PopoverHint from '~/components/common/PopoverHint';

export const RouteSelectorsHelpText =
  "Optional list of routes to be exposed. If no selector is specified, all routes will be exposed. Format is a comma-separated list of 'key=value'.";

export const RouteSelectorsPopover = () => (
  <PopoverHint
    title="Router selector"
    maxWidth="30rem"
    hint={
      <div>
        Exclude routes from the default ingress controller matching a key=value selector. If no
        selector is specified, all routes will be exposed. Format should be a comma-separated list
        of &quot;key=value&quot;, where the &quot;value&quot; is optional.
      </div>
    }
  />
);
