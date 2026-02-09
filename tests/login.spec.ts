import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Login', () => {

  test('Login with valid credentials',
    { tag: ['@dev', '@qa', '@app', '@smoke', '@login'] },
    
    async ({ page }, testInfo) => {

      testInfo.annotations.push({
        type: 'test_key',
        description: 'XSP-56'
      });

      const env = process.env.TARGET_ENV || 'dev';
      const loginPage = new LoginPage(page);

      await test.step('Abrir la aplicación', async () => {
        await page.goto('/');
      });

      await test.step('Iniciar login con credenciales válidas', async () => {
        await loginPage.login(env);
      });

      await test.step('Validar que el usuario ingresó correctamente', async () => {
        await expect(page).not.toHaveURL(/login/);
      });

    }
  );

});