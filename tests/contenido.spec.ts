import { test, expect } from '@playwright/test';

test('Validar que el título "Bienvenido a Your Ideal Outfit" sea visible en la homepage', 
  async ({ page }) => {
  await page.goto('http://localhost:4321/');
  await page.getByRole('heading', { name: 'Bienvenido a Your Ideal Outfit' }).click();
});

test('Validar existencia del botón Crear Nueva Orden', async ({ page }) => {
  await page.goto('http://localhost:4321/');
  await page.getByRole('link', { name: 'Crear Nueva Orden' }).click();
});

test('Validar existencia del botón Iniciar Sesión (Admin)', async ({ page }) => {
  await page.goto('http://localhost:4321/');
  await page.getByRole('link', { name: 'Iniciar Sesión (Admin)' }).click();
});

test('Validar título de la página para crear una orden', async ({ page }) => {
  await page.goto('http://localhost:4321/');
  await page.getByRole('link', { name: 'Crear Nueva Orden' }).click();
  await page.getByRole('heading', { name: 'Crear Nueva Orden' }).click();
});

test('Validar título de la pagina para inciar sesion', async ({ page }) => {
  await page.goto('http://localhost:4321/');
  await page.getByRole('link', { name: 'Iniciar Sesión (Admin)' }).click();
  await page.getByRole('heading', { name: 'Iniciar Sesión (Admin)' }).click();
});

test('validar contenido del formulario para crear nueva orden', async ({ page }) => {
  await page.goto('http://localhost:4321/');
  await page.getByRole('link', { name: 'Crear Nueva Orden' }).click();
  await page.getByText('Nombre Completo').click();
  await page.getByText('Documento Identidad').click();
  await page.getByText('Teléfono de Contacto').click();
  await page.getByText('Dirección de Envío').click();
  await page.getByText('Tu Pedido').click();
});

test('validar contenido del formulario para incio de sesión', async ({ page }) => {
  await page.goto('http://localhost:4321/');
  await page.getByRole('link', { name: 'Iniciar Sesión (Admin)' }).click();
  await page.getByRole('heading', { name: 'Iniciar Sesión (Admin)' }).click();
  await page.getByText('Correo Electrónico').click();
  await page.getByText('Contraseña').click();
  await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
});

test('validar texto del inicio del panel de administración', async ({ page }) => {
  await page.goto('http://localhost:4321/');
  await page.getByRole('link', { name: 'Iniciar Sesión (Admin)' }).click();
  await page.getByRole('textbox', { name: 'Correo Electrónico' }).click();
  await page.getByRole('textbox', { name: 'Correo Electrónico' }).fill('correo@correo.com');
  await page.getByRole('textbox', { name: 'Contraseña' }).click();
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('password');
  await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
  await page.getByRole('heading', { name: 'Bienvenido al Panel de Administración' }).click();
});

test('validar contenido de inicio página crear productos', async ({ page }) => {
  await page.goto('http://localhost:4321/');
  await page.getByRole('link', { name: 'Iniciar Sesión (Admin)' }).click();
  await page.getByRole('textbox', { name: 'Correo Electrónico' }).click();
  await page.getByRole('textbox', { name: 'Correo Electrónico' }).fill('correo@correo.com');
  await page.getByRole('textbox', { name: 'Contraseña' }).click();
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('password');
  await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
  await page.getByRole('link', { name: 'Productos' }).click();
  await page.getByRole('button', { name: 'Añadir Producto' }).click();
  await page.getByRole('heading', { name: 'Crear Nuevo Producto' }).click();
});

test('validar contenido de inicio página consulta de órdenes', async ({ page }) => {
  await page.goto('http://localhost:4321/');
  await page.getByRole('link', { name: 'Iniciar Sesión (Admin)' }).click();
  await page.getByRole('textbox', { name: 'Correo Electrónico' }).click();
  await page.getByRole('textbox', { name: 'Correo Electrónico' }).fill('correo@correo.com');
  await page.getByRole('textbox', { name: 'Contraseña' }).click();
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('password');
  await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
  await page.getByRole('link', { name: 'Órdenes' }).click();
  await page.getByRole('heading', { name: 'Órdenes', exact: true }).click();
  await page.getByRole('heading', { name: 'Gestionar Órdenes' }).click();
});