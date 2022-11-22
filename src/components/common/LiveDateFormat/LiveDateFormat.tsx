import React from 'react';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';

type Props = {
  timestamp: number;
};

const LiveDateFormat = ({ timestamp }: Props) => {
  // use state to trigger an update on a set interval
  const [, triggerUpdate] = React.useState(0);
  React.useEffect(() => {
    // use Date.now() to set a new state value
    const timer = setInterval(() => triggerUpdate(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  return <DateFormat type="relative" date={timestamp} />;
};

export default LiveDateFormat;
