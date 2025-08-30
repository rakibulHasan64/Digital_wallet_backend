import {  NextFunction, Request, Response, Router,  } from "express";

// import { createUserZodSchema } from "./userVladition";
// import { Role } from "./user.interface";
// import { checkAuth } from "../../middlewares/chakAuth";
// import { validateRequest } from "../../middlewares/validateRequest";
import { userController } from "./user.controller";
import { checkAuth } from "../../middlewares/chakauth";
import { Role } from "./user.interface";



const router = Router();



// ✅ Routes
router.post("/register", userController.createUser);
router.get("/all-user",checkAuth(Role.ADMIN), userController.getAllUsers)
router.get("/me", checkAuth(...Object.values(Role)), userController.getMyProfile);
router.patch("/me",  checkAuth("USER", "AGENT"), userController.updateMyProfile);
router.get("/",  checkAuth("ADMIN"), userController.getAllUsers);

router.patch("/:userId",  checkAuth("ADMIN"), userController.updateUserByAdmin);
export const UserRoutes = router;

