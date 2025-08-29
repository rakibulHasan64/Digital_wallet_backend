/* eslint-disable no-console */
import { Server } from 'http';
import mongoose from 'mongoose';
import { envVars } from './app/config/env';
import app from './app';
import { seedSuPerAdmin } from './app/utils/suprer.admin';


let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);
    console.log('Connected to DB!!');

    server = app.listen(envVars.PORT, () => {
      console.log(`Server is listening to port ${envVars.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};
(async () => {
  
  await startServer();
  await seedSuPerAdmin();
})();



process.on('SIGTERM', () => {
  console.log('SIGTERM signal recieved... Server shutting down..');
  if (server) {
    server.close(() => process.exit(1));
  }
});

process.on('SIGINT', () => {
  console.log('SIGINT signal recieved... Server shutting down..');
  if (server) {
    server.close(() => process.exit(1));
  }
});

process.on('unhandledRejection', err => {
  console.log('Unhandled Rejection detected... Server shutting down..', err);
  if (server) {
    server.close(() => process.exit(1));
  }
});

process.on('uncaughtException', err => {
  console.log('Uncaught Exception detected... Server shutting down..', err);
  if (server) {
    server.close(() => process.exit(1));
  }
});
