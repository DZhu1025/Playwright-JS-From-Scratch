// pages/loginPage.js
import { expect } from '@playwright/test';

export class loginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // UI locators – adjust if your DOM differs
    this.usernameInput = page.getByRole('textbox', {name: 'Username'});
    this.passwordInput = page.getByRole('textbox', {name: 'Password'});
    this.loginButton   = page.getByRole('button', {name: 'Login'});

    // Adjust this selector to whatever the message element is on the page
    this.flashMessage  = page.locator('div#flash-message'); 

    // On the secure page after successful login
    this.logoutButton  = page.getByRole('link', { name: 'Logout' });
    this.secureHeader  = page.getByRole('heading', { name: /secure area/i });
  }

  async goto() {
    // If you’ve set baseURL in Playwright config, you can change this to '/login'
    await this.page.goto('https://practice.expandtesting.com/login');
  }

  async assertOnLoginPage() {
    await expect(this.page).toHaveURL(/\/login$/);
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async loginWithValidCredentials() {
    await this.login('practice', 'SuperSecretPassword!');
  }

  async expectSuccessfulLogin() {
    await expect(this.page).toHaveURL(/\/secure$/);
    await expect(this.flashMessage).toContainText('You logged into a secure area!');
    await expect(this.logoutButton).toBeVisible();
  }

  async expectErrorMessage(expectedText) {
    await expect(this.flashMessage).toContainText(expectedText);
    await this.assertOnLoginPage();
  }
}
