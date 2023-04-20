import React from 'react';
import { Provider } from 'react-redux';
import { render, RenderOptions } from '@testing-library/react';
import '@testing-library/jest-dom';

import { toHaveNoViolations } from 'jest-axe';
import { store } from './redux/store';

expect.extend(toHaveNoViolations);

export const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>{children}</Provider>
);

const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, 'queries'>) =>
  render(ui, { wrapper: TestWrapper, ...options });

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
export { customRender as render };

export { axe } from 'jest-axe';
