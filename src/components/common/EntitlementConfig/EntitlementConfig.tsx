import React from 'react';

type Props = { fulfilled?: boolean; pending?: boolean; createRosaEntitlement: () => void };
const EntitlementConfig = ({ fulfilled, pending, createRosaEntitlement }: Props) => {
  React.useEffect(() => {
    if (!fulfilled && !pending) {
      createRosaEntitlement();
    }
    // only run once on mount
  }, []);

  return null;
};

export default EntitlementConfig;
