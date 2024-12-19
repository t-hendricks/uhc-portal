import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import { AccessRequestState } from '../../model/AccessRequestState';
import AccessRequestStateIcon from '../AccessRequestStateIcon';

jest.mock('@patternfly/react-core', () => ({
  Label: ({ color, icon, children }: { color: string; icon?: React.ReactNode; children: any }) => (
    <div data-testid="label-mock" style={{ color: color ?? 'undefined' }}>
      {children}
      {icon}
    </div>
  ),
}));

jest.mock('@patternfly/react-icons/dist/esm/icons/check-circle-icon', () => ({
  CheckCircleIcon: () => <div>check-circle-icon</div>,
}));
jest.mock('@patternfly/react-icons/dist/esm/icons/outlined-clock-icon', () => ({
  OutlinedClockIcon: () => <div>outlined-clock-icon</div>,
}));
jest.mock('@patternfly/react-icons/dist/esm/icons/times-circle-icon', () => ({
  TimesCircleIcon: () => <div>times-circle-icon</div>,
}));
jest.mock('@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon', () => ({
  ExclamationTriangleIcon: () => <div>exclamation-triangle-icon</div>,
}));

describe('AccessRequestStateIcon', () => {
  it('empty content', () => {
    render(
      <div data-testid="parent-div">
        <AccessRequestStateIcon />
      </div>,
    );
    expect(screen.getByTestId('parent-div').children.length).toBe(0);
  });

  it('is accessible', async () => {
    const { container } = render(
      <AccessRequestStateIcon accessRequest={{ status: { state: AccessRequestState.APPROVED } }} />,
    );
    await checkAccessibility(container);
  });

  describe('renders proper state for different states', () => {
    it.each([
      [AccessRequestState.APPROVED, 'green', 'check-circle-icon'],
      [AccessRequestState.DENIED, 'red', 'times-circle-icon'],
      [AccessRequestState.EXPIRED, 'undefined', 'outlined-clock-icon'],
      [AccessRequestState.PENDING, 'orange', 'exclamation-triangle-icon'],
    ])(
      '"%s" state',
      (state: AccessRequestState, expectedColor: string, expectedIconName: string) => {
        // Act
        render(<AccessRequestStateIcon accessRequest={{ status: { state } }} />);

        // Assert
        expect(screen.getByText(new RegExp(state, 'i'))).toHaveStyle(`color: ${expectedColor}`);
        expect(screen.getByText(new RegExp(expectedIconName, 'i'))).toBeInTheDocument();
      },
    );
  });
});
