import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { setAutoFreeze } from 'immer';
import { sprintf } from 'sprintf-js';
import * as useChromeHook from '@redhat-cloud-services/frontend-components/useChrome';

setAutoFreeze(false);
if (!process.env.LISTENING_TO_UNHANDLED_REJECTION) {
  process.on('unhandledRejection', () => {});
  process.env.LISTENING_TO_UNHANDLED_REJECTION = 'true';
}

// Warnings are printed with console.error.
// - TODO: Fail tests with proptypes warnings.
// - Fail on "Maximum update depth exceeded" because infinite loops are nasty in CI.
const { error } = console;
// eslint-disable-next-line no-console
console.error = (msg, ...args) => {
  const text =
    typeof msg === 'string' ? sprintf(msg, ...args) : [msg, ...args].map(String).join(' ');

  if (text.includes('https://reactjs.org/link/switch-to-createroot')) {
    // This is logged by all uses of enzyme.mount() (HAC-4456) and is too verbose.
    // eslint-disable-next-line no-console
    console.log(`[downgraded console.error] ${msg}`, ...args);
  } else {
    error(msg, ...args); // Even if we going to throw below, it's useful to log *full* args.
  }

  if (text.includes('Maximum update depth exceeded')) {
    throw text;
  }

  if (text.match(/Failed prop type|type .+ is invalid/)) {
    // TODO: HAC-4934 // throw text;
  }
};

// global mock for useChrome
const useChromeSpy = jest.spyOn(useChromeHook, 'default');
const mockSetPageMetadata = jest.fn();
useChromeSpy.mockImplementation(() => ({
  segment: {
    setPageMetadata: mockSetPageMetadata,
  },
}));

global.insights = {
  chrome: {
    ...window.insights?.chrome,
    getEnvironment: window.insights?.chrome?.getEnvironment || (() => ''),
  },
};

configure({ adapter: new Adapter() });
