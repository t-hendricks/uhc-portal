import { userActions } from './userActions';
import { accountsService } from '../../services';

jest.mock('../../services/accountsService.js');

describe('clustersActions', () => {
  describe('getOrganizationAndQuota', () => {
    it('calls accountsService.getCurrentAccount', () => {
      userActions.getOrganizationAndQuota();
      expect(accountsService.getCurrentAccount).toBeCalled();
    });

    it('calls accountsService.getOrganization', () => {
      userActions.getOrganizationAndQuota();
      expect(accountsService.getOrganization).toBeCalled();
    });
  });
});
