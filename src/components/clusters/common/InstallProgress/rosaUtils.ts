// Get the account ID from one of the operator role ARNs.
// In: 'arn:aws:iam::123456789012:role/cluster-test-openshift-machine-api-aws-cloud-credentials'

import { Cluster } from '~/types/clusters_mgmt.v1';

// Out: '123456789012'
function getAWSAccountID(cluster: Cluster): string {
  const roleARN = cluster.aws?.sts?.operator_iam_roles?.[0].role_arn;
  // See https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html
  // arn:partition:service:region:account-id:resource-id
  // arn:partition:service:region:account-id:resource-type/resource-id
  // arn:partition:service:region:account-id:resource-type:resource-id
  return roleARN ? roleARN.split(':')[4] : '';
}

// Strip the URL scheme (https://) from the OIDC endpoint.
// In: 'https://rh-oidc.s3.us-east-1.amazonaws.com/1ricsv5bio0domn5gofgaar07aifjpr0',
// Out: 'rh-oidc.s3.us-east-1.amazonaws.com/1ricsv5bio0domn5gofgaar07aifjpr0',
function getOIDCEndpointNoScheme(cluster: Cluster): string {
  const oidcEndpointURL = cluster.aws?.sts?.oidc_endpoint_url
    ? new URL(cluster.aws?.sts?.oidc_endpoint_url)
    : undefined;
  return oidcEndpointURL ? `${oidcEndpointURL.host}${oidcEndpointURL.pathname}` : '';
}

// Build the OIDC provider ARN for this cluster.
function getOIDCProviderARN(cluster: Cluster): string {
  return `arn:aws:iam::${getAWSAccountID(cluster)}:oidc-provider/${getOIDCEndpointNoScheme(
    cluster,
  )}`;
}

export { getAWSAccountID, getOIDCEndpointNoScheme, getOIDCProviderARN };
