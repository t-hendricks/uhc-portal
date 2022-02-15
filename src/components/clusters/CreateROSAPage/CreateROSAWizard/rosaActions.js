import {
  LIST_ASSOCIATED_AWS_IDS,
  GET_AWS_ACCOUNT_ROLES_ARNS,
  CLEAR_GET_AWS_ACCOUNT_IDS_RESPONSE,
  CLEAR_GET_AWS_ACCOUNT_ROLES_ARNS_RESPONSE,
} from './rosaConstants';
import { accountsService } from '../../../../services';

export const getAWSIDsFromARNs = (arns) => {
  // Ex: arns = ['arn:aws:iam::268733382466:role/ManagedOpenShift-OCM-Role-15212158', ...],
  // '268733382466' above ^^ is an example AWS account ID
  const ids = arns.map((arn) => {
    const arnSegment = arn.substr(arn.indexOf('::') + 2);
    return arnSegment.substr(0, arnSegment.indexOf(':'));
  });
  return [...new Set(ids)]; // convert to Set to remove duplicates, spread to convert back to array
};

export const normalizeAWSAccountRoles = (accountRoles) => {
  // Returns for Ex:
  // [
  //   { Installer: 'arn:..ManagedOpenShift-Installer-Role', ControlPlane: 'arn:...' ...},
  //   { Installer: 'arn:..croche-test-Installer-Role', ControlPlane: 'arn:...' ...}
  // ]
  const AWSAccountRoles = [];
  accountRoles.items.forEach((accountRole) => {
    const roleObj = { prefix: accountRole.prefix };
    accountRole?.items.forEach((arn) => {
      roleObj[arn?.type] = arn?.arn;
    });
    AWSAccountRoles.push(roleObj);
  });
  return AWSAccountRoles;
};

export const getAWSAccountIDs = organizationID => dispatch => dispatch({
  type: LIST_ASSOCIATED_AWS_IDS,
  payload: accountsService.getOrganizationLabels(organizationID).then((response) => {
    if (!response.data || !response.data.items) {
      return [];
    }
    // "key": "sts_ocm_role",
    // value is a comma separated list of ARNs:
    // Ex: "value": "arn:aws:iam::268733382466:role/ManagedOpenShift-OCM-Role-15212158, ...",
    const stsOCMRoleLabel = response.data.items.filter(label => label.key === 'sts_ocm_role');
    const stsOCMRoleValue = stsOCMRoleLabel[0]?.value ?? '';
    const arns = stsOCMRoleValue === '' ? [] : stsOCMRoleValue.split(',');
    const awsAccountIDs = getAWSIDsFromARNs(arns);
    return awsAccountIDs;
  }),
});

export const getAWSAccountRolesARNs = awsAccountID => (dispatch) => {
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

export const clearGetAWSAccountIDsResponse = () => ({
  type: CLEAR_GET_AWS_ACCOUNT_IDS_RESPONSE,
});

export const clearGetAWSAccountRolesARNsResponse = () => ({
  type: CLEAR_GET_AWS_ACCOUNT_ROLES_ARNS_RESPONSE,
});
