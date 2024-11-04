import { Router } from "express";
import subscribersPageOwnersController from "../controllers/subscribersPageOwners-controller";
import authMiddleware from "../middlewares/auth-middleware";
import { body, param } from "express-validator";

const subscribersPageOwnersRouter = Router();

subscribersPageOwnersRouter.post(
    "/",
    body("subscriberId").isNumeric(),
    body("pageOwnerId").isNumeric(),
    authMiddleware,
    subscribersPageOwnersController.newSubscribersPageOwners
);
subscribersPageOwnersRouter.get(
    "/:pageOwnerId",
    param("pageOwnerId").isNumeric(),
    authMiddleware,
    subscribersPageOwnersController.getSubscribersPageOwnersByPageOwnerId
);
subscribersPageOwnersRouter.delete(
    "/:subscriberId/:pageOwnerId",
    param("subscriberId").isNumeric(),
    param("pageOwnerId").isNumeric(),
    authMiddleware,
    subscribersPageOwnersController.deleteSubscibersPageOwnersByPageOwnerId
);

export default subscribersPageOwnersRouter;
