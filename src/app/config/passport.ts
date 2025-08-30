import passport from "passport";
import { Strategy as GoogleStrategy, Profile,VerifyCallback } from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../modules/user/user.model";
import { Role } from "../modules/user/user.interface";
import httpStatus from "http-status-codes";
import { Strategy as LocalStrategy } from "passport-local"
import bcryptjs from "bcryptjs";

passport.use(
   new LocalStrategy({
      usernameField: "email",
      passwordField: "password"
   }, async (email: string, password: string, done) => {
      try {
         

         const isUeserExist = await User.findOne({ email })

      

         if (!isUeserExist) {
            return done("User Does not exist")
         }
         

         const isGogleAuthoenticated = isUeserExist.auths?.some(providerObject => providerObject.provider == "google")
         
         if (isGogleAuthoenticated && !isUeserExist.password) {
            return done("You have authenticated Through Google")
         }
         


         const isPasswordMatched = await bcryptjs.compare(password as string, isUeserExist.password)

         if (!isPasswordMatched) {
            return done(null, false,{message: "Password does not match"})
         }

         return done(null, isUeserExist)
         
      } catch (error) {
         
      }
  })
)

passport.use(
   new GoogleStrategy(
      {
         clientID: envVars.GOOGLE_CLIENT_ID,
         clientSecret: envVars.GOOGLE_CLIENT_SECRET,
         callbackURL: envVars.GOOGLE_CALLBACK_URL
      }, async (
         accessToken: string,
         refreshToken: string,
         profile: Profile,
         done: VerifyCallback
      ) => {
         try {
            const email = profile.emails?.[0].value;
            if (!email) {
               return done(null,false,{mesaage: "no email found"})
            }



            let user = await User.findOne({ email })
            if (!user) {
               user = await User.create({
                  email,
                  name: profile.displayName,
                  picture: profile.photos?.[0].value,
                  role: Role.USER,
                  isVerified: true,
                  auth: [
                     {
                        provider: "google",
                        providerId: profile.id,
                     },
                  ],

               })
            }

            return done(null, user)
         } catch (error) {
            console.log("Google strategy Error", error);
            return done(error)
            
         }
      }
   )
)






// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.serializeUser((user: Express.User, done: (err: any, id?: unknown) => void) => {
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   done(null, (user as any)._id); // user._id MongoDB 
});



// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.deserializeUser(async (id: string, done: any) => {
   try {

      const user = await User.findById(id)
      done(null, user)

   } catch (error) {
      console.log(error);
      done(error)

   }
})