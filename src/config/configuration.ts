export default () => ({
  port: parseInt(process.env.PORT as string, 10) || 3000,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '60s',
  },
  mongoUri: process.env.MONGO_URI,
});
