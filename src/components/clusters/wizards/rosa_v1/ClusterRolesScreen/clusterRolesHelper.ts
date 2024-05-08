import {
  checkCustomOperatorRolesPrefix,
  MAX_CUSTOM_OPERATOR_ROLES_PREFIX_LENGTH,
} from '~/common/validators';

import { secureRandomValueInRange } from '../../../../../common/helpers';

type ForcedByoOidcType = 'Hypershift' | 'SharedVPC' | undefined;

const getOperatorRolesCommand = ({
  forcedByoOidcType,
  byoOidcConfigID,
  customOperatorRolesPrefix,
  installerRoleArn,
  sharedVpcRoleArn,
}: {
  forcedByoOidcType: ForcedByoOidcType;
  byoOidcConfigID: string;
  customOperatorRolesPrefix: string;
  installerRoleArn?: string;
  sharedVpcRoleArn?: string;
}) => {
  if (
    !byoOidcConfigID ||
    !customOperatorRolesPrefix ||
    checkCustomOperatorRolesPrefix(customOperatorRolesPrefix)
  ) {
    return '';
  }

  const rosaBaseCommand = `rosa create operator-roles --prefix "${customOperatorRolesPrefix}" --oidc-config-id "${byoOidcConfigID}"`;
  const installerRoleArnOption = installerRoleArn ? `--installer-role-arn ${installerRoleArn}` : '';

  if (forcedByoOidcType === 'Hypershift') {
    return `${rosaBaseCommand} --hosted-cp ${installerRoleArnOption}`;
  }
  if (forcedByoOidcType === 'SharedVPC') {
    return `${rosaBaseCommand} ${installerRoleArnOption} --shared-vpc-role-arn ${sharedVpcRoleArn}`;
  }
  return `${rosaBaseCommand} ${installerRoleArnOption}`;
};

const getForcedByoOidcReason = (forcedByoOidcType: ForcedByoOidcType) => {
  let mandatoryByoOidcReason;
  switch (forcedByoOidcType) {
    case 'Hypershift':
      mandatoryByoOidcReason = 'Hosted control plane clusters require a specified OIDC provider.';
      break;
    case 'SharedVPC':
      mandatoryByoOidcReason =
        'When using Shared VPC, OIDC provider and operator roles must be created prior to the cluster creation.';
      break;
    default:
      break;
  }
  return mandatoryByoOidcReason;
};

const OPERATOR_ROLES_HASH_LENGTH = 4;

const createOperatorRolesHash = () => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const alphaNumeric = '0123456789abcdefghijklmnopqrstuvwxyz';
  let prefixArray: string | string[] = '';

  // random 4 alphanumeric hash
  for (let i = 0; i < OPERATOR_ROLES_HASH_LENGTH; i += 1) {
    const randIndex = secureRandomValueInRange(0, 35);
    prefixArray += alphaNumeric[randIndex];
  }
  // cannot start with a number
  const randomCharacter = alphabet[secureRandomValueInRange(0, 25)];
  prefixArray = prefixArray.split('');
  prefixArray[0] = randomCharacter;

  return prefixArray.join('');
};

const createOperatorRolesPrefix = (clusterName: string) => {
  // increment allowedLength by 1 due to '-' character prepended to hash
  const allowedLength = MAX_CUSTOM_OPERATOR_ROLES_PREFIX_LENGTH - (OPERATOR_ROLES_HASH_LENGTH + 1);
  const operatorRolesClusterName = clusterName.slice(0, allowedLength);

  return `${operatorRolesClusterName}-${createOperatorRolesHash()}`;
};

export { getOperatorRolesCommand, getForcedByoOidcReason, createOperatorRolesPrefix };
