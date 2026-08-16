# Render live deployment findings

- Render service: `night-market`
- Service URL: https://night-market-saqm.onrender.com
- GitHub commit deployed: `0295ccc` (`Clean Render production configuration`)
- Render selected Node.js `22.13.0` from `.node-version`.
- Build command executed successfully: `pnpm install --frozen-lockfile && pnpm check && pnpm run build`.
- Build completed successfully at 13:04:35 local dashboard time.
- Environment edit added `OAUTH_SERVER_URL=https://api.manus.im` and triggered a new deploy.
- Runtime startup logs have not yet appeared after the build; continue monitoring until `Server running` and final live status are visible.
- Earlier deployment logs had `OAUTH_SERVER_URL` empty; the new deployment is intended to remove that warning.
