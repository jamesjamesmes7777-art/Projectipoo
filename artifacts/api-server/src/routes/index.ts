import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import certificatesRouter from "./certificates";
import adminRouter from "./admin";
import inventoryRouter from "./inventory";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(certificatesRouter);
router.use(adminRouter);
router.use(inventoryRouter);

export default router;
