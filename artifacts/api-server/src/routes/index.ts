import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import certificatesRouter from "./certificates";
import adminRouter from "./admin";
import inventoryRouter from "./inventory";
import stockPriceRouter from "./stockPrice";
import stockCandlesRouter from "./stockCandles";
import agreementsRouter from "./agreements";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(certificatesRouter);
router.use(adminRouter);
router.use(inventoryRouter);
router.use(stockPriceRouter);
router.use(stockCandlesRouter);
router.use(agreementsRouter);

export default router;
