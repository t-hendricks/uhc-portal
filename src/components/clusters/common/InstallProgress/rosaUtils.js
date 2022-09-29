// Get the account ID from one of the operator role ARNs.
// In: 'arn:aws:iam::123456789012:role/cluster-test-openshift-machine-api-aws-cloud-credentials'
// Out: '123456789012'
function getAWSAccountID(cluster) {
  const roleARN = cluster.aws.sts.operator_iam_roles[0].role_arn;
  // See https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html
  // arn:partition:service:region:account-id:resource-id
  // arn:partition:service:region:account-id:resource-type/resource-id
  // arn:partition:service:region:account-id:resource-type:resource-id
  return roleARN.split(':')[4];
}

// Strip the URL scheme (https://) from the OIDC endpoint.
// In: 'https://rh-oidc.s3.us-east-1.amazonaws.com/1ricsv5bio0domn5gofgaar07aifjpr0',
// Out: 'rh-oidc.s3.us-east-1.amazonaws.com/1ricsv5bio0domn5gofgaar07aifjpr0',
function getOIDCEndpointNoScheme(cluster) {
  const oidcEndpointURL = new URL(cluster.aws.sts.oidc_endpoint_url);
  return `${oidcEndpointURL.host}${oidcEndpointURL.pathname}`;
}

// Build the OIDC provider ARN for this cluster.
function getOIDCProviderARN(cluster) {
  return `arn:aws:iam::${getAWSAccountID(cluster)}:oidc-provider/${getOIDCEndpointNoScheme(
    cluster,
  )}`;
}

export { getAWSAccountID, getOIDCEndpointNoScheme, getOIDCProviderARN };
