import React from 'react';
import { shallow } from 'enzyme';

import ClusterActionsDropdown from './ClusterActionsDropdown';
import * as Fixtures from './ClusterActionsDropdown.fixtures';

describe('<ClusterActionsDropdown />', () => {
  describe('cluster with state ready and console url', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = shallow(<ClusterActionsDropdown {...Fixtures.managedReadyProps} />);
    });

    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('cluster with state uninstalling', () => {
    const wrapper = shallow(<ClusterActionsDropdown {...Fixtures.clusterUninstallingProps} />);

    it('should render (uninstalling)', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('cluster with state not ready', () => {
    const wrapper = shallow(<ClusterActionsDropdown {...Fixtures.clusterNotReadyProps} />);

    it('should render (not ready)', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('self managed cluster', () => {
    const wrapper = shallow(<ClusterActionsDropdown {...Fixtures.selfManagedProps} />);

    it('should render (self managed)', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('admin console url does not exist', () => {
    const wrapper = shallow(<ClusterActionsDropdown {...Fixtures.selfManagedProps} />);

    it('should render (no console)', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
  describe('read only cluster', () => {
    const wrapper = shallow(<ClusterActionsDropdown {...Fixtures.organizationClusterProps} />);
    it('should render correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
