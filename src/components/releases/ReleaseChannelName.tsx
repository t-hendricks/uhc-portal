import React from 'react';

type Props = { children: React.ReactNode };

const ReleaseChannelName = ({ children }: Props) => (
  <dt className="pf-c-description-list__term pf-u-mt-md">{children}</dt>
);

export default ReleaseChannelName;
