import { test, expect } from '@playwright/test'
import { createUser, login, resetDb } from './helper'

test.describe('Thread app', () => {
  // Todos los tests comparten la misma base de datos: no pueden correr en paralelo
  test.describe.configure({ mode: 'default' });

  test.beforeEach(async ({ page, request }) => {
    await resetDb(request);
    await createUser(request, { username: 'marselo', email: 'marselo@marselo.com', password: 'hola' });
    await page.goto('/threads')
  });

  test('can render "/threads', async ({ page }) => {
    await page.goto('/threads')
  });

  test('flujo exitoso de inicio de sesión', async ({ page }) => {
    // Antes de iniciar sesión se ve como invitado
    await expect(page.getByText('Invitado')).toBeVisible();

    await page.getByRole('link', { name: 'Login' }).click();
    await expect(page).toHaveURL(/\/login$/);

    await page.getByTestId('username').fill('marselo');
    await page.getByTestId('password').fill('hola');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Redirige a /threads y muestra al usuario con la opción de cerrar sesión
    await expect(page).toHaveURL(/\/threads$/);
    await expect(page.getByText('marselo', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
    await expect(page.getByText('Invitado')).toHaveCount(0);
  })

  test('flujo erróneo de inicio de sesión', async ({ page }) => {
    // El usuario no existe en la base de datos
    await login(page, 'noexiste', 'incorrecta');

    // Muestra el error y permanece en /login sin iniciar sesión
    await expect(page.getByText('Invalid username or password')).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();

    // Al volver a /threads sigue como invitado
    await page.getByRole('link', { name: 'Continue as guest' }).click();
    await expect(page.getByText('Invitado')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Logout' })).toHaveCount(0);
  })

})
