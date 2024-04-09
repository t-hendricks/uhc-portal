import React from 'react';

import { render, screen, within } from '~/testUtils';

import SupportStatus from './SupportStatus';

const statuses = [
  [
    'Full support',
    {
      text: 'Full support',
      popover: 'This minor version of OpenShift is fully supported.',
    },
  ],
  [
    'Maintenance support',
    {
      text: 'Maintenance support',
      popover: 'This minor version of OpenShift has reached the maintenance support phase.',
    },
  ],
  [
    'Extended update support',
    {
      text: 'Extended update support',
      popover: 'This minor version of OpenShift has reached the extended update support phase.',
    },
  ],
  [
    'End of life',
    {
      text: 'End of life',
      popover: 'This minor version of OpenShift has reached the end of life',
    },
  ],
];

describe('<SupportStatus />', () => {
  // @ts-ignore
  it.each<[status: string, content: { text: string; popover: string }]>(statuses)(
    'displays popover content for %s',
    async (status, { text, popover }) => {
      const { user } = render(<SupportStatus status={status} />);
      expect(screen.getByText(text)).toBeInTheDocument();

      await user.click(screen.getByRole('button'));
      expect(await screen.findByRole('dialog')).toBeInTheDocument();
      expect(
        within(screen.getByRole('dialog')).getByText(popover, { exact: false }),
      ).toBeInTheDocument();
    },
  );

  it('displays a simple label without popover when status is unknown', () => {
    render(<SupportStatus status="Unknown status" />);
    expect(screen.getByText('Unknown status')).toBeInTheDocument();

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
