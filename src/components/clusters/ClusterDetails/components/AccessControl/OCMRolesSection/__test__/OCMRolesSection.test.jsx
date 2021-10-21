import React from 'react';
import { mount } from 'enzyme';

import { OCMRoles } from './OCMRolesSection.fixture';
import OCMRolesSection from '../OCMRolesSection';

import fixtures from '../../../../__test__/ClusterDetails.fixtures';

describe('<OCMRolesSection />', () => {
  const getOCMRoles = jest.fn();
  const props = {
    subscription: fixtures.clusterDetails.cluster.subscription,
    canEditOCMRoles: true,
    canViewOCMRoles: true,
    canGrantClusterViewer: false,
    isOCMRolesDialogOpen: false,
    openModal: jest.fn(),
    closeModal: jest.fn(),
    modalData: {},
    getOCMRoles,
    grantOCMRole: jest.fn(),
    editOCMRole: jest.fn(),
    deleteOCMRole: jest.fn(),
    getOCMRolesResponse: OCMRoles,
    grantOCMRoleResponse: {},
    editOCMRoleResponse: {},
    deleteOCMRoleResponse: {},
    clearGetOCMRolesResponse: jest.fn(),
    clearGrantOCMRoleResponse: jest.fn(),
    clearEditOCMRoleResponse: jest.fn(),
    clearDeleteOCMRoleResponse: jest.fn(),
  };

  it('should render', () => {
    const wrapper = mount(<OCMRolesSection {...props} />);
    expect(wrapper).toMatchSnapshot();
    expect(getOCMRoles).toHaveBeenCalled();
    expect(wrapper.find('ButtonWithTooltip').length).toBe(1);
    expect(wrapper.find('Table').length).toBe(1);
  });

  describe('it should render error', () => {
    const errorResp = {
      error: 'Error',
      errorMessage: 'Account with ID 123456 denied access to perform list on RoleBindings',
    };
    const wrapper = mount(<OCMRolesSection {...props} getOCMRolesResponse={errorResp} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('ErrorBox').length).toBe(1);
  });
});
