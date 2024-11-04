import { Router } from "express";
import codeController from "../controllers/code-controller";
import { body } from "express-validator";

const codeRouter = Router();

codeRouter.post(
    "/",
    body("email").isEmail(),
    body("code").custom((value) => {
        if (typeof value != "number") {
            console.log(value);
            return false;
        }
        if (value < 100000 || value > 999999) {
            return false;
        }
        return true;
    }),
    codeController.checkCode
);

export default codeRouter;
