import { Page, Locator } from '@playwright/test';
import { getUserByEnv } from '../configs/users';

export class LoginPage {
  readonly page: Page;

  // 🔹 Selectores arriba (como pediste)
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.emailInput = page.locator('//html/body/div[1]/div[1]/div/div[1]/div/div[2]/div[2]/form/div[1]/div/div[2]/input');
    this.passwordInput = page.locator('//html/body/div[1]/div[1]/div/div[1]/div/div[2]/div[2]/form/div[2]/div/div[2]/input');
    this.loginButton = page.locator('//html/body/div[1]/div[1]/div/div[1]/div/div[2]/div[2]/form/div[3]/button');
  }

  async goToLogin() {
    await this.page.goto('/login/');
  }

  async login(env: string) {
    const user = getUserByEnv(env);

    await this.emailInput.fill(user.email);
    await this.passwordInput.fill(user.password);
    await this.loginButton.click();
  }
}