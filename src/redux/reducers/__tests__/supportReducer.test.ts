import { GET_NOTIFICATION_CONTACTS } from '~/redux/constants/supportConstants';

import { FULFILLED_ACTION } from '../../reduxHelpers';
import reducer, { initialState } from '../supportReducer';

import {
  mockGetNotificationContactsList,
  mockGetNotificationContactsPayload,
} from './supportReducer.fixtures';

describe('ClusterDetails supportReducer', () => {
  describe('should not handle unrelated actions', () => {
    it('leaves the state unmodified', () => {
      const action = { type: 'HOLY_GUACAMOLE' };
      const result = reducer(initialState, action as any);

      expect(result).toEqual(initialState);
    });
  });
  describe('should handle actions', () => {
    it('handles GET_NOTIFICATION_CONTACTS', () => {
      const action = {
        type: FULFILLED_ACTION(GET_NOTIFICATION_CONTACTS),
        payload: mockGetNotificationContactsPayload,
      };
      const result = reducer(initialState, action as any);

      expect(result).toHaveProperty(
        'notificationContacts.contacts',
        mockGetNotificationContactsList,
      );
    });
  });
});
