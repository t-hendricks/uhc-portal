import React from 'react';

type Props = { children: React.ReactNode };

const ReleaseChannelName = ({ children }: Props) => (
  <dt className="pf-v5-c-description-list__term pf-v5-u-mt-md">{children}</dt>
);

export default ReleaseChannelName;
