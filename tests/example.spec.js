import {test, expect} from '@playwright/test';
import { loginPage } from '../pages/loginPage';

test.describe('ExpandTesting', () => {

  test.describe('ET - Login UI', () => {
    test('ET - Login', async ({page}) =>{
      const login = new loginPage(page);
      await login.goto();
      expect(page).toHaveURL('https://practice.expandtesting.com/login')
      });
  });
  

  test.describe('ET - Healthcheck API', () => {
    test('ET-Healthcheck API /GET', async ({request})=>{
    const resp = await request.get('notes/api/health-check');
    // Validate status
    expect(resp.status()).toBe(200);
    
    // Get the json body
    const resBody = await resp.json();
    
    // Validate Object Body Schema
    expect(resBody).toMatchObject({
      success: true,
      status: 200,
      message: expect.any(String)
    });

    // Validate json Body
    expect(resBody.success).toBe(true);
    expect(resBody.status).toBe(200);
    expect(resBody.message).toBe("Notes API is Running");
    });
  });
      
});