import Page from './page';
import GlobalNav from './GlobalNav.page';
import DownloadsPage from './Downloads.page';

class TokenPages extends Page {
  async navigateToOCMToken() {
    await GlobalNav.navigateTo('Downloads');
    const button = await DownloadsPage.ocmTokenButton();
    await button.click();
  }

  async navigateToROSAToken() {
    await browser.url('/openshift/token/rosa');
  }

  async loadTokenButton() {
    return $('//button[contains(., "Load token")]');
  }

  async title() {
    return $('//main//h1');
  }

  async tokenBox() {
    return $('//input[@aria-label = "Copyable token"]');
  }

  async commandBox() {
    return $('//input[@aria-label = "Copyable command"]');
  }
}

export default new TokenPages();
