import express from "express";
import { checkAuth } from "../../middlewares/chakauth";
import { Role } from "../user/user.interface";
import { TransactionController } from "./transaction.contoller";


const router = express.Router();


router.get("/me", checkAuth(Role.USER,Role.AGENT), TransactionController.myTransactions);
router.get("/all", checkAuth(Role.ADMIN), TransactionController.allTransactions);

export default router;


