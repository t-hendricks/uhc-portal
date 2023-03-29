import {
  LIST_ASSOCIATED_AWS_IDS,
  GET_AWS_ACCOUNT_ROLES_ARNS,
  GET_OCM_ROLE,
  GET_USER_ROLE,
  CLEAR_GET_AWS_ACCOUNT_IDS_RESPONSE,
  CLEAR_GET_AWS_ACCOUNT_ROLES_ARNS_RESPONSE,
  CLEAR_GET_OCM_ROLE_RESPONSE,
  CLEAR_GET_USER_ROLE_RESPONSE,
  SET_OFFLINE_TOKEN,
} from './rosaConstants';
import { accountsService } from '../../../../services';
import { extractAWSID } from '../../../../common/rosa';

export const getAWSIDsFromARNs = (arns) => {
  const ids = arns.map(extractAWSID);
  return [...new Set(ids)]; // convert to Set to remove duplicates, spread to convert back to array
};

/** Converts comma separated list of sts users into an array of users by aws account ids
 * @param stsUserRoles string.  Comma separated list of sts users
 * @returns
 * [
 *   { aws_id: <id>: sts_user: <user>},
 *   { aws_id: <id>: sts_user: <user>},
 * ]
 */
export const normalizeSTSUsersByAWSAccounts = (stsUserRoles) => {
  // Ex stsUserRoles = "arn:aws:iam::000000000006:role/ManagedOpenShift-User-dtaylor-ocm-Role, ..."
  //                '268733382466' above ^^ is an example AWS account ID
  if (stsUserRoles === undefined || stsUserRoles.length === 0) {
    return [];
  }
  const ids = stsUserRoles.split(',').map((stsUser) => {
    const awsAcctId = extractAWSID(stsUser);
    return { aws_id: awsAcctId, sts_user: stsUser.substr(stsUser.indexOf(':role/') + 6) };
  });
  return [...new Set(ids)]; // convert to Set to remove duplicates, spread to convert back to array
};

/** Converts accountRoles object into an array of ARNs
 * @param accountRoles object: https://gitlab.cee.redhat.com/service/uhc-clusters-service/-/merge_requests/3486
 * @returns
 * [
 *   { Installer: 'arn:..ManagedOpenShift-Installer-Role', ControlPlane: 'arn:...' ...},
 *   { Installer: 'arn:..croche-test-Installer-Role', ControlPlane: 'arn:...' ...}
 * ]
 */
export const normalizeAWSAccountRoles = (accountRoles) =>
  (accountRoles?.items || []).map((accountRole) =>
    (accountRole?.items || []).reduce(
      (roleObj, { type, arn, roleVersion }) => ({
        ...roleObj,
        version: roleVersion,
        [type]: arn,
      }),
      {
        prefix: accountRole.prefix,
      },
    ),
  );

export const getAWSAccountIDs = (organizationID) => (dispatch) =>
  dispatch({
    type: LIST_ASSOCIATED_AWS_IDS,
    payload: accountsService.getOrganizationLabels(organizationID).then((response) => {
      if (!response.data || !response.data.items) {
        return [];
      }
      // "key": "sts_ocm_role",
      // value is a comma separated list of ARNs:
      // Ex: "value": "arn:aws:iam::268733382466:role/ManagedOpenShift-OCM-Role-15212158, ...",
      const stsOCMRoleLabel = response.data.items.filter((label) => label.key === 'sts_ocm_role');
      const stsOCMRoleValue = stsOCMRoleLabel[0]?.value ?? '';
      const arns = stsOCMRoleValue === '' ? [] : stsOCMRoleValue.split(',');
      const awsAccountIDs = getAWSIDsFromARNs(arns);
      return awsAccountIDs;
    }),
  });

export const getAWSAccountRolesARNs = (awsAccountID) => (dispatch) => {
  const accountRoles = [];
  dispatch({
    type: GET_AWS_ACCOUNT_ROLES_ARNS,
    payload: accountsService.getAWSAccountARNs(awsAccountID).then((response) => {
      if (!response.data || !response.data.items) {
        return accountRoles;
      }
      return normalizeAWSAccountRoles(response.data);
    }),
  });
};

export const getOCMRole = (awsAccountID) => (dispatch) => {
  dispatch({
    type: GET_OCM_ROLE,
    payload: accountsService.getOCMRole(awsAccountID).then((response) => response?.data),
  });
};

const fetchUserRolesByOCMAccountID = async () => {
  const ocmAccount = await accountsService.getCurrentAccount();
  const userRole = await accountsService.getUserRole(ocmAccount?.data?.id);
  return normalizeSTSUsersByAWSAccounts(userRole?.data.value);
};

export const getUserRole = () => ({
  type: GET_USER_ROLE,
  payload: fetchUserRolesByOCMAccountID(),
});

export const clearGetAWSAccountIDsResponse = () => ({
  type: CLEAR_GET_AWS_ACCOUNT_IDS_RESPONSE,
});

export const clearGetAWSAccountRolesARNsResponse = () => ({
  type: CLEAR_GET_AWS_ACCOUNT_ROLES_ARNS_RESPONSE,
});

export const clearGetOcmRoleResponse = () => ({
  type: CLEAR_GET_OCM_ROLE_RESPONSE,
});

export const clearGetUserRoleResponse = () => ({
  type: CLEAR_GET_USER_ROLE_RESPONSE,
});

export const setOfflineToken = (token) => ({
  type: SET_OFFLINE_TOKEN,
  payload: token,
});
