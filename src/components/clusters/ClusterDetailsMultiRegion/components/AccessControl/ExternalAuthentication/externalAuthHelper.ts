export const getExternalAuthenticationProviderCommand = ({
  clusterName,
  providerName,
  issuerUrl,
  issuerAudiences,
  groupsClaim,
  usernameClaim,
  providerCA,
}: {
  clusterName: string;
  providerName: string;
  issuerAudiences: string;
  groupsClaim: string;
  usernameClaim: string;
  issuerUrl: string;
  providerCA?: string;
}) => {
  const trimmedIssuerAudiences = issuerAudiences
    .split(',')
    .map((audience) => audience.trim())
    .join(',');
  const rosaBaseCommand =
    `rosa create external-auth-provider --cluster=${clusterName || '<CLUSTER_NAME>'} ` +
    ` --name=${providerName || '<PROVIDER_NAME>'} --issuer-url=${issuerUrl || '<ISSUER_URL>'} ` +
    ` --issuer-audiences=${trimmedIssuerAudiences || '<ISSUER_AUDIENCES>'} ` +
    ` --claim-mapping-groups-claim=${groupsClaim || 'groups'} ` +
    ` --claim-mapping-username-claim=${usernameClaim || 'email'}`;

  return providerCA ? `${rosaBaseCommand} --issuer-ca-file=<FILENAME>` : `${rosaBaseCommand} `;
};
