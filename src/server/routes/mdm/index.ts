import Router from "koa-router";

import WorkflowRoutes from "./workflow";

const router = new Router();

router.use("/workflow", WorkflowRoutes);

export default router.routes();
