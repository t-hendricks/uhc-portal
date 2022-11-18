import React from 'react';
import PropTypes from 'prop-types';

import { RedoIcon } from '@patternfly/react-icons';
import { Tooltip, TooltipPosition, Button } from '@patternfly/react-core';

const shortTimerSeconds = 10;
const longTimerSeconds = 60;
const numberOfShortTries = 3;

// See https://overreacted.io/making-setinterval-declarative-with-react-hooks/
const useInterval = (callback, delay) => {
  const savedCallback = React.useRef();

  // Remember the latest callback.
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  React.useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }

    return null;
  }, [delay]);
};

const RefreshBtn = ({
  classOptions,
  refreshFunc,
  clickRefreshFunc,
  autoRefresh,
  isDisabled,
  ouiaId,
  useShortTimer,
}) => {
  const timerRef = React.useRef(null);
  const [shortTimerTries, setShortTimerTries] = React.useState(0);
  const [interValTime, setInterValTime] = React.useState(null);

  // Why use ref? See https://felixgerschau.com/react-hooks-settimeout/
  timerRef.current = useInterval(() => {
    if (interValTime === shortTimerSeconds) {
      if (shortTimerTries < numberOfShortTries - 1) {
        // there is a -1 because we are setting the interval after this attempt
        setShortTimerTries(shortTimerTries + 1);
      } else {
        setInterValTime(longTimerSeconds);
        setShortTimerTries(0);
      }
    }

    refreshTimer();
  }, interValTime * 1000);

  React.useEffect(
    () => () => {
      clearTimeout(timerRef.current);
    },
    [],
  );

  React.useEffect(() => {
    setInterValTime(useShortTimer ? shortTimerSeconds : longTimerSeconds);
  }, [useShortTimer]);

  const refreshTimer = () => {
    // autoRefresh check allows refresh to be turned off or on during the lifetime of the component
    // visibilityState checks allows avoiding refreshes when the tab is not visible
    // "online" state check allows to avoid refreshes when the network is offline.
    if (autoRefresh && document.visibilityState === 'visible' && navigator.onLine && !isDisabled) {
      refreshFunc();
    }
  };

  return (
    <Tooltip position={TooltipPosition.bottom} content="Refresh">
      <Button
        variant="plain"
        aria-label="Refresh"
        className={classOptions}
        onClick={clickRefreshFunc || refreshFunc}
        isAriaDisabled={isDisabled}
        ouiaId={ouiaId}
      >
        <RedoIcon />
      </Button>
    </Tooltip>
  );
};

RefreshBtn.propTypes = {
  classOptions: PropTypes.string,
  refreshFunc: PropTypes.func.isRequired,
  clickRefreshFunc: PropTypes.func,
  autoRefresh: PropTypes.bool,
  isDisabled: PropTypes.bool,
  ouiaId: PropTypes.string,
  useShortTimer: PropTypes.bool,
};

RefreshBtn.defaultProps = {
  classOptions: '',
  useShortTimer: false,
};

export default RefreshBtn;
