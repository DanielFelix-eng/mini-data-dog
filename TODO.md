# TODO - Auth fixes (token/cookie + verify flow)

- [x] Fix cookie sending so `req.cookies.token` is actually present on protected routes.
  - Change `sameSite` from `strict` to `lax` (dev-friendly) and keep `httpOnly`.
  - Optionally set `secure` to false in dev (already done via NODE_ENV check).
- [x] Fix wrong resend endpoint in VerifyEmail page.
  - Update `fetch('/api/resendVerification')` -> `fetch('/api/auth/resendVerification')`.

- [x] (Optional) Add a route `GET /api/auth/debug/cookies` that returns whether cookie token exists (do not log token value).


- [ ] Run quick sanity checks:
  - Signup -> verify page should accept code (middleware passes).
  - Resend verification should hit correct endpoint.
  - Login -> dashboard/projects should load without 401.

