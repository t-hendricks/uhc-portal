import React from 'react';
import { shallow } from 'enzyme';
import { DropdownItem } from '@patternfly/react-core';

import { dropDownItems } from './ClusterActionsDropdownItems';
import * as Fixtures from './ClusterActionsDropdown.fixtures';

function DropDownItemsRenderHelper(props) {
  return (
    <>
      {dropDownItems(props).map(item => item)}
    </>
  );
}

describe('Cluster Actions Dropdown Items', () => {
  describe('cluster with state ready and console url', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = shallow(<DropDownItemsRenderHelper {...Fixtures.managedReadyProps} />);
    });

    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should open edit display name modal', () => {
      wrapper.find(DropdownItem).at(1).simulate('click');
      expect(Fixtures.managedReadyProps.openModal).toBeCalledWith('edit-display-name', Fixtures.cluster);
    });

    it('should open edit cluster modal', () => {
      wrapper.find(DropdownItem).at(2).simulate('click');
      expect(Fixtures.managedReadyProps.openModal).toBeCalledWith('edit-cluster', Fixtures.cluster);
    });

    it('should open edit node count modal', () => {
      wrapper.find(DropdownItem).at(3).simulate('click');
      expect(Fixtures.managedReadyProps.openModal).toBeCalledWith('edit-node-count', { cluster: Fixtures.cluster, isDefaultMachinePool: true });
    });

    it('should open hibernate cluster modal', () => {
      wrapper.find(DropdownItem).at(4).simulate('click');
      expect(Fixtures.managedReadyProps.openModal).toBeCalledWith('hibernate-cluster', Fixtures.hibernateClusterModalData);
    });

    it('should open delete modal', () => {
      wrapper.find(DropdownItem).at(5).simulate('click');
      expect(Fixtures.managedReadyProps.openModal).toBeCalledWith('delete-cluster', Fixtures.deleteModalData);
    });

    it('menu buttons should be enabled', () => {
      const actions = wrapper.find(DropdownItem).map(
        a => [a.props().title, a.props().isDisabled === true],
      );
      expect(actions).toEqual([
        ['Open console', false],
        ['Edit display name', false],
        ['Edit load balancers and persistent storage', false],
        ['Edit node count', false],
        ['Hibernate cluster', false],
        ['Delete cluster', false],
      ]);
    });

    describe('and product osdtrial', () => {
      beforeEach(() => {
        wrapper = shallow(<DropDownItemsRenderHelper {...Fixtures.managedReadyOsdTrialProps} />);
      });

      it('should render', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('should not find hibernate action', () => {
        wrapper.find(DropdownItem).forEach((item) => {
          expect(item.props().title).not.toEqual('Hibernate cluster');
        });
      });
    });
  });

  describe('cluster with state uninstalling', () => {
    const wrapper = shallow(<DropDownItemsRenderHelper
      {...Fixtures.clusterUninstallingProps}
    />);

    it('should render (uninstalling)', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('menu buttons should be disabled', () => {
      const actions = wrapper.find(DropdownItem).map(
        a => [a.props().title, a.props().isDisabled === true],
      );
      expect(actions).toEqual([
        ['Open console', true],
        ['Edit display name', true],
        ['Edit load balancers and persistent storage', true],
        ['Edit node count', true],
        ['Hibernate cluster', true],
        ['Delete cluster', true],
      ]);
    });
  });

  describe('cluster with state not ready', () => {
    const wrapper = shallow(<DropDownItemsRenderHelper {...Fixtures.clusterNotReadyProps} />);

    it('should render (not ready)', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('disable open console & edit cluster, enable edit display name and delete cluster', () => {
      const actions = wrapper.find(DropdownItem).map(
        a => [a.props().title, a.props().isDisabled === true],
      );
      expect(actions).toEqual([
        ['Open console', true],
        ['Edit display name', false],
        ['Edit load balancers and persistent storage', true],
        ['Edit node count', true],
        ['Hibernate cluster', true],
        ['Delete cluster', false],
      ]);
    });
  });

  describe('cluster state hibernating', () => {
    const wrapper = shallow(<DropDownItemsRenderHelper
      {...Fixtures.clusterHibernatingProps}
    />);

    it('should render (hibernating)', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('disable open console & edit cluster, enable edit display name and delete cluster', () => {
      const actions = wrapper.find(DropdownItem).map(
        a => [a.props().title, a.props().isDisabled === true],
      );
      expect(actions).toEqual([
        ['Open console', true],
        ['Edit display name', false],
        ['Edit load balancers and persistent storage', true],
        ['Edit node count', true],
        ['Resume from Hibernation', false],
        ['Delete cluster', true],
      ]);
    });
  });

  describe('cluster configuration_mode read_only', () => {
    const wrapper = shallow(<DropDownItemsRenderHelper
      {...Fixtures.clusterReadOnlyProps}
    />);

    it('should render (read_only)', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('disable provisioning actions, enable console and edit display name', () => {
      const actions = wrapper.find(DropdownItem).map(
        a => [a.props().title, a.props().isDisabled === true],
      );
      expect(actions).toEqual([
        ['Open console', false],
        ['Edit display name', false],
        ['Edit load balancers and persistent storage', true],
        ['Edit node count', true],
        ['Hibernate cluster', true],
        ['Delete cluster', true],
      ]);
    });
  });

  describe('self managed cluster', () => {
    const wrapper = shallow(<DropDownItemsRenderHelper {...Fixtures.selfManagedProps} />);

    it('should render (self managed)', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('admin console url does not exist', () => {
    const wrapper = shallow(<DropDownItemsRenderHelper {...Fixtures.selfManagedProps} />);

    it('should render (no console)', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
  describe('read only cluster', () => {
    const wrapper = shallow(<DropDownItemsRenderHelper {...Fixtures.organizationClusterProps} />);
    it('should render correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
