import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Login', () => {

  test('PRUEB-3 @dev @qa @app login works', async ({ page }) => {
    const env = process.env.TARGET_ENV || 'dev';
    const loginPage = new LoginPage(page);

    await page.goto('/');
    await loginPage.login(env);
    console.log('URL actual:', page.url());
   
    await expect(page).not.toHaveURL(/login/);
    await page.waitForTimeout(3000);
  });
});