import Page from './page';
import LinkHelper from './LinkHelper';
import ButtonHelper from './ButtonHelper';

class Overview extends Page {
  static #path = '/openshift/overview';

  assertToBeOverviewUrl() {
    super.assertUrlIncludes(Overview.#path);
  }

  isOverviewUrl() {
    return cy.$$(location).attr('href').includes(Overview.#path);
  }

  isOverviewPage() {
    cy.contains('Get started with OpenShift', { timeout: 60000 }).should('be.visible');
  }

  header = () => {
    cy.get('[data-testid="OverviewHeader"]').as('header').should('be.visible');
    return {
      checkTitle: function (title) {
        cy.get('@header').find('h1').should('have.text', title);
        return this;
      },
      checkLink: function (title, link) {
        return new LinkHelper({ name: 'header', isParent: true }, title, link).linkExists();
      },
    };
  };

  centralSectionCard(id) {
    cy.get(`[data-testid="${id}"]`).as(id);
    return {
      btnShouldExist: function (btnText, link) {
        return new ButtonHelper({ name: id, isParent: true }, btnText, link).btnExists();
      },
      shouldHaveLabel: function (labelType) {
        cy.get(`@${id}`).find('[data-testtag="label"]').should('have.text', labelType);
        return this;
      },
      checkLink: function (title, link) {
        return new LinkHelper({ name: id, isParent: true }, title, link).linkExists();
      },
      cardDetails: function (cardDetails) {
        const cardDetailsLabelNames = Object.keys(cardDetails);
        cy.get(`@${id}`)
          .find('dl')
          .find('dt')
          .should('have.length', cardDetailsLabelNames.length)
          .each(($el, index) => {
            const labelName = cardDetailsLabelNames[index];
            cy.wrap($el).contains(labelName);
            cy.wrap($el).next('dd').contains(cardDetails[labelName]);
          });
        return this;
      },
      get cyObj() {
        return cy.get(`@${id}`);
      },
    };
  }

  centralSectionCardsExpected(numberOfCards) {
    cy.get('[data-testid^="offering-card"]').should('have.length', numberOfCards);
  }

  centralSectionFooterLinkExists(title, link) {
    cy.get('[data-testid^="offering-card"]')
      .parentsUntil('section')
      .next('a')
      .contains(title)
      .as('centralSectionFooterLink')
      .should('have.attr', 'href', link);
    return new ButtonHelper(
      { name: 'centralSectionFooterLink', isParent: false },
      title,
      link,
    ).btnExists();
  }

  recommendedContentsExpected(numberOfContents) {
    cy.get('[data-testid^="recommendedContent_"]').should('have.length', numberOfContents);
  }

  recommendedContent(id) {
    cy.get(`[data-testid="${id}"]`).as(id);
    return {
      shouldHaveLabel: function (labelType) {
        cy.get(`@${id}`).find('[data-testtag="label"]').should('have.text', labelType);
        return this;
      },
      checkLink: function (title, link) {
        return new LinkHelper({ name: id, isParent: true }, title, link).linkExists();
      },
      get cyObj() {
        return cy.get(`@${id}`);
      },
    };
  }

  recommendedContentFooterLinkExists(title, link) {
    cy.get('[data-testid="recommendedContentFooterLink"]').as('recommendedContentFooterLink');
    return new LinkHelper(
      { name: 'recommendedContentFooterLink', isParent: false },
      title,
      link,
    ).linkExists();
  }
}

export default new Overview();
