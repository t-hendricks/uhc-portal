import * as React from 'react';
import { Formik } from 'formik';

import { Cluster } from '~/types/clusters_mgmt.v1';
import { fireEvent, render, screen, within } from '~/testUtils';
import { FieldId } from '~/components/clusters/wizards/common';
import EditSecurityGroups from './EditSecurityGroups';

const persistedSecurityGroup = {
  id: 'sg-xyz',
  name: 'hello xyz',
};

const clusterVpc = {
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
const fakeCluster = { id: 'my-cluster-id' } as Cluster;

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
  isEdit,
  selectedGroupIds,
}: {
  isEdit: boolean;
  selectedGroupIds: string[];
}) =>
  render(
    <Formik
      initialValues={{
        [FieldId.SecurityGroupIds]: selectedGroupIds,
      }}
      onSubmit={() => {}}
    >
      <EditSecurityGroups cluster={fakeCluster} isEdit={isEdit} />
    </Formik>,
  );

describe('<EditSecurityGroups />', () => {
  describe('In edit mode', () => {
    it('shows a list of read-only chips', () => {
      renderComponent({
        isEdit: true,
        selectedGroupIds: [persistedSecurityGroup.id],
      });

      const securityGroupItems = screen.getAllByRole('listitem');
      expect(within(securityGroupItems[0]).getByText('hello xyz')).toBeInTheDocument();
    });

    it('are shown as read-only when in editing mode', () => {
      renderComponent({
        isEdit: true,
        selectedGroupIds: [persistedSecurityGroup.id],
      });

      const securityGroupItems = screen.getAllByRole('listitem');
      expect(within(securityGroupItems[0]).getByText('hello xyz')).toBeInTheDocument();
    });

    it('does not show the Select component', () => {
      renderComponent({
        isEdit: true,
        selectedGroupIds: [],
      });

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('In creation mode', () => {
    it('shows a list of chips with a close button', () => {
      renderComponent({
        isEdit: false,
        selectedGroupIds: [persistedSecurityGroup.id],
      });

      const securityGroupChips = screen.getAllByRole('listitem');
      expect(
        within(securityGroupChips[0]).getByRole('button', { name: /close hello xyz/ }),
      ).toBeInTheDocument();
    });

    it('Has a Select showing all security groups', () => {
      renderComponent({
        isEdit: false,
        selectedGroupIds: [],
      });

      openPFSecurityGroupsSelect();

      expect(within(screen.getByRole('listbox')).getByText('sg-abc')).toBeInTheDocument();
      expect(within(screen.getByRole('listbox')).getByText('sg-xyz')).toBeInTheDocument();
      expect(
        within(screen.getByRole('listbox')).getByText('sg-group-without-a-name'),
      ).toBeInTheDocument();
    });

    it('Has a SelectOption with a checkbox for each security group with the correct selection status', () => {
      renderComponent({
        isEdit: false,
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
  });
});
