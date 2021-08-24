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
  get inputUsername() { return $('#username'); }

  get inputPassword() { return $('#password'); }

  get btnNext() { return $('#login-show-step2'); }

  get btnSubmit() { return $('#kc-login'); }

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

  async open() {
    return super.open('/openshift?fake=true');
  }
}
export default new LoginPage();
