import { clusterService } from '~/services';

import {
  clearUpdateDeleteProtection,
  deleteProtectionConstants,
  updateDeleteProtection,
} from '../deleteProtectionActions';

jest.mock('~/services', () => ({
  clusterService: {
    updateDeleteProtection: jest.fn(),
  },
}));

describe('deleteProtection actions', () => {
  it('update action dispatches successfully', () => {
    const returnValue = {
      enabled: false,
      href: '/api/clusters_mgmt/v1/clusters/fake-cluster/delete_protection',
    };
    // Arrange
    (clusterService.updateDeleteProtection as jest.Mock).mockReturnValueOnce(returnValue);

    // Act
    const updateAction = updateDeleteProtection('fake-cluster', true);

    // Assert
    expect(updateAction).toEqual({
      type: deleteProtectionConstants.UPDATE_DELETE_PROTECTION,
      payload: returnValue,
    });
  });

  it('clear action dispatches successfully', () => {
    // Act
    const clearAction = clearUpdateDeleteProtection();

    // Assert
    expect(clearAction).toEqual({
      type: deleteProtectionConstants.CLEAR_UPDATE_DELETE_PROTECTION_RESPONSE,
    });
  });
});
