const extractAWSID = (arn: string): string => {
  // Ex: arn = 'arn:aws:iam::268733382466:role/ManagedOpenShift-OCM-Role-15212158'
  // '268733382466' above ^^ is an example AWS account ID
  const arnSegment = arn.substr(arn.indexOf('::') + 2);
  return arnSegment.substr(0, arnSegment.indexOf(':'));
};

export { extractAWSID };
