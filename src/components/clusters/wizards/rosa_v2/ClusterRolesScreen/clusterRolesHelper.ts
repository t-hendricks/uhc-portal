import { secureRandomValueInRange } from '~/common/helpers';
import {
  checkCustomOperatorRolesPrefix,
  MAX_CUSTOM_OPERATOR_ROLES_PREFIX_LENGTH,
} from '~/common/validators';

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

export const createOperatorRolesHash = () => {
  // random 4 alphanumeric hash
  const prefixArray = Array.from(
    crypto.getRandomValues(new Uint8Array(OPERATOR_ROLES_HASH_LENGTH)),
  ).map((value) => (value % 36).toString(36));
  // cannot start with a number
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const randomCharacter = alphabet[secureRandomValueInRange(0, 25)];
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
