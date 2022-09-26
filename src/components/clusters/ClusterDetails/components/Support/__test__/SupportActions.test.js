import { accountsService } from '../../../../../../services';
import SupportActions, { SupportConstants } from '../SupportActions';
import { INVALIDATE_ACTION } from '../../../../../../redux/reduxHelpers';

jest.mock('../../../../../../services/accountsService');

describe('SupportActions', () => {
  let mockDispatch;
  beforeEach(() => {
    mockDispatch = jest.fn();
  });

  describe('getNotificationContacts', () => {
    it('dispatches successfully', () => {
      const result = SupportActions.getNotificationContacts('cluster id');
      expect(result).toEqual({
        payload: expect.anything(),
        type: SupportConstants.GET_NOTIFICATION_CONTACTS,
        meta: {
          subscriptionID: 'cluster id',
        },
      });
    });
    it('calls accountsService.getNotificationContacts', () => {
      SupportActions.getNotificationContacts('cluster id');
      expect(accountsService.getNotificationContacts).toBeCalledWith('cluster id');
    });
  });

  describe('addNotificationContact', () => {
    it('dispatches successfully', () => {
      SupportActions.addNotificationContact('cluster id', 'username')(mockDispatch);
      expect(mockDispatch).toBeCalledWith({
        payload: expect.anything(),
        type: SupportConstants.ADD_NOTIFICATION_CONTACT,
      });
    });
    it('calls accountsService.addNotificationContact', () => {
      SupportActions.addNotificationContact('cluster id', 'username')(mockDispatch);
      expect(accountsService.addNotificationContact).toBeCalledWith('cluster id', 'username');
    });
  });

  describe('deleteNotificationContact', () => {
    it('dispatches successfully', () => {
      SupportActions.deleteNotificationContact('cluster id', 'account ID')(mockDispatch);
      expect(mockDispatch).toBeCalledWith({
        payload: expect.anything(),
        meta: expect.anything(),
        accountID: 'account ID',
        type: SupportConstants.DELETE_NOTIFICATION_CONTACT,
      });
    });
    it('calls accountsService.deleteNotificationContact', () => {
      SupportActions.deleteNotificationContact('cluster id', 'account ID')(mockDispatch);
      expect(accountsService.deleteNotificationContact).toBeCalledWith('cluster id', 'account ID');
    });
  });

  describe('clearNotificationContacts', () => {
    it('dispatches successfully', () => {
      SupportActions.clearNotificationContacts()(mockDispatch);
      expect(mockDispatch).toBeCalledWith({
        type: INVALIDATE_ACTION(SupportConstants.NOTIFICATION_CONTACTS),
      });
    });
  });

  describe('clearAddNotificationContacts', () => {
    it('dispatches successfully', () => {
      SupportActions.clearAddNotificationContacts()(mockDispatch);
      expect(mockDispatch).toBeCalledWith({
        type: INVALIDATE_ACTION(SupportConstants.ADD_NOTIFICATION_CONTACT),
      });
    });
  });

  describe('clearDeleteNotificationContacts', () => {
    it('dispatches successfully', () => {
      SupportActions.clearDeleteNotificationContacts()(mockDispatch);
      expect(mockDispatch).toBeCalledWith({
        type: INVALIDATE_ACTION(SupportConstants.DELETE_NOTIFICATION_CONTACT),
      });
    });
  });
});
