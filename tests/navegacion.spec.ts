import { test, expect } from '@playwright/test';

test('Acceso a opciones desde el Menú', async ({ page }) => {
  await page.goto('http://localhost:4321/');
  await page.getByRole('link', { name: 'Crear Nueva Orden' }).click();
  await page.getByRole('link', { name: 'Regresar' }).click();
  await page.getByRole('link', { name: 'Iniciar Sesión (Admin)' }).click();
  await page.getByRole('link', { name: 'Regresar' }).click();
});

test('Navegación entre la página de crear nueva orden y inicio', async ({ page }) => {
  await page.goto('http://localhost:4321/');
  await page.getByRole('link', { name: 'Crear Nueva Orden' }).click();
  await page.getByRole('heading', { name: 'Crear Nueva Orden' }).click();
  await page.getByRole('link', { name: 'Regresar' }).click();
  await page.getByRole('heading', { name: 'Bienvenido a Your Ideal Outfit' }).click();
});

test('Navegación entre la página de inciar sesión y inicio', async ({ page }) => {
  await page.goto('http://localhost:4321/');
  await page.getByRole('link', { name: 'Iniciar Sesión (Admin)' }).click();
  await page.getByRole('heading', { name: 'Iniciar Sesión (Admin)' }).click();
  await page.getByRole('link', { name: 'Regresar' }).click();
  await page.getByRole('heading', { name: 'Bienvenido a Your Ideal Outfit' }).click();
});

test('Crear un producto', async ({ page }) => {
  await page.goto('http://localhost:4321/');
  await page.getByRole('link', { name: 'Iniciar Sesión (Admin)' }).click();
  await page.getByRole('textbox', { name: 'Correo Electrónico' }).click();
  await page.getByRole('textbox', { name: 'Correo Electrónico' }).fill('correo@correo.com');
  await page.getByRole('textbox', { name: 'Contraseña' }).click();
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('password');
  await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
  await page.getByRole('link', { name: 'Productos' }).click();
  await page.getByRole('button', { name: 'Añadir Producto' }).click();
  await page.getByRole('textbox', { name: 'Nombre' }).click();
  await page.getByRole('textbox', { name: 'Nombre' }).fill('Blusa rosa');
  await page.getByRole('textbox', { name: 'Descripción' }).click();
  await page.getByRole('textbox', { name: 'Descripción' }).fill('Blusa rosa con escote talla L');
  await page.getByRole('spinbutton', { name: 'Precio' }).click();
  await page.getByRole('spinbutton', { name: 'Precio' }).fill('60000');
  await page.getByRole('spinbutton', { name: 'Stock' }).click();
  await page.getByRole('spinbutton', { name: 'Stock' }).fill('70');
  await page.getByRole('button', { name: 'Crear Producto' }).click();
});

test('Crear orden', async ({ page }) => {
  await page.goto('http://localhost:4321/');
  await page.getByRole('link', { name: 'Crear Nueva Orden' }).click();
  await page.getByRole('textbox', { name: 'Nombre Completo' }).click();
  await page.getByRole('textbox', { name: 'Nombre Completo' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Nombre Completo' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Nombre Completo' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Nombre Completo' }).fill('P');
  await page.getByRole('textbox', { name: 'Nombre Completo' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Nombre Completo' }).fill('Perla velez');
  await page.getByRole('textbox', { name: 'Documento Identidad' }).click();
  await page.getByRole('textbox', { name: 'Documento Identidad' }).fill('7089056431');
  await page.getByRole('textbox', { name: 'Teléfono de Contacto' }).click();
  await page.getByRole('textbox', { name: 'Teléfono de Contacto' }).fill('3123456788');
  await page.getByRole('textbox', { name: 'Dirección de Envío' }).click();
  await page.getByRole('textbox', { name: 'Dirección de Envío' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Dirección de Envío' }).fill('CRR 45 34');
  await page.getByRole('combobox').selectOption('1');
  await page.getByRole('button', { name: 'Realizar Pedido' }).click();
  await page.getByText('¡Orden creada exitosamente!').click();
});

