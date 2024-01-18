class LeaveCreateClusterPrompt {
  submit = () => {
    cy.getByTestId('leave-cluster-prompt-button').click();
  };

  cancel = () => {
    cy.getByTestId('cancel-button').click();
  };
}

export default new LeaveCreateClusterPrompt();
