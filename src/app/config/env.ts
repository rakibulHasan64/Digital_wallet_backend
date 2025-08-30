import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
  PORT: string;
  DB_URL: string;
  NODE_ENV: 'development' | 'production';
    BCRYPT_SALT_ROUND: string;
  JWT_ACCESS_EXPIRES: string;
  JWT_REFRESH_EXPIRES: string;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  EXPRESS_SESSION_SECRET: string;
  GOOGLE_CALLBACK_URL: string;
  FONTEND_URL: string;

  EMAIL_SENDER: {
    SMTP_HOST: string;
    SMTP_PORT: string;
    SMTP_USER: string;
    SMTP_PASS: string;
    SMTP_FROM: string;
  };
}

const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVariables: string[] = ["PORT",
    "PORT",
    "DB_URL",
    "NODE_ENV",
    "BCRYPT_SALT_ROUND",      
    "JWT_ACCESS_EXPIRES",     
   "JWT_ACCESS_SECRET",
   "ADMIN_EMAIL",
   "ADMIN_PASSWORD",
   "JWT_REFRESH_EXPIRES",
   "JWT_REFRESH_SECRET",
   "GOOGLE_CLIENT_SECRET",
   "GOOGLE_CLIENT_ID",
   "EXPRESS_SESSION_SECRET",
   "GOOGLE_CALLBACK_URL",
    "FONTEND_URL",
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_PASS",
    "SMTP_FROM",
  ];

  requiredEnvVariables.forEach(key => {
    if (!process.env[key]) {
      throw new Error(`Missing require environment variabl ${key}`);
    }
  });

  return {
      PORT: process.env.PORT as string,
    DB_URL: process.env.DB_URL as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
    BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
    JWT_ACCESS_EXPIRES:  process.env.JWT_ACCESS_EXPIRES as string,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
    JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES as string,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL as string,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD as string,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
    EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,
    FONTEND_URL: process.env.FONTEND_URL as string,
    EMAIL_SENDER: {
      SMTP_HOST: process.env.SMTP_HOST as string,
      SMTP_PORT: process.env.SMTP_PORT as string,
      SMTP_USER: process.env.SMTP_USER as string, // ✅ টাইপো ফিক্স
      SMTP_PASS: process.env.SMTP_PASS as string,
      SMTP_FROM: process.env.SMTP_FROM as string,
    },
  };
};

export const envVars = loadEnvVariables();
