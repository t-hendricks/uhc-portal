import { setAutoFreeze } from 'immer';
import { sprintf } from 'sprintf-js';
import config from './config';

// Mock apiRequest for all tests
jest.mock('~/services/apiRequest');

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

  error(msg, ...args); // Even if we going to throw below, it's useful to log *full* args.

  if (text.includes('Maximum update depth exceeded')) {
    throw text;
  }

  if (text.match(/Failed prop type|type .+ is invalid/)) {
    // TODO: HAC-4934 // throw text;
  }
};

global.insights = {};

config.dateConfig();
