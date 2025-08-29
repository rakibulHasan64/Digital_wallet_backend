import express from "express";
import { checkAuth } from "../../middlewares/chakauth";
import { Role } from "../user/user.interface";
import { WalletController } from "./wallet.contoller";




const router = express.Router();

// ✅ User ওয়ালেট operations
router.post("/add-many", checkAuth(Role.USER), WalletController.addMoney);
router.post("/withdraw",  checkAuth(Role.USER), WalletController.withdrawMoney);
router.post("/send",  checkAuth(Role.USER), WalletController.sendMany);
router.get("/transactions/me", checkAuth(Role.USER), WalletController.myTransactions);

// ✅ Agent operations
router.post("/agent/cashin", checkAuth(Role.AGENT), WalletController.cashIn);
router.post("/agent/cashout", checkAuth(Role.AGENT), WalletController.cashOut);

// ✅ Admin operations
router.get("/admin/users", checkAuth(Role.ADMIN), WalletController.allUsers);
router.patch("/admin/wallet/block/:id", checkAuth(Role.ADMIN), WalletController.blockWallet);


export const WalletRoutes = router;
