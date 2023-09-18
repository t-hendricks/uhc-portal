import Page from './page';

class GlobalNav extends Page {

  clustersNavigation = () => cy.get('a[data-quickstart-id="openshift"]');
  overviewNavigation = () => cy.get('a[data-quickstart-id="openshift_overview"]');
  releasesNavigation = () => cy.get('a[data-quickstart-id="openshift_releases"]');
  downloadsNavigation = () => cy.get('a[data-quickstart-id="openshift_downloads"]');

  closeSideBar(body) {
    if (!body.find('#chr-c-sidebar').is(':visible')) {
      cy.get('#nav-toggle').click();
    }
  }

  navigateTo(text) {
    cy.get('body').then(($body) => {
      this.closeSideBar($body);
      cy.get('.pf-c-skeleton').should('not.exist');
      cy.contains('a.pf-c-nav__link', text).click();
    });
  }

  closeSideBarNav() {
    cy.get('body').then(($body) => {
      this.closeSideBar($body);
    });
  }

  breadcrumbItem = (item) => cy.get('ol.pf-c-breadcrumb__list > li').contains(item);
}

export default new GlobalNav();
