import { secureRandomValueInRange } from '~/common/helpers';
import {
  checkCustomOperatorRolesPrefix,
  MAX_CUSTOM_OPERATOR_ROLES_PREFIX_LENGTH,
} from '~/common/validators';

const getOperatorRolesCommand = ({
  isHypershift,
  byoOidcConfigID,
  customOperatorRolesPrefix,
  installerRoleArn,
  sharedVpcRoleArn,
}: {
  isHypershift: boolean;
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

  if (isHypershift) {
    return `${rosaBaseCommand} --hosted-cp ${installerRoleArnOption}`;
  }
  return `${rosaBaseCommand} ${installerRoleArnOption}`;
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

export { getOperatorRolesCommand, createOperatorRolesPrefix };
