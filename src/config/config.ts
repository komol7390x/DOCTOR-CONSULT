import dotenv from 'dotenv';
dotenv.config();

export const config = {
  PORT: Number(process.env.PORT),
  APP_VERSION: String(process.env.APP_VERSION),
  URL: String(process.env.URL),
  DATABASE_URL: String(process.env.DATABASE_URL),
  NODE_ENV: String(process.env.NODE_ENV),
  TOKEN: {
    ACCESS_TOKEN_KEY: String(process.env.ACCESS_TOKEN_KEY),
    ACCESS_TOKEN_TIME: Number(process.env.ACCESS_TOKEN_TIME),
    REFRESH_TOKEN_KEY: String(process.env.REFRESH_TOKEN_KEY),
    REFRESH_TOKEN_TIME: Number(process.env.REFRESH_TOKEN_TIME)
  }
};
