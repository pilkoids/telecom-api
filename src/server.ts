import { createApp } from './app';
import { config } from './config';

const app = createApp();

app.listen(config.port, () => {
  console.log(`Telecom Cart API server listening on port ${config.port}`);
  console.log(`Environment: ${config.nodeEnv}`);
  console.log(`Cart expiry: ${config.cartExpiryMs}ms`);
});
