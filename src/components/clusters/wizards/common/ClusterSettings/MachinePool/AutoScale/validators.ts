const numberValidator = (numStr: number | string) => {
  const num = Number(numStr);
  if (Number.isNaN(num)) {
    return 'Value must be a number.';
  }
  if (num < 0) {
    return 'Value cannot be a negative number.';
  }
  return undefined;
};

const logVerbosityValidator = (num: number | string) => {
  const numError = numberValidator(num);
  if (numError) {
    return numError;
  }
  if (num < 1 || num > 6) {
    return 'Value must be between 1 and 6.';
  }
  return undefined;
};

const utilizationThresholdValidator = (num: number | string) => {
  const numError = numberValidator(num);
  if (numError) {
    return numError;
  }
  if (num < 0 || num > 1) {
    return 'Value must be between 0 and 1.';
  }
  return undefined;
};

export { numberValidator, logVerbosityValidator, utilizationThresholdValidator };
