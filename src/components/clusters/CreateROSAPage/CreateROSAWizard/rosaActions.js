const LIST_ASSOCIATED_AWS_IDS = 'LIST_AWS_IDS';
const GET_AWS_ACCOUNT_ROLES_ARNS = 'GET_AWS_ACCOUNT_ROLES_ARNS';
const CLEAR_GET_AWS_ACCOUNT_IDS_RESPONSE = 'CLEAR_GET_AWS_ACCOUNT_IDs_RESPONSE';
const CLEAR_GET_AWS_ACCOUNT_ROLES_ARNS_RESPONSE = 'CLEAR_GET_AWS_ACCOUNT_ROLES_ARNS_RESPONSE';

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

export const getAWSAccountIDs = () => dispatch => dispatch({
  type: LIST_ASSOCIATED_AWS_IDS,
  payload: { data: ['123456789', '234564251', '3783563258'] },
});

export const clearGetAWSAccountIDsResponse = () => ({
  type: CLEAR_GET_AWS_ACCOUNT_IDS_RESPONSE,
});

export const clearGetAWSAccountRolesARNsResponse = () => ({
  type: CLEAR_GET_AWS_ACCOUNT_ROLES_ARNS_RESPONSE,
});

const rosaConstants = {
  LIST_ASSOCIATED_AWS_IDS,
  GET_AWS_ACCOUNT_ROLES_ARNS,
  CLEAR_GET_AWS_ACCOUNT_IDS_RESPONSE,
  CLEAR_GET_AWS_ACCOUNT_ROLES_ARNS_RESPONSE,
};

export default rosaConstants;
