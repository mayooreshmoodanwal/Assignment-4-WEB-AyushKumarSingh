const validateEnv = () => {
  const required = ['MONGO_URI', 'JWT_SECRET', 'CLIENT_URL'];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

module.exports = validateEnv;
