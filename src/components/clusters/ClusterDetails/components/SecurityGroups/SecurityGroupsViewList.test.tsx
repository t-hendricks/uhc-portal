import * as React from 'react';
import { render, screen, within } from '~/testUtils';
import SecurityGroupsViewList from './SecurityGroupsViewList';

const securityGroups = [
  { id: 'sg-a', name: 'sg-a-name' },
  { id: 'sg-without-name', name: '' },
  { id: 'sg-b', name: 'sg-b-name' },
];

describe('<SecurityGroupsViewList />', () => {
  describe('with empty security groups', () => {
    it('returns no content if there is no empty message', () => {
      const { container } = render(
        <SecurityGroupsViewList securityGroups={[]} isReadOnly={false} emptyMessage="" />,
      );
      expect(container).toBeEmptyDOMElement();
    });

    it('shows the empty message when provided one', () => {
      const emptyMessage = 'The empty message should appear';
      render(
        <SecurityGroupsViewList
          securityGroups={[]}
          isReadOnly={false}
          emptyMessage={emptyMessage}
        />,
      );
      expect(screen.getByText(emptyMessage)).toBeInTheDocument();
    });
  });

  describe('with a read-only list of security groups', () => {
    it('renders each security group', () => {
      render(<SecurityGroupsViewList securityGroups={securityGroups} isReadOnly />);

      const securityGroupItems = screen.getAllByRole('listitem');
      expect(within(securityGroupItems[0]).getByText('sg-a-name')).toBeInTheDocument();
      expect(within(securityGroupItems[1]).getByText('sg-without-name')).toBeInTheDocument();
      expect(within(securityGroupItems[2]).getByText('sg-b-name')).toBeInTheDocument();
    });

    it('does not show a "close" button on the security groups', () => {
      render(<SecurityGroupsViewList securityGroups={securityGroups} isReadOnly />);

      expect(
        screen.queryByRole('button', {
          name: /close/i,
        }),
      ).not.toBeInTheDocument();
    });
  });

  describe('with an editable list of security groups', () => {
    it('renders each security group with a close button', () => {
      render(<SecurityGroupsViewList securityGroups={securityGroups} isReadOnly={false} />);

      const securityGroupItems = screen.getAllByRole('listitem');
      expect(
        within(securityGroupItems[0]).getByRole('button', { name: /close sg-a-name/ }),
      ).toBeInTheDocument();
      expect(
        within(securityGroupItems[1]).getByRole('button', { name: /close sg-without-name/ }),
      ).toBeInTheDocument();
      expect(
        within(securityGroupItems[2]).getByRole('button', { name: /close sg-b-name/ }),
      ).toBeInTheDocument();
    });

    it('calls "onClickItem" with the group ID when the "close" button is clicked', async () => {
      const onClickSpy = jest.fn();
      const { user } = render(
        <SecurityGroupsViewList
          securityGroups={securityGroups}
          isReadOnly={false}
          onClickItem={onClickSpy}
        />,
      );

      await user.click(screen.getByRole('button', { name: /close sg-without-name/ }));
      expect(onClickSpy).toHaveBeenCalledWith('sg-without-name');
    });
  });
});
