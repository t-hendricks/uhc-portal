import Page from './page';

class GlobalNav extends Page {
  closeSideBar(body) {
    if (!body.find('#chr-c-sidebar').is(':visible')) {
      cy.get('#nav-toggle').click();
    }
  }

  navigateTo(text) {
    cy.get('body').then(($body) => {
      this.closeSideBar($body);
      cy.get('.pf-c-skeleton').should('not.exist');
      cy.contains('a.pf-c-nav__link', text)
        .click();
    });
  }

  closeSideBarNav() {
    cy.get('body').then(($body) => {
      this.closeSideBar($body);
    });
  }
}

export default new GlobalNav();
