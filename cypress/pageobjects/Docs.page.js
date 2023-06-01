import Page from './page';


class Docs extends Page {
  containerPlatformDocPath="https://docs.openshift.com/container-platform/";

  getcontainerPlatformDocAbsolutePath (version, relativePath) {
    var expression = 'a[href=' + '"' + this.containerPlatformDocPath + version + "/" + relativePath + '"]';
    return cy.get(expression);
  }
}

export default new Docs();
