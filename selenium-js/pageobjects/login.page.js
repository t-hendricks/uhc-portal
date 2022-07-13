/* eslint-disable class-methods-use-this */
import Page from './page';
import { getAuthConfig } from '../authConfig';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class LoginPage extends Page {
  /**
     * define selectors using getter methods
     */
  get inputUsername() { return $('//input[@name="username"]'); }

  get inputPassword() { return $('//input[@name="password"]'); }

  get btnNext() { return $('//button[text()="Next"]'); }

  get btnSubmit() { return $('//button[@type="submit"][contains(text(), "Log in")]'); }

  async isLoginPage() {
    const URL = await browser.getUrl();
    return URL.includes('auth/realms/redhat-external/protocol/openid-connect');
  }

  async login() {
    const { username, password } = getAuthConfig();
    // TODO: properly support "already logged in" state
    await browser.waitUntil(this.isLoginPage, { timeoutMsg: 'Login failed: did not redirect to login page after timeout' });
    await (await this.inputUsername).setValue(username);
    await (await this.btnNext).click();
    const pw = await this.inputPassword;
    await pw.waitForDisplayed({ timeout: 10000 });
    await pw.setValue(password);
    await (await this.btnSubmit).click();
    await browser.waitUntil(async () => !await this.isLoginPage(), { timeoutMsg: 'Login failed: did not redirect after timeout' });
    await this.closePendoIfShowing();
    await this.closeCookieConsentIfShowing();
  }

  async closePendoIfShowing() {
    // This might not work, it takes time for Pendo to pop up.
    // But don't want to block here waiting, have fallback in wdio.conf.js.
    const close = await $('._pendo-close-guide');
    if (await close.isExisting()) {
      // eslint-disable-next-line no-console
      console.log("Trying to close pendo guide");
      await close.click();
    }
  }

  get cookieConsent() { return $('//*[@id="truste-consent-track"][contains(., "cookies")]'); }

  async closeCookieConsentIfShowing() {
    // Consent footer added in https://github.com/RedHatInsights/insights-chrome/pull/1734
    const footer = await this.cookieConsent;
    // TODO: Is there a race condition? In practice the footer appears before OCM content loads.
    if (await footer.isExisting()) {
      console.log("Trying to close cookie consent");
      const close = await footer.$('button#truste-consent-button');
      // Due to a bug cannot close the banner https://issues.redhat.com/browse/RHCLOUD-20205
      // workaround is to remove the banner from DOM instead
      // await close.click();
      await browser.execute("document.querySelector('#consent_blackbar').remove()");
      // Have to wait for fade-out animation before page is interactable.
      // The elements remain but become display: none;
      browser.waitUntil(async () => await !footer.isDisplayed());
    }
  }

  async open() {
    return super.open('/openshift?fake=true');
  }
}
export default new LoginPage();
