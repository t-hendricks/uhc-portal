import React from 'react';

import { render, screen } from '@testing-library/react';

import { usePreviousProps } from '../usePreviousProps'; // Adjust the import path as necessary

// Test component that uses the usePreviousProps hook
function TestComponent({ value }: any) {
  const previousValue = usePreviousProps(value);
  return (
    <div>
      Current: {value}, Previous: {previousValue}
    </div>
  );
}

describe('usePreviousProps hook', () => {
  it('should correctly remember the previous prop value', () => {
    const { rerender } = render(<TestComponent value="first" />);
    // Initially, there is no previous value, so it should be undefined
    expect(screen.getByText(/Current: first, Previous:/).textContent).toBe(
      'Current: first, Previous: ',
    );

    // Update the prop value
    rerender(<TestComponent value="second" />);
    // Now, the previous value should be the initial prop value
    expect(screen.getByText(/Current: second, Previous: first/).textContent).toBe(
      'Current: second, Previous: first',
    );

    // Update the prop value again
    rerender(<TestComponent value="third" />);
    // The previous value should update to the second prop value
    expect(screen.getByText(/Current: third, Previous: second/).textContent).toBe(
      'Current: third, Previous: second',
    );
  });
});
