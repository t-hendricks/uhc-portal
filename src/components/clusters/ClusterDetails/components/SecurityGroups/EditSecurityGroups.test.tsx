import * as React from 'react';

import { fireEvent, render, screen, within } from '~/testUtils';

import EditSecurityGroups from './EditSecurityGroups';

const persistedSecurityGroup = {
  id: 'sg-xyz',
  name: 'hello xyz',
};

const clusterVpc = {
  id: 'vpc-id',
  aws_security_groups: [
    {
      id: 'sg-abc',
      name: 'abc is my name',
    },
    {
      id: 'sg-group-without-a-name',
      name: '',
    },
    persistedSecurityGroup,
  ],
};

jest.mock(
  '~/components/clusters/CreateOSDPage/CreateOSDWizard/NetworkScreen/useAWSVPCFromCluster',
  () => ({
    useAWSVPCFromCluster: () => ({ clusterVpc, isFulfilled: true, isLoading: false }),
  }),
);

const openPFSecurityGroupsSelect = () => {
  // user.click doesn't work with PF dropdowns, so required to use fireEvent
  fireEvent.click(screen.getByRole('button', { name: 'Options menu' }));
};

const renderComponent = ({
  isReadOnly,
  selectedGroupIds,
}: {
  isReadOnly: boolean;
  selectedGroupIds: string[];
}) =>
  render(
    <EditSecurityGroups
      selectedGroupIds={selectedGroupIds}
      clusterVpc={clusterVpc}
      onChange={() => null}
      isReadOnly={isReadOnly}
    />,
  );

describe('<EditSecurityGroups />', () => {
  describe('In edit mode', () => {
    it('shows a list of read-only chips', () => {
      renderComponent({
        isReadOnly: true,
        selectedGroupIds: [persistedSecurityGroup.id],
      });

      const securityGroupItems = screen.getAllByRole('listitem');
      expect(within(securityGroupItems[0]).getByText('hello xyz')).toBeInTheDocument();
    });

    it('are shown as read-only when in editing mode', () => {
      renderComponent({
        isReadOnly: true,
        selectedGroupIds: [persistedSecurityGroup.id],
      });

      const securityGroupItems = screen.getAllByRole('listitem');
      expect(within(securityGroupItems[0]).getByText('hello xyz')).toBeInTheDocument();
    });

    it('does not show the Select component', () => {
      renderComponent({
        isReadOnly: true,
        selectedGroupIds: [],
      });

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('In creation mode', () => {
    it('shows a list of chips with a close button', () => {
      renderComponent({
        isReadOnly: false,
        selectedGroupIds: [persistedSecurityGroup.id],
      });

      const securityGroupChips = screen.getAllByRole('listitem');
      expect(
        within(securityGroupChips[0]).getByRole('button', { name: /close hello xyz/ }),
      ).toBeInTheDocument();
    });

    it('Has a Select showing all security groups', () => {
      renderComponent({
        isReadOnly: false,
        selectedGroupIds: [],
      });

      openPFSecurityGroupsSelect();

      expect(within(screen.getByRole('listbox')).getByText('sg-abc')).toBeInTheDocument();
      expect(within(screen.getByRole('listbox')).getByText('sg-xyz')).toBeInTheDocument();
    });

    it('Shows the name as empty and the id as the description if the group has no name', () => {
      renderComponent({
        isReadOnly: false,
        selectedGroupIds: [],
      });

      openPFSecurityGroupsSelect();

      expect(within(screen.getByRole('listbox')).getByText('--')).toBeInTheDocument();
      expect(
        within(screen.getByRole('listbox')).getByText('sg-group-without-a-name'),
      ).toBeInTheDocument();
    });

    it('Has a SelectOption with a checkbox for each security group with the correct selection status', () => {
      renderComponent({
        isReadOnly: false,
        selectedGroupIds: [persistedSecurityGroup.id],
      });

      openPFSecurityGroupsSelect();

      expect(
        within(screen.getByRole('listbox')).getByRole('checkbox', { name: /sg-abc/ }),
      ).not.toBeChecked();
      expect(
        within(screen.getByRole('listbox')).getByRole('checkbox', { name: /sg-xyz/ }),
      ).toBeChecked();
    });

    it('Clears the selected security groups when the VPC changes', () => {
      const onChangeSpy = jest.fn();
      const testProps = {
        selectedGroupIds: [],
        clusterVpc,
        onChange: onChangeSpy,
        isReadOnly: false,
      };

      // Render with the initial VPC, this will initially set the security groups to empty
      const { rerender } = render(<EditSecurityGroups {...testProps} />);
      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith([]);
      onChangeSpy.mockClear();

      // Re-render with the same VPC, the selected Security groups remains unchanged
      rerender(<EditSecurityGroups {...testProps} />);
      expect(onChangeSpy).not.toHaveBeenCalled();

      // Re-render with a different VPC, the selected Security groups are cleared
      rerender(
        <EditSecurityGroups
          {...testProps}
          clusterVpc={{ ...clusterVpc, id: 'the-vpc-has-changed' }}
        />,
      );
      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith([]);
    });
  });
});
