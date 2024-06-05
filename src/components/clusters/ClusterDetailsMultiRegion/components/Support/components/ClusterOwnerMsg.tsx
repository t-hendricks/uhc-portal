import React from 'react';

type ClusterOwnerMsgProps = {
  email?: string;
};

const ClusterOwnerMsg = ({ email }: ClusterOwnerMsgProps) =>
  email ? (
    <>
      <br />
      The cluster owner will always receive notifications, at email address &lt;{email}&gt; , in
      addition to this list of notification contacts.
    </>
  ) : null;

export default ClusterOwnerMsg;
