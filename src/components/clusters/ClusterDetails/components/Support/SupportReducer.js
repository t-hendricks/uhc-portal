import produce from 'immer';
import {
  baseRequestState,
  FULFILLED_ACTION,
  INVALIDATE_ACTION,
  PENDING_ACTION,
  REJECTED_ACTION,
} from '../../../../../redux/reduxHelpers';

import { SupportConstants } from './SupportActions';
import { getErrorState } from '../../../../../common/errors';

const initialState = {
  notificationContacts: {
    ...baseRequestState,
    contacts: [],
    clusterID: '',
  },
  deleteContactResponse: {
    ...baseRequestState,
  },
  addContactResponse: {
    ...baseRequestState,
  },
  supportCases: {
    ...baseRequestState,
    cases: [],
    clusterID: '',
  },
};

function SupportReducer(state = initialState, action) {
  // eslint-disable-next-line consistent-return
  return produce(state, (draft) => {
    let data;
    let items;
    let cases;
    // eslint-disable-next-line default-case
    switch (action.type) {
      // GET NOTIFICATION CONTACTS
      case PENDING_ACTION(SupportConstants.GET_NOTIFICATION_CONTACTS):
        draft.notificationContacts.pending = true;
        break;
      case FULFILLED_ACTION(SupportConstants.GET_NOTIFICATION_CONTACTS):
        items = action.payload?.data?.items || [];
        draft.notificationContacts = {
          ...baseRequestState,
          fulfilled: true,
          subscriptionID: action.meta?.subscriptionID,
          contacts: items.map((contact) => ({
            userID: contact.id,
            username: contact.username,
            email: contact.email,
            firstName: contact.first_name,
            lastName: contact.last_name,
          })),
        };
        break;
      case REJECTED_ACTION(SupportConstants.GET_NOTIFICATION_CONTACTS):
        draft.notificationContacts = {
          ...initialState.notificationContacts,
          ...getErrorState(action),
        };
        break;

      // DELETE_NOTIFICATION_CONTACT
      case PENDING_ACTION(SupportConstants.DELETE_NOTIFICATION_CONTACT):
        draft.deleteContactResponse.pending = true;
        draft.deleteContactResponse.accountID = action.accountID;
        break;
      case FULFILLED_ACTION(SupportConstants.DELETE_NOTIFICATION_CONTACT):
        draft.deleteContactResponse.pending = false;
        draft.deleteContactResponse.fulfilled = true;
        // Remove deleted user from contacts to have a proper display before fetch will finish
        draft.notificationContacts.contacts = draft.notificationContacts.contacts.filter(
          (contact) => contact.userID !== draft.deleteContactResponse.accountID,
        );
        break;
      case REJECTED_ACTION(SupportConstants.DELETE_NOTIFICATION_CONTACT):
        draft.deleteContactResponse = {
          pending: false,
          fulfilled: false,
          ...getErrorState(action),
        };
        break;
      case INVALIDATE_ACTION(SupportConstants.DELETE_NOTIFICATION_CONTACT):
        draft.deleteContactResponse = {
          ...baseRequestState,
        };
        break;

      // ADD_NOTIFICATION_CONTACT
      case PENDING_ACTION(SupportConstants.ADD_NOTIFICATION_CONTACT):
        draft.addContactResponse.pending = true;
        break;
      case FULFILLED_ACTION(SupportConstants.ADD_NOTIFICATION_CONTACT):
        draft.addContactResponse.pending = false;
        draft.addContactResponse.fulfilled = true;
        data = action.payload?.data || [];
        data = Array.isArray(data) ? data : [data];
        draft.addContactResponse.count = data.length;
        // add the new users to contacts to display them before fetch will finish
        data.forEach((contact) =>
          draft.notificationContacts.contacts.push({
            userID: contact.id,
            username: contact.username,
            email: contact.email,
            firstName: contact.first_name,
            lastName: contact.last_name,
          }),
        );
        break;
      case REJECTED_ACTION(SupportConstants.ADD_NOTIFICATION_CONTACT):
        draft.addContactResponse = {
          pending: false,
          fulfilled: false,
          ...getErrorState(action),
        };
        // User-friendly message is in `reason` field
        draft.addContactResponse.errorMessage =
          action.payload?.response?.data?.reason || draft.addContactResponse.errorMessage;
        break;
      case INVALIDATE_ACTION(SupportConstants.ADD_NOTIFICATION_CONTACT):
        draft.addContactResponse = {
          ...baseRequestState,
        };
        break;
      // GET SUPPORT CASES
      case PENDING_ACTION(SupportConstants.GET_SUPPORT_CASES):
        draft.supportCases.pending = true;
        break;
      case FULFILLED_ACTION(SupportConstants.GET_SUPPORT_CASES):
        cases = action.payload?.data?.response?.docs || [];
        draft.supportCases = {
          ...baseRequestState,
          fulfilled: true,
          subscriptionID: action.meta?.subscriptionID,
          cases: cases.map((supportCase) => ({
            summary: supportCase.case_summary,
            caseID: supportCase.case_number,
            ownerID: supportCase.case_owner,
            severity: supportCase.case_severity,
            status: supportCase.case_status,
            lastModifiedBy: supportCase.case_lastModifiedByName,
            lastModifiedDate: supportCase.case_lastModifiedDate,
          })),
        };
        break;
      case REJECTED_ACTION(SupportConstants.GET_SUPPORT_CASES):
        draft.supportCases = {
          ...initialState.supportCases,
          ...getErrorState(action),
        };
        break;

      // INVALIDATE NOTIFICATION_CONTACTS
      case INVALIDATE_ACTION(SupportConstants.NOTIFICATION_CONTACTS):
        return initialState;
    }
  });
}

SupportReducer.initialState = initialState;

export { initialState, SupportReducer };

export default SupportReducer;
