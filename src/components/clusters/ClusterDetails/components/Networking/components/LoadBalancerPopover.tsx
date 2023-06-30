import React from 'react';
import links from '~/common/installLinks.mjs';
import ExternalLink from '~/components/common/ExternalLink';
import PopoverHint from '~/components/common/PopoverHint';

const LoadBalancerPopover = () => (
  <PopoverHint
    title="Load Balancers"
    maxWidth="30rem"
    hint={
      <div>
        Load balancers automatically distribute your incoming traffic to multiple servers. If you
        need features such as static IP, source IP address preservation and other features
        documented by AWS, we recommend using the Network Load Balancer. If you are using
        EC2-Classic Network, we recommend using Classic.{' '}
        <ExternalLink href={links.AWS_LOAD_BALANCER_FEATURES}>
          Learn more about AWS load balancers.
        </ExternalLink>
      </div>
    }
  />
);

export default LoadBalancerPopover;
