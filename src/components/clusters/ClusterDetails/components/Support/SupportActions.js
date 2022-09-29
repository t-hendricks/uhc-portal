import accountsService from '../../../../../services/accountsService';
import { INVALIDATE_ACTION } from '../../../../../redux/reduxHelpers';

const GET_NOTIFICATION_CONTACTS = 'GET_NOTIFICATION_CONTACTS';
const ADD_NOTIFICATION_CONTACT = 'ADD_NOTIFICATION_CONTACT';
const DELETE_NOTIFICATION_CONTACT = 'DELETE_NOTIFICATION_CONTACT';
const NOTIFICATION_CONTACTS = 'NOTIFICATION_CONTACTS';
const GET_SUPPORT_CASES = 'GET_SUPPORT_CASES';

export const SupportConstants = {
  GET_NOTIFICATION_CONTACTS,
  ADD_NOTIFICATION_CONTACT,
  DELETE_NOTIFICATION_CONTACT,
  NOTIFICATION_CONTACTS,
  GET_SUPPORT_CASES,
};

/** Build a notification
 * Meta object with notifications. Notifications middleware uses it to get prepared to response to:
 * - <type>_PENDING (not used) - notification is sent right after the request was created
 * - <type>_FULFILLED - once promise is resolved
 * - <type>_PENDING (not used) - once promise is rejected
 *
 * @param {string} name - name of a cluster
 * @param {string} action - action to display notification for (archive/unarchive)
 * @returns {object} - notification object
 *
 * @see https://github.com/RedHatInsights/frontend-components/blob/master/packages/notifications/doc/notifications.md
 */
const buildNotificationsMeta = (title) => ({
  notifications: {
    fulfilled: {
      variant: 'success',
      title,
      dismissDelay: 8000,
      dismissable: false,
    },
  },
});

const clearNotificationContacts = () => (dispatch) =>
  dispatch({
    type: INVALIDATE_ACTION(NOTIFICATION_CONTACTS),
  });

const clearAddNotificationContacts = () => (dispatch) =>
  dispatch({
    type: INVALIDATE_ACTION(ADD_NOTIFICATION_CONTACT),
  });

const clearDeleteNotificationContacts = () => (dispatch) =>
  dispatch({
    type: INVALIDATE_ACTION(DELETE_NOTIFICATION_CONTACT),
  });

const getNotificationContacts = (subscriptionID) => ({
  type: GET_NOTIFICATION_CONTACTS,
  payload: accountsService.getNotificationContacts(subscriptionID),
  meta: {
    subscriptionID,
  },
});

const addNotificationContact = (subscriptionID, username) => (dispatch) =>
  dispatch({
    type: ADD_NOTIFICATION_CONTACT,
    payload: accountsService.addNotificationContact(subscriptionID, username),
    // This Notification is called directly as it's title depends on number of contacts
    // that was really added
    // meta: ^^^
  });

const deleteNotificationContact = (subscriptionID, accountID) => (dispatch) =>
  dispatch({
    type: DELETE_NOTIFICATION_CONTACT,
    accountID,
    payload: accountsService.deleteNotificationContact(subscriptionID, accountID),
    meta: buildNotificationsMeta('Notification contact deleted successfully'),
  });

const getSupportCases = (subscriptionID) => ({
  type: GET_SUPPORT_CASES,
  payload: accountsService.getSupportCases(subscriptionID),
  meta: {
    subscriptionID,
  },
});

const supportActions = {
  clearNotificationContacts,
  clearAddNotificationContacts,
  clearDeleteNotificationContacts,
  getNotificationContacts,
  addNotificationContact,
  deleteNotificationContact,
  getSupportCases,
};

export default supportActions;
