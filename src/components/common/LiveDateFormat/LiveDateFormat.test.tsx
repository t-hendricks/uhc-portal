import React from 'react';

import { screen, render } from '~/testUtils';
import LiveDateFormat from './LiveDateFormat';

describe('<LiveDateFormat />', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('1 Jan 2021 00:00:00 GMT').getTime());
  });

  it('displays "just now" on initial render', () => {
    render(<LiveDateFormat timestamp={Date.now()} />);
    expect(screen.getByText('Just now')).toBeInTheDocument();
  });

  afterAll(() => {
    jest.useRealTimers();
  });
});
