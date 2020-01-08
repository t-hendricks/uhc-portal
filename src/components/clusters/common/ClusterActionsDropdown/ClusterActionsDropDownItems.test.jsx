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
    beforeAll(() => {
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

    it('should open delete modal', () => {
      wrapper.find(DropdownItem).at(3).simulate('click');
      expect(Fixtures.managedReadyProps.openModal).toBeCalledWith('delete-cluster', Fixtures.deleteModalData);
    });

    it('menu buttons should be enabled', () => {
      const launchConsoleDisabled = wrapper.find(DropdownItem).at(0).props().isDisabled;
      const editDisplayNameDisabled = wrapper.find(DropdownItem).at(1).props().isDisabled;
      const editDisabled = wrapper.find(DropdownItem).at(2).props().isDisabled;
      const deleteDisabled = wrapper.find(DropdownItem).at(3).props().isDisabled;
      expect(launchConsoleDisabled).toBeFalsy();
      expect(editDisplayNameDisabled).toBeFalsy();
      expect(editDisabled).toBeFalsy();
      expect(deleteDisabled).toBeFalsy();
    });
  });

  describe('cluster with state uninstalling', () => {
    const wrapper = shallow(<DropDownItemsRenderHelper {...Fixtures.clusterUninstallingProps} />);

    it('should render (uninstalling)', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('menu buttons should be disabled', () => {
      const launchConsoleDisabled = wrapper.find(DropdownItem).at(0).props().isDisabled;
      const editDisplayNameDisabled = wrapper.find(DropdownItem).at(1).props().isDisabled;
      const editDisabled = wrapper.find(DropdownItem).at(2).props().isDisabled;
      const deleteDisabled = wrapper.find(DropdownItem).at(3).props().isDisabled;
      expect(launchConsoleDisabled).toEqual(true);
      expect(editDisplayNameDisabled).toEqual(true);
      expect(editDisabled).toEqual(true);
      expect(deleteDisabled).toEqual(true);
    });
  });

  describe('cluster with state not ready', () => {
    const wrapper = shallow(<DropDownItemsRenderHelper {...Fixtures.clusterNotReadyProps} />);

    it('should render (not ready)', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('disable launch console & edit cluster, enable edit display name and delete cluster', () => {
      const launchConsoleDisabled = wrapper.find(DropdownItem).at(0).props().isDisabled;
      const editDisplayNameDisabled = wrapper.find(DropdownItem).at(1).props().isDisabled;
      const editDisabled = wrapper.find(DropdownItem).at(2).props().isDisabled;
      const deleteDisabled = wrapper.find(DropdownItem).at(3).props().isDisabled;
      expect(launchConsoleDisabled).toEqual(true);
      expect(editDisplayNameDisabled).toBeFalsy();
      expect(editDisabled).toEqual(true);
      expect(deleteDisabled).toBeFalsy();
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
