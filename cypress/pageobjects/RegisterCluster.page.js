import Page from './page';

class RegisterCluster extends Page {
  clusterIDInput = () => cy.get('input[name="cluster_id"]');

  displayNameInput = () => cy.get('input[name="display_name"]');

  clusterURLInput = () => cy.get('input[name="web_console_url"]');

  clusterIDError = () => cy.get('div[id="cluster_id-helper"]');

  displayNameError = () => cy.get('div[id="display_name-helper"]');

  clusterURLError = () => cy.get('div[id="web_console_url-helper"]');

  cancelButton = () => cy.get('button.pf-c-button.pf-m-secondary');

  submitButton = () => cy.get('article#register-cluster button.pf-c-button.pf-m-primary');
}

export default new RegisterCluster();
