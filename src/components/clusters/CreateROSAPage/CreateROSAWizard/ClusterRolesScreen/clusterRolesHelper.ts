import { checkCustomOperatorRolesPrefix } from '~/common/validators';

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
  if (forcedByoOidcType === 'Hypershift') {
    return `${rosaBaseCommand} --hosted-cp`;
  }
  if (forcedByoOidcType === 'SharedVPC') {
    return `${rosaBaseCommand} --installer-role-arn ${installerRoleArn} --shared-vpc-role-arn ${sharedVpcRoleArn}`;
  }
  return rosaBaseCommand;
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

export { getOperatorRolesCommand, getForcedByoOidcReason };
