// tests/login.spec.js
import { test, expect } from '@playwright/test';
import { loginPage } from '../pages/loginPage';

const NOTES_API_BASE_URL = 'https://practice.expandtesting.com/notes/api';

test.describe('ExpandTesting - Login', () => {

  // ---------- UI TESTS ----------
  test.describe('ET - Login UI', () => {
    test.beforeEach(async ({ page }) => {
      const login = new loginPage(page);
      await login.goto();
      await login.assertOnLoginPage();
    });

    test('ET - Login page renders correctly', async ({ page }) => {
      const login = new loginPage(page);

      await expect(page).toHaveTitle(/Test Login page/i);
      await expect(login.usernameInput).toBeVisible();
      await expect(login.passwordInput).toBeVisible();
      await expect(login.loginButton).toBeEnabled();

      // Password should be masked
      await expect(login.passwordInput).toHaveAttribute('type', 'password');
    });

    test('ET - Successful login with valid credentials', async ({ page }) => {
      const login = new loginPage(page);

      await login.loginWithValidCredentials();
      await login.expectSuccessfulLogin();
    });

    test('ET - Invalid username shows correct error and stays on login', async ({ page }) => {
      const login = new loginPage(page);

      await login.login('wrongUser', 'SuperSecretPassword!');
      await login.expectErrorMessage('Your password is invalid!');
    });

    test('ET - Invalid password shows correct error and stays on login', async ({ page }) => {
      const login = new loginPage(page);

      await login.login('practice', 'WrongPassword');
      await login.expectErrorMessage('Your password is invalid!');
    });

    test('ET - Login via Enter key on password field', async ({ page }) => {
      const login = new loginPage(page);

      await login.usernameInput.fill('practice');
      await login.passwordInput.fill('SuperSecretPassword!');
      await login.passwordInput.press('Enter');

      await login.expectSuccessfulLogin();
    });
  });

  // ---------- LOGIN API TESTS ----------
  test.describe('ET - Login API', () => {
    // NOTE: You should set these env vars to a real registered Notes user
    const validEmail = process.env.NOTES_API_EMAIL;
    const validPassword = process.env.NOTES_API_PASSWORD;

    test('ET - Login API /POST - invalid credentials returns 401', async ({ request }) => {
      const resp = await request.post(`${NOTES_API_BASE_URL}/users/login`, {
        form: {
          email: 'invalid@example.com',
          password: 'wrong-password',
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          accept: 'application/json',
        },
      });

      expect(resp.status()).toBe(401);

      const body = await resp.json();
      expect(body).toMatchObject({
        success: false,
        status: 401,
        message: 'Incorrect email address or password',
      });
    });

    test('ET - Login API /POST - successful login returns token', async ({ request }) => {
      const resp = await request.post(`${NOTES_API_BASE_URL}/users/login`, {
        form: {
          email: validEmail,
          password: validPassword,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          accept: 'application/json',
        },
      });

      expect(resp.status()).toBe(200);

      const body = await resp.json();

      // From sample docs/articles: message "Login successful" and a token in data.token :contentReference[oaicite:2]{index=2}
      expect(body).toMatchObject({
        success: true,
        message: 'Login successful',
        data: {
          token: expect.any(String),
        },
      });
    });
  });

  // ---------- (OPTIONAL) HEALTHCHECK API (unchanged) ----------
  test.describe('ET - Healthcheck API', () => {
    test('ET - Healthcheck API /GET', async ({ request }) => {
      const resp = await request.get(`${NOTES_API_BASE_URL}/health-check`);

      expect(resp.status()).toBe(200);

      const resBody = await resp.json();

      expect(resBody).toMatchObject({
        success: true,
        status: 200,
        message: expect.any(String),
      });

      expect(resBody.success).toBe(true);
      expect(resBody.status).toBe(200);
      expect(resBody.message).toBe('Notes API is Running');
    });
  });

});
