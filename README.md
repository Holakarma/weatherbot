simple weather bot

## Structure

```text
src/
  app/                  # bootstrap + runtime mode resolution
  config/               # env loading and validation
  integrations/         # external services clients
  transport/            # telegram, polling and webhook transports
  shared/               # cross-cutting utilities
```

## Scripts

- `npm run dev` -> polling mode
- `npm run build` -> build TypeScript to `dist/`
- `npm start` -> build + webhook mode from `dist/index.js`

## Required env variables

- `BOT_TOKEN`
- `WEATHER_API_TOKEN`
- `PORT` (optional, default `3000`)
- `DOMAIN` (required for webhook mode)
