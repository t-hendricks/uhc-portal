const minValueSelector = isMultiAz => (isMultiAz ? {
  value: 9,
  validationMsg: 'At least 9 nodes are required for multiple availability zone cluster.',
} : {
  value: 4,
  validationMsg: 'At least 4 nodes are required',
});

export default minValueSelector;
