import Page from './page';
import Docs from './Docs.page';

class Releases extends Page {
  isReleasesPage () {
    cy.contains('Latest OpenShift releases', {timeout: 60000}).should('be.visible');
    cy.contains('Channels', {timeout: 60000}).should('be.visible');
  }

  checkChannelDetailAndSupportStatus = (version, support_type) => {
    const major_version = version.split('.')[0];
    const minor_version = version.split('.')[1];
    cy.get(`.ocm-l-ocp-releases__channel-detail-level a[href^="https://docs.openshift.com/container-platform/${version}/release_notes/ocp-${major_version}-${minor_version}"]`).first().as('link_to_version').should('exist');
    cy.get('@link_to_version').parent().next('.support-status-label').within(() => {cy.contains(`${support_type}`).should('exist')});
    cy.get('@link_to_version')
      .parentsUntil('article')
      .within(() => {
        cy.get('button[aria-label="More information"]').scrollIntoView().click({force: true});
      });
    Docs.getcontainerPlatformDocAbsolutePath(version, "updating/understanding-upgrade-channels-release.html#candidate-version-channel_understanding-upgrade-channels-releases")
      .should('exist')
      .and('contain.text', 'Learn more about candidate channels');
    cy.get('button[aria-label="Close"]').click();
  }
}

export default new Releases();
