import express, { Request, Response } from 'express';
import cors from 'cors';
import "./app/config/passport"
import { StatusCodes } from 'http-status-codes';
import { router } from './app/routes';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import expressSession from "express-session"
import { envVars } from './app/config/env';



const app = express();


app.use(expressSession({
  secret: envVars.EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser())
app.use(express.json());

app.use(express.urlencoded({ extended: true }))
app.use(cors({
  origin: envVars.FONTEND_URL,
  credentials: true
}))

app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    message: 'Welcome to Node.js, Express, Mongoose Backend',
  });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
