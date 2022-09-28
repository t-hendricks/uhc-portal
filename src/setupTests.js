import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { setAutoFreeze } from 'immer';
import * as useChromeHook from '@redhat-cloud-services/frontend-components/useChrome';

setAutoFreeze(false);
if (!process.env.LISTENING_TO_UNHANDLED_REJECTION) {
  process.on('unhandledRejection', () => {});
  process.env.LISTENING_TO_UNHANDLED_REJECTION = true;
}

// These tests have warnings but don't cause test failure
const testsExcludedFromWarningFail = [
  'Router.test.jsx',
  'Insights.test.jsx',
  'ReduxFormKeyValueList.test',
  'ReduxFormTaints.test',
  // TODO: Fix the warnings in this test
  'UpdateGraph.test.jsx',
];

// Warnings are printed with console.error
// Fail tests with proptypes warnings if not in the excluded list
const { error } = console;
// eslint-disable-next-line no-console
console.error = (...args) => {
  const { testPath } = expect.getState();
  if (testsExcludedFromWarningFail.some((v) => testPath.includes(v))) {
    error(args[0]); // keep default behaviour
    return;
  }

  if (args[0].includes('Failed prop type:')) {
    throw args[0] instanceof Error ? args[0] : new Error(args[0]);
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

configure({ adapter: new Adapter() });
