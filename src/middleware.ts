import { defineMiddleware } from 'astro:middleware';

const protectedRoutes = '/admin';
const loginRoute = '/login';
const sessionCookieName = 'token';

export const onRequest = defineMiddleware(async (context, next) => {
  const currentPath = context.url.pathname;

  if (currentPath.startsWith(protectedRoutes)) {
    if (!context.cookies.has(sessionCookieName)) {
        const redirectTo = encodeURIComponent(currentPath + context.url.search);
        return context.redirect(`${loginRoute}?redirectTo=${redirectTo}`);
    }
  }

  return next();
}); 