export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    mongo: {
      uri: process.env.MONGO_URI,
      host: process.env.MONGO_HOST,
      port: process.env.MONGO_PORT,
      database: process.env.MONGO_DATABASE,
      username: process.env.MONGO_USERNAME,
      password: process.env.MONGO_PASSWORD,
    },
  },
  jwt: {
    access: {
      secret: process.env.JWT_ACCESS_SECRET || 'access-secret',
      expire_time: process.env.JWT_ACCESS_EXPIRES_TIME || '15m',
    },
    refresh: {
      secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
      expire_time: process.env.JWT_REFRESH_EXPIRES_TIME || '30d',
    },
  },
});
