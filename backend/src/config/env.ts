import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'default_access_secret_change_me',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'default_refresh_secret_change_me',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',

  openaiApiKey: process.env.OPENAI_API_KEY || '',
};
