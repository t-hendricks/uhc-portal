/**
 *
 */
class LinkHelper {
  #parentAlias;
  #href;
  #title;
  #classes;
  #baseUrl;
  #elementAlias;
  #linkNumber;

  static #linkCounter = 0;

  constructor(alias, title, href, classes) {
    if (alias.isParent) {
      this.#parentAlias = alias.name;
    } else {
      this.#elementAlias = alias.name;
    }
    this.#href = href;
    this.#title = title;
    this.#classes = classes ? '.' + classes.join('.') : '';
    this.#baseUrl = Cypress.config('baseUrl');
    this.#linkNumber = LinkHelper.#linkCounter++;
  }

  #element() {
    if (this.#parentAlias) {
      return cy.get(`@${this.#parentAlias}`).find('a' + this.#classes);
    } else {
      return cy.get(`@${this.#elementAlias}`);
    }
  }

  linkExists() {
    this.#element()
      .contains(this.#title)
      .as(`link-${this.#linkNumber}`)
      .should('have.attr', 'href', this.#href);
    const href = this.#href;
    const linkNumber = this.#linkNumber;
    var _isInternalLink = !/^http/i.test(href) || href.startsWith(this.#baseUrl);
    return {
      opensInRightTab: function (isInternalLink) {
        if (isInternalLink !== undefined) {
          _isInternalLink = isInternalLink;
        }
        if (_isInternalLink) {
          cy.get(`@link-${linkNumber}`).then(($link) => {
            if ($link.target) {
              expect($link.target).to.be.empty;
            }
          });
        } else {
          cy.get(`@link-${linkNumber}`).should('have.attr', 'target').should('not.be.empty');
        }
        return this;
      },
      successfullyOpens: function () {
        cy.request({
          url: href,
          followRedirect: true,
        }).then((resp) => {
          expect(resp.status).to.eq(200);
        });
        return this;
      },
      get cyObj() {
        return cy.get(`@link-${linkNumber}`);
      },
    };
  }
}

export default LinkHelper;
