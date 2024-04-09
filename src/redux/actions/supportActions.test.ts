import {
  ADD_NOTIFICATION_CONTACT,
  DELETE_NOTIFICATION_CONTACT,
  GET_NOTIFICATION_CONTACTS,
  NOTIFICATION_CONTACTS,
} from '~/redux/constants/supportConstants';

import { accountsService } from '../../services';
import { INVALIDATE_ACTION } from '../reduxHelpers';

import {
  addNotificationContact,
  clearAddNotificationContacts,
  clearDeleteNotificationContacts,
  clearNotificationContacts,
  deleteNotificationContact,
  getNotificationContacts,
} from './supportActions';

jest.mock('../../services', () => ({
  accountsService: {
    getNotificationContacts: jest.fn(),
    addNotificationContact: jest.fn(),
    deleteNotificationContact: jest.fn(),
  },
}));

describe('supportActions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getNotificationContacts', () => {
    it('dispatches successfully', () => {
      // Arrange
      (accountsService.getNotificationContacts as jest.Mock).mockReturnValue(
        'notification contant',
      );

      // Act
      const result = getNotificationContacts('cluster id');

      // Assert
      expect(result).toEqual({
        payload: 'notification contant',
        type: GET_NOTIFICATION_CONTACTS,
        meta: {
          subscriptionID: 'cluster id',
        },
      });
    });
    it('calls accountsService.getNotificationContacts', () => {
      // Act
      getNotificationContacts('cluster id');

      // Assert
      expect(accountsService.getNotificationContacts).toHaveBeenCalledWith('cluster id');
    });
  });

  describe('addNotificationContact', () => {
    it('dispatches successfully', () => {
      // Arrange
      (accountsService.addNotificationContact as jest.Mock).mockReturnValue(
        'add notification contant',
      );

      // Act
      const result = addNotificationContact('cluster id', 'username');

      // Assert
      expect(result).toEqual({
        payload: 'add notification contant',
        type: ADD_NOTIFICATION_CONTACT,
      });
    });

    it('calls accountsService.addNotificationContact', () => {
      // Act
      addNotificationContact('cluster id', 'username');

      // Assert
      expect(accountsService.addNotificationContact).toHaveBeenCalledWith('cluster id', 'username');
    });
  });

  describe('deleteNotificationContact', () => {
    it('dispatches successfully', () => {
      // Arrange
      (accountsService.deleteNotificationContact as jest.Mock).mockReturnValue(
        'delete notification contant',
      );

      // Act
      const result = deleteNotificationContact('cluster id', 'account ID');

      // Assert
      expect(result).toEqual({
        payload: 'delete notification contant',
        meta: { accountID: 'account ID', notifications: expect.anything() },
        type: DELETE_NOTIFICATION_CONTACT,
      });
    });

    it('calls accountsService.deleteNotificationContact', () => {
      // Act
      deleteNotificationContact('cluster id', 'account ID');

      // Assert
      expect(accountsService.deleteNotificationContact).toHaveBeenCalledWith(
        'cluster id',
        'account ID',
      );
    });
  });

  describe('clearNotificationContacts', () => {
    it('dispatches successfully', () => {
      // Act
      const result = clearNotificationContacts();

      // Assert
      expect(result).toEqual({
        type: INVALIDATE_ACTION(NOTIFICATION_CONTACTS),
      });
    });
  });

  describe('clearAddNotificationContacts', () => {
    it('dispatches successfully', () => {
      // Act
      const result = clearAddNotificationContacts();

      // Assert
      expect(result).toEqual({
        type: INVALIDATE_ACTION(ADD_NOTIFICATION_CONTACT),
      });
    });
  });

  describe('clearDeleteNotificationContacts', () => {
    it('dispatches successfully', () => {
      // Act
      const result = clearDeleteNotificationContacts();

      // Assert
      expect(result).toEqual({
        type: INVALIDATE_ACTION(DELETE_NOTIFICATION_CONTACT),
      });
    });
  });
});
