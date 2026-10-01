import { createApp } from './app.js';

const port = Number(process.env.PORT) || 3107;
const app = createApp();
app.listen(port, () => {
  console.log(`[backend] listening on http://localhost:${port}`);
});
