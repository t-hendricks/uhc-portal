import Page from './page';

class GlobalNav extends Page {
  async navigateTo(text) {
    const link = await $(`//nav[@aria-label = "Insights Global Navigation"]//a[text() = "${text}"]`);
    await link.click();
    await expect(link).toHaveElementClass('pf-m-current');
  }
}

export default new GlobalNav();
