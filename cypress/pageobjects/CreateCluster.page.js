import Page from './page';

class CreateCluster extends Page {
  isCreateClusterPage() {
    super.assertUrlIncludes('openshift/create');
  }

  isCreateClusterPageHeaderVisible() {
    cy.contains('h1', 'Select an OpenShift cluster type to create', { timeout: 30000 }).should(
      'be.visible',
    );
  }

  get createOSDTrialClusterBtn() {
    return $("//button[contains(text(),'Create trial cluster')]");
  }
}

export default new CreateCluster();
