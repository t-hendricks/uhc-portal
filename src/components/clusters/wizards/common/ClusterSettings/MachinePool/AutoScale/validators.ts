const numberValidator = (numStr: number | string) => {
  const num = Number(numStr);
  if (Number.isNaN(num)) {
    return 'Value must be a number.';
  }
  return undefined;
};

const positiveNumberValidator = (numStr: number | string) => {
  const numError = numberValidator(numStr);
  if (numError) {
    return numError;
  }
  if (Number(numStr) < 0) {
    return 'Value cannot be a negative number.';
  }
  return undefined;
};

const logVerbosityValidator = (numStr: number | string) => {
  const numError = numberValidator(numStr);
  if (numError) {
    return numError;
  }
  const num = Number(numStr);
  if (num < 1 || num > 6) {
    return 'Value must be between 1 and 6.';
  }
  return undefined;
};

const utilizationThresholdValidator = (num: number | string) => {
  const numError = positiveNumberValidator(num);
  if (numError) {
    return numError;
  }
  if (num < 0 || num > 1) {
    return 'Value must be between 0 and 1.';
  }
  return undefined;
};

export {
  numberValidator,
  positiveNumberValidator,
  logVerbosityValidator,
  utilizationThresholdValidator,
};
