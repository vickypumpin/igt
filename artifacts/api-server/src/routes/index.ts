import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import creatorsRouter from "./creators";
import campaignsRouter from "./campaigns";
import invitesRouter from "./invites";
import submissionsRouter from "./submissions";
import paymentsRouter from "./payments";
import messagesRouter from "./messages";
import notificationsRouter from "./notifications";
import dashboardRouter from "./dashboard";
import adminRouter from "./admin";
import settingsRouter from "./settings";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(creatorsRouter);
router.use(campaignsRouter);
router.use(invitesRouter);
router.use(submissionsRouter);
router.use(paymentsRouter);
router.use(messagesRouter);
router.use(notificationsRouter);
router.use(dashboardRouter);
router.use(adminRouter);
router.use(settingsRouter);

export default router;
