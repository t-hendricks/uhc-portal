import Page from './page';

class GlobalNav extends Page {
  async navigateTo(text) {
    const navToggle = await $('#nav-toggle');
    const navSideBar = await $('#chr-c-sidebar');
    const isNavSideBarVisible = await navSideBar.isDisplayed();

    // Open side nav if not opened by default (smaller windows will default to closed).
    if (!isNavSideBarVisible) {
      await navToggle.click();
    }

    const link = await $(`//nav[@aria-label = "Insights Global Navigation"]//a[text() = "${text}"]`);
    await link.click();
  }
}

export default new GlobalNav();
