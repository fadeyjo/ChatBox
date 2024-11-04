import { Router } from "express";
import userController from "../controllers/user-controller";
import { body, param } from "express-validator";
import authMiddleware from "../middlewares/auth-middleware";

const userRouter = Router();

userRouter.post(
    "/registration",
    body("lastName").custom((value) => {
        const regex = new RegExp(/^[A-Z][a-z]{2,49}$/);
        if (regex.test(value)) {
            return true;
        }
        return false;
    }),
    body("firstName").custom((value) => {
        const regex = new RegExp(/^[A-Z][a-z]{2,49}$/);
        if (regex.test(value)) {
            return true;
        }
        return false;
    }),
    body("patronymic").custom((value) => {
        if (!value) {
            return true;
        }
        const regex = new RegExp(/^[A-Z][a-z]{2,49}$/);
        if (regex.test(value)) {
            return true;
        }
        return false;
    }),
    body("email").isEmail(),
    body("nickname").custom((value) => {
        const regex = new RegExp(/^[A-Za-z0-9]{3,50}$/);
        if (regex.test(value)) {
            return true;
        }
        return false;
    }),
    body("password").isLength({ min: 8, max: 50 }),
    body("repeatPassword").isLength({ min: 8, max: 50 }),
    userController.registration
);
userRouter.post(
    "/login",
    body("email").isEmail(),
    body("password").isLength({ min: 8, max: 50 }),
    userController.login
);
userRouter.get(
    "/:userId",
    param("userId").isNumeric(),
    authMiddleware,
    userController.getUserById
);

export default userRouter;
