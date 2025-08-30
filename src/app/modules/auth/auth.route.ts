// import { NextFunction, Request, Response, Router } from "express";

import { NextFunction, Request, Response, Router } from "express";
import { AuthController } from "./auth.contoller";
import { checkAuth } from "../../middlewares/chakauth";
import { Role } from "../user/user.interface";
import passport from "passport";

// import { Role } from "../user/user.interface";
// import passport from "passport";
// import { envVars } from "../../config/env";
const router = Router();

router.post("/login", AuthController.credentialsLogin)
router.post("/refresh-token", AuthController.getNewAccessToken)
router.post("/logout", AuthController.logout)
router.post("/change-password", checkAuth(...Object.values(Role)), AuthController.changePassword)
router.post("/set-password", checkAuth(...Object.values(Role)), AuthController.setPassword)
router.post("/forgot-password", AuthController.forgotPassword)
router.post("/reset-password", checkAuth(...Object.values(Role)), AuthController.resetPassword)






// google 
router.get("/google", async (req: Request, res: Response, next: NextFunction) => {
   const redirect=req.query.redirect || "/"
   passport.authenticate("google",{scope: ["profile","email"], state: redirect as string})(req,res,next)
})


router.get("/google/callback", passport.authenticate("google",{failureRedirect: "/login"}),AuthController.googleCallBackConttoler)




// router.get('/google/callback', passport.authenticate("google", {failureRedirect: `${envVars.FONTEND_URL}?error=There is some issues with Your account . plase concat support temeas`}), AuthController.googleCallbackContolar )



export const AuthRoutes = router;