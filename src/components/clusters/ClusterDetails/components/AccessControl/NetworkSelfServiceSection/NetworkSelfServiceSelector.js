const grantsSelector = (state) => {
  const { roles, grants } = state.networkSelfService;

  const getDisplayName = (grantedRoleId) => {
    const foundRole = roles.data.find((role) => role.id === grantedRoleId);

    return foundRole ? foundRole.displayName : grantedRoleId;
  };

  return grants.data.map((grant) => ({
    id: grant.id,
    user_arn: grant.user_arn,
    state: grant.state,
    state_description: grant.state_description,
    console_url: grant.console_url,
    roleName: getDisplayName(grant.role.id),
  }));
};

export default grantsSelector;
