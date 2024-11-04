import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import userRouter from "./routers/user-router";
import { config } from "dotenv";
import errorMiddleware from "./middlewares/error-middleware";
import codeRouter from "./routers/code.router";
import postRouter from "./routers/post-router";
import reactionRouter from "./routers/reaction-router";
import commentRouter from "./routers/comment-router";
import subscribersPageOwnersRouter from "./routers/subscribersPageOwners-router";
import repostRouter from "./routers/repost-router";
import friendshipRouter from "./routers/friendship-router";
import messageRouter from "./routers/message-router";

config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/code", codeRouter);
app.use("/api/post", postRouter);
app.use("/api/reaction", reactionRouter);
app.use("/api/comment", commentRouter);
app.use("/api/subscribersPageOwners", subscribersPageOwnersRouter);
app.use("/api/repost", repostRouter);
app.use("/api/friendship", friendshipRouter);
app.use("/api/message", messageRouter);

app.use(errorMiddleware);

const PORT = Number(process.env.SERVER_PORT) || 8080;

const start = async () => {
    try {
        app.listen(PORT, () =>
            console.log(`[server] started on PORT = ${PORT}`)
        );
    } catch (error) {
        console.log(error);
    }
};

start();
