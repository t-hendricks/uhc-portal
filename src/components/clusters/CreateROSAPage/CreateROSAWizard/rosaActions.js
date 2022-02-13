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
  const accountRoles = { items: [] };
  // '123456789' 1 accountRoles
  // '234564251' 0 accountRoles
  // '3783563258' 2 accountRoles
  if (awsAccountID !== '234564251') {
    accountRoles.items.push({
      installer: `arn:aws:iam::${awsAccountID}:role/Foo-Installer-Role`,
      support: `arn:aws:iam::${awsAccountID}:role/Foo-Support-Role`,
      instance_controlplane: `arn:aws:iam::${awsAccountID}:role/Foo-ControlPlane-Role`,
      instance_worker: `arn:aws:iam::${awsAccountID}:role/Foo-Worker-Role`,
    });
  }
  if (awsAccountID === '3783563258') {
    accountRoles.items.push({
      installer: `arn:aws:iam::${awsAccountID}:role/Bar-Installer-Role`,
      support: `arn:aws:iam::${awsAccountID}:role/Bar-Support-Role`,
      instance_controlplane: `arn:aws:iam::${awsAccountID}:role/Bar-ControlPlane-Role`,
      instance_worker: `arn:aws:iam::${awsAccountID}:role/Bar-Worker-Role`,
    });
  }
  dispatch({
    type: GET_AWS_ACCOUNT_ROLES_ARNS,
    payload: { data: accountRoles },
  });
};

export const clearGetAWSAccountIDsResponse = () => ({
  type: CLEAR_GET_AWS_ACCOUNT_IDS_RESPONSE,
});

export const clearGetAWSAccountRolesARNsResponse = () => ({
  type: CLEAR_GET_AWS_ACCOUNT_ROLES_ARNS_RESPONSE,
});
