/* eslint-disable prettier/prettier */
export default () => ({
  port: parseInt(process.env.PORT),
  database: {
    mongo: {
      host: process.env.MONGO_HOST,
      port: process.env.MONGO_PORT,
      database: process.env.MONGO_DATABASE,
      username: process.env.MONGO_USERNAME,
      password: process.env.MONGO_PASSWORD,
    }
  }
});
