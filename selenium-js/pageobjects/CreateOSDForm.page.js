import Page from './page';

class CreateOSDFormPage extends Page {
  get fakeClusterBanner() { return $("//div[contains(text(), 'On submit, a fake OSD cluster will be created')]"); }

  get clusterNameInput() { return $('input#name'); }

  get clusterNameInputError() { return $('input#name ~ div.pf-m-error'); }

  get submitButton() { return $('button.pf-c-button.pf-m-primary'); }
}

export default new CreateOSDFormPage();
