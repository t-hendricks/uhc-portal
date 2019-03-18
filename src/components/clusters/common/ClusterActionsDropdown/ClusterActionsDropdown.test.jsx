import React from 'react';
import { shallow } from 'enzyme';

import ClusterActionsDropdown from './ClusterActionsDropdown';
import * as Fixtures from './ClusterActionsDropdown.fixtures';

describe('<ClusterActionsDropdown />', () => {
  describe('cluster with state ready and console url', () => {
    let wrapper;
    beforeAll(() => {
      wrapper = shallow(<ClusterActionsDropdown {...Fixtures.managedReadyProps} />);
    });

    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should open edit display name modal', () => {
      wrapper.find('MenuItem').at(1).simulate('click');
      expect(Fixtures.managedReadyProps.openModal).toBeCalledWith('edit-display-name', Fixtures.cluster);
    });

    it('should open edit cluster modal', () => {
      wrapper.find('MenuItem').at(2).simulate('click');
      expect(Fixtures.managedReadyProps.openModal).toBeCalledWith('edit-cluster', Fixtures.cluster);
    });

    it('should open delete modal', () => {
      wrapper.find('MenuItem').at(3).simulate('click');
      expect(Fixtures.managedReadyProps.openModal).toBeCalledWith('delete-cluster', Fixtures.deleteModalData);
    });

    it('menu buttons should be enabled', () => {
      const launchConsoleDisabled = wrapper.find('MenuItem').at(0).props().disabled;
      const editDisplayNameDisabled = wrapper.find('MenuItem').at(1).props().disabled;
      const editDisabled = wrapper.find('MenuItem').at(2).props().disabled;
      const deleteDisabled = wrapper.find('MenuItem').at(3).props().disabled;
      expect(launchConsoleDisabled).toEqual(false);
      expect(editDisplayNameDisabled).toEqual(false);
      expect(editDisabled).toEqual(false);
      expect(deleteDisabled).toEqual(false);
    });
  });

  describe('cluster with state uninstalling', () => {
    const wrapper = shallow(<ClusterActionsDropdown {...Fixtures.clusterUninstallingProps} />);

    it('menu buttons should be disabled', () => {
      const launchConsoleDisabled = wrapper.find('MenuItem').at(0).props().disabled;
      const editDisplayNameDisabled = wrapper.find('MenuItem').at(1).props().disabled;
      const editDisabled = wrapper.find('MenuItem').at(2).props().disabled;
      const deleteDisabled = wrapper.find('MenuItem').at(3).props().disabled;
      expect(launchConsoleDisabled).toEqual(true);
      expect(editDisplayNameDisabled).toEqual(true);
      expect(editDisabled).toEqual(true);
      expect(deleteDisabled).toEqual(true);
    });
  });

  describe('cluster with state not ready', () => {
    const wrapper = shallow(<ClusterActionsDropdown {...Fixtures.clusterNotReadyProps} />);

    it('disable launch console & edit cluster, enable edit display name and delete cluster', () => {
      const launchConsoleDisabled = wrapper.find('MenuItem').at(0).props().disabled;
      const editDisplayNameDisabled = wrapper.find('MenuItem').at(1).props().disabled;
      const editDisabled = wrapper.find('MenuItem').at(2).props().disabled;
      const deleteDisabled = wrapper.find('MenuItem').at(3).props().disabled;
      expect(launchConsoleDisabled).toEqual(true);
      expect(editDisplayNameDisabled).toEqual(false);
      expect(editDisabled).toEqual(true);
      expect(deleteDisabled).toEqual(false);
    });
  });

  describe('self managed cluster', () => {
    const wrapper = shallow(<ClusterActionsDropdown {...Fixtures.selfManagedProps} />);

    it('edit cluster should be disabled', () => {
      const editDisabled = wrapper.find('MenuItem').at(2).props().disabled;
      expect(editDisabled).toEqual(true);
    });
  });

  describe('admin console url does not exist', () => {
    const wrapper = shallow(<ClusterActionsDropdown {...Fixtures.selfManagedProps} />);

    it('launch admin console should be disabled', () => {
      const launchConsoleDisabled = wrapper.find('MenuItem').at(2).props().disabled;
      expect(launchConsoleDisabled).toEqual(true);
    });
  });
});
