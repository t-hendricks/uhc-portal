import React from 'react';

import { render, screen } from '~/testUtils';

import withAnalytics from '../withAnalytics';

describe('withAnalytics', () => {
  const AnalyticsContext = withAnalytics(() => <div data-testid="myContainer">test</div>);

  it('display child', () => {
    render(<AnalyticsContext />);
    expect(screen.getByTestId('myContainer')).toHaveTextContent('test');
  });
});
