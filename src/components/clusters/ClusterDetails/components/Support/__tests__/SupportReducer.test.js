import reducer, { initialState } from '../SupportReducer';
import { SupportConstants } from '../SupportActions';
import { FULFILLED_ACTION } from '../../../../../../redux/reduxHelpers';
import {
  mockGetNotificationContactsList,
  mockGetNotificationContactsPayload,
} from './Support.fixtures';

describe('ClusterDetails SupportReducer', () => {
  describe('should not handle unrelated actions', () => {
    it('leaves the state unmodified', () => {
      const action = { type: 'HOLY_GUACAMOLE' };
      const result = reducer(initialState, action);

      expect(result).toEqual(initialState);
    });
  });
  describe('should handle actions', () => {
    it('handles GET_NOTIFICATION_CONTACTS', () => {
      const action = {
        type: FULFILLED_ACTION(SupportConstants.GET_NOTIFICATION_CONTACTS),
        payload: mockGetNotificationContactsPayload,
      };
      const result = reducer(initialState, action);

      expect(result).toHaveProperty(
        'notificationContacts.contacts',
        mockGetNotificationContactsList,
      );
    });
  });
});
