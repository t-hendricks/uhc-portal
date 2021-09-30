import Page from './page';

class IdentityProvidersPage extends Page {
  async isAddIDPPage(selectedIDP) {
    const URL = await browser.getUrl();
    // eslint-disable-next-line no-return-await
    return URL.indexOf(`/add-idp/${selectedIDP.toLowerCase()}`) !== -1 && await $('div#identity-provider-form');
  }

  get IDPNameInput() { return $('input#name'); }

  // eslint-disable-next-line no-undef
  get IDPFormRequiredFields() { return $$('//input[@required=""]'); }

  get addIDPConfirmBtn() { return $('//button[contains(text(), "Add")]'); }
}

export default new IdentityProvidersPage();
