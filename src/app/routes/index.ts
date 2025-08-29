
import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { WalletRoutes } from '../modules/wallet/wallet.route';


export const router = Router();

const moduleRouters = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
    {
    path: '/Wallet',
    route: WalletRoutes,
  },
];

moduleRouters.forEach(route => {
  router.use(route.path, route.route);
});
