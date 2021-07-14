import LoginPage from '../pageobjects/login.page';
import TokenPages from '../pageobjects/Tokens.page';

describe('Token pages', async () => {
  it('login', async () => {
    await LoginPage.open();
    await LoginPage.login();
  });

  it('ocm-cli token page', async () => {
    await TokenPages.navigateToOCMToken();
    await expect(await TokenPages.title()).toHaveText('OpenShift Cluster Manager API Token');

    const button = await TokenPages.loadTokenButton();
    await expect(button).toExist();

    /*
    Disabled to avoid hitting offline_session_limit_exceeded.

    await button.click();

    await expect(await TokenPages.loadTokenButton()).not.toExist();
    await expect(await TokenPages.tokenBox()).toHaveValueContaining('eyJ');
    await expect(await TokenPages.commandBox()).toHaveValueContaining('ocm login --token="eyJ');
    */
  });

  it('rosa token page', async () => {
    await TokenPages.navigateToROSAToken();
    await expect(await TokenPages.title()).toHaveText('OpenShift Cluster Manager API Token');

    const button = await TokenPages.loadTokenButton();
    await expect(button).toExist();

    /*
    Disabled to avoid hitting offline_session_limit_exceeded.

    await button.click();

    await expect(await TokenPages.loadTokenButton()).not.toExist();
    await expect(await TokenPages.tokenBox()).toHaveValueContaining('eyJ');
    await expect(await TokenPages.commandBox()).toHaveValueContaining('rosa login --token="eyJ');
    */
  });
});
