import { test, expect } from '@playwright/test'
import { createPost, createUser, login, resetDb } from './helper'

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

});

test.describe('flujo login', () => {
  test.beforeEach(async ({ page, request }) => {
    await resetDb(request);
    await createUser(request, { username: 'marselo', email: 'marselo@marselo.com', password: 'hola' });
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

    // Muestra el error y permanece en /login sin iniciar sesión]
    const errorDiv = page.locator('.error')
    await expect(errorDiv).toContainText('Invalid username or password');
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();

    // Al volver a /threads sigue como invitado
    await page.getByRole('link', { name: 'Continue as guest' }).click();
    await expect(page.getByText('Invitado')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Logout' })).toHaveCount(0);
  })
});

test.describe('when logged in', () => {
  test.beforeEach(async ({ page, request }) => {
    await resetDb(request);
    await createUser(request, { username: 'marselo', email: 'marselo@marselo.com', password: 'hola' });
    await login(page, 'marselo', 'hola')
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
  })

  test('un usuario puede cerrar sesión', async ({ page }) => {
    await page.getByRole('button', { name: 'Logout' }).click();

    // Vuelve a verse como invitado, con las opciones de Login y Register
    await expect(page.getByText('Invitado')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Logout' })).toHaveCount(0);

    // La sesión no se restaura al recargar la página
    await page.reload();
    await expect(page.getByText('Invitado')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Logout' })).toHaveCount(0);
  })

  test('el autor del thread es el nombre de usuario de la sesión', async ({ page }) => {
    // Sin indicar autor en el formulario
    await createPost(page, 'Comentario de usuario autenticado');

    const post = page.locator('.post').filter({ hasText: 'Comentario de usuario autenticado' });
    await expect(post).toHaveCount(1);
    await expect(post).toContainText('marselo');
    await expect(post).not.toContainText('Anonymous');
  })
})

test.describe('when not logged in', () => {
  test.beforeEach(async ({ page, request }) => {
    await resetDb(request);
    await page.goto('/threads')
  })

  test('un invitado puede crear un thread', async ({ page }) => {
    await createPost(page, 'Comentario creado por playwright', 'Playwright');

    // La página contiene el thread recién creado
    const post = page.locator('.post').filter({ hasText: 'Comentario creado por playwright' });
    await expect(post).toHaveCount(1);
    await expect(post).toContainText('Playwright');
  })

  test('no se puede crear un thread con el contenido vacío', async ({ page }) => {
    // Espera a que termine de cargar la lista antes de comprobar que está vacía
    await expect(page.getByText('Han creado 0 threads!')).toBeVisible();

    await page.getByTestId('author').fill('Playwright');
    await page.getByRole('button', { name: 'Post' }).click();

    // No se publicó ningún thread
    await expect(page.locator('.post')).toHaveCount(0);
    await expect(page.getByText('Han creado 0 threads!')).toBeVisible();
  })
})
