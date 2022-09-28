import React from 'react';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';

import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import { store } from './redux/store';

const TestWrapper = ({ children }) => <Provider store={store}>{children}</Provider>;

TestWrapper.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
};

const customRender = (ui, options) => render(ui, { wrapper: TestWrapper, ...options });

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
export { customRender as render };
