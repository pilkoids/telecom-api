export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  cartExpiryMs: parseInt(process.env.CART_EXPIRY_MS || '300000', 10), // 5 minutes default
  nodeEnv: process.env.NODE_ENV || 'development',
};
