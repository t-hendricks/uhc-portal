// Result of processing by `normalizedAWSAccountRole` from `AWSSTSRole[]`.
type NormalizedAWSAccountRole = {
  prefix: string;
  isAdmin: boolean;
  managedPolicies: boolean;
  hcpManagedPolicies: boolean;
  version: string;
  // Rest are dynamic based on `type` values returned by backend, but these are the values we look for.
  ControlPlane?: string;
  Installer?: string;
  Support?: string;
  Worker?: string;
};

export { NormalizedAWSAccountRole };
