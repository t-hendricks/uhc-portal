import React from 'react';
import * as Sentry from '@sentry/browser';

import { DemoExperience, DemoExperienceStatusEnum } from './DemoExperienceModels';
import demoExperienceService from './demoExperienceService';

const POLLING_INTERVAL = 30000;

const useDemoExperiencePolling = (): {
  demoExperience: DemoExperience;
  initializing: boolean;
  initializeError: unknown;
  restartPolling: (demoExperience: DemoExperience) => void;
} => {
  const [demoExperience, setDemoExperience] = React.useState<DemoExperience>({} as DemoExperience);
  const [initializing, setInitializing] = React.useState<boolean>(false);
  const [initializeError, setInitializeError] = React.useState<unknown>();
  const [intervalId, setIntervalId] = React.useState<number | null>(null);
  const pollingErrorCounter = React.useRef<number>(0);
  const shouldStopPolling = (demoExperience?: DemoExperience) =>
    demoExperience?.status === DemoExperienceStatusEnum.Available ||
    demoExperience?.status === DemoExperienceStatusEnum.Failed ||
    demoExperience?.status === DemoExperienceStatusEnum.Unavailable;

  const fetchDemoExperience = async (): Promise<DemoExperience | undefined> => {
    try {
      const response = await demoExperienceService.getDemoExperience();
      setDemoExperience(response.data);
      return response.data;
    } catch (err) {
      setInitializeError(err);
    }
    return undefined;
  };

  const stopPolling = () => {
    if (intervalId) {
      window.clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  const startPolling = async () => {
    const id = window.setInterval(async () => {
      try {
        const demoExperience = await fetchDemoExperience();
        if (shouldStopPolling(demoExperience)) {
          stopPolling();
        }
      } catch (err) {
        if (pollingErrorCounter.current === 0) {
          Sentry.captureException(err);
        }
        pollingErrorCounter.current += 1;
      }
    }, POLLING_INTERVAL);
    setIntervalId(id);
  };

  const initialize = async () => {
    setInitializing(true);
    try {
      const { data: demoExperience } = await demoExperienceService.getDemoExperience();
      setDemoExperience(demoExperience);
      if (!shouldStopPolling(demoExperience)) {
        startPolling();
      }
    } catch (err) {
      Sentry.captureException(err);
      setInitializeError(err);
    } finally {
      setInitializing(false);
    }
  };

  const restartPolling = (demoExperience: DemoExperience) => {
    setDemoExperience(demoExperience);
    stopPolling();
    startPolling();
  };

  React.useEffect(() => {
    initialize();
    return () => stopPolling();
  }, []);

  return { demoExperience, initializing, initializeError, restartPolling };
};

export default useDemoExperiencePolling;
