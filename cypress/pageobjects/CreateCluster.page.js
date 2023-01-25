import Page from './page';

class CreateCluster extends Page {
  isCreateClusterPage() {
    super.assertUrlIncludes('openshift/create');
  }

  get createOSDTrialClusterBtn() { return $("//button[contains(text(),'Create trial cluster')]"); }
}

export default new CreateCluster();
